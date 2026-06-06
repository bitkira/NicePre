#!/usr/bin/env node

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = {
    input: null,
    out: "export",
    slides: ".slide",
    width: 1600,
    height: 900,
    ready: "body.math-ready",
    delay: 2600,
    chromeExecutable: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!args.input && !value.startsWith("--")) {
      args.input = value;
      continue;
    }

    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${value}`);
      return argv[i];
    };

    if (value === "--out") args.out = next();
    else if (value === "--slides") args.slides = next();
    else if (value === "--width") args.width = Number(next());
    else if (value === "--height") args.height = Number(next());
    else if (value === "--ready") args.ready = next();
    else if (value === "--delay") args.delay = Number(next());
    else if (value === "--chrome-executable") args.chromeExecutable = next();
    else if (value === "--help" || value === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  if (!args.input) throw new Error("Missing input HTML path or URL");
  if (!Number.isFinite(args.width) || !Number.isFinite(args.height)) {
    throw new Error("--width and --height must be numbers");
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node render-deck.mjs <deck.html|url> [options]

Options:
  --out <dir>                 Output directory, default: export
  --slides <selector>         Slide selector, default: .slide
  --width <px>                Viewport width, default: 1600
  --height <px>               Viewport height, default: 900
  --ready <selector|none>     Selector to wait for, default: body.math-ready
  --delay <ms>                Final layout delay, default: 2600
  --chrome-executable <path>  Optional Chrome/Chromium executable
`);
}

async function importPlaywright() {
  const candidates = ["playwright"];
  if (process.env.NODE_PATH) {
    process.env.NODE_PATH.split(path.delimiter)
      .filter(Boolean)
      .forEach((moduleDir) => {
        candidates.push(pathToFileURL(path.join(moduleDir, "playwright", "index.mjs")).href);
      });
  }

  for (const candidate of candidates) {
    try {
      return await import(candidate);
    } catch {
      // Try the next resolution strategy.
    }
  }

  try {
    return await import("playwright/index.mjs");
  } catch (error) {
    throw new Error(
      "Cannot import playwright. Install it in the project with `npm i -D playwright`, set NODE_PATH to a node_modules directory that contains Playwright, or run in a Codex workspace runtime that provides Playwright.",
      { cause: error },
    );
  }
}

function importSharp() {
  try {
    return require("sharp");
  } catch {
    if (process.env.NODE_PATH) {
      for (const moduleDir of process.env.NODE_PATH.split(path.delimiter).filter(Boolean)) {
        try {
          return require(path.join(moduleDir, "sharp"));
        } catch {
          // Try the next module directory.
        }
      }
    }
    return null;
  }
}

function toUrl(input) {
  if (/^https?:\/\//.test(input) || input.startsWith("file://")) return input;
  return pathToFileURL(path.resolve(input)).href;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chromium } = await importPlaywright();
  const sharp = importSharp();
  const inputUrl = toUrl(args.input);
  const outDir = path.resolve(args.out);
  await fs.mkdir(outDir, { recursive: true });

  const launchOptions = {
    headless: true,
    args: ["--allow-file-access-from-files"],
  };
  if (args.chromeExecutable) {
    launchOptions.executablePath = args.chromeExecutable;
  } else {
    const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    if (existsSync(macChrome)) launchOptions.executablePath = macChrome;
  }

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({
    viewport: { width: args.width, height: args.height },
    deviceScaleFactor: 1,
  });

  await page.goto(inputUrl, { waitUntil: "load" });
  if (args.ready && args.ready !== "none") {
    try {
      await page.waitForSelector(args.ready, { timeout: 5000 });
    } catch {
      console.warn(`Warning: ready selector not found within 5s: ${args.ready}`);
    }
  }
  await page.evaluate(async (delay) => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }, args.delay);

  const slideCount = await page.locator(args.slides).count();
  if (slideCount === 0) throw new Error(`No slides matched selector: ${args.slides}`);

  const screenshotPaths = [];
  for (let i = 0; i < slideCount; i += 1) {
    const name = `slide-${String(i + 1).padStart(2, "0")}.png`;
    const filePath = path.join(outDir, name);
    await page.locator(args.slides).nth(i).screenshot({ path: filePath });
    screenshotPaths.push(filePath);
  }

  const report = await page.evaluate(
    ({ slideSelector }) => {
      const rect = (element) => {
        const r = element.getBoundingClientRect();
        return {
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      };
      const overlaps = (a, b) =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

      return Array.from(document.querySelectorAll(slideSelector)).map((slide, index) => {
        const slideRect = rect(slide);
        const overflowElements = Array.from(slide.querySelectorAll("*")).filter((element) => {
          const r = rect(element);
          return (
            r.width > 0.5 &&
            r.height > 0.5 &&
            (r.left < slideRect.left - 1 ||
              r.right > slideRect.right + 1 ||
              r.top < slideRect.top - 1 ||
              r.bottom > slideRect.bottom + 1)
          );
        });

        const formulaOverlaps = [];
        slide.querySelectorAll("[data-formula-panel], .formula-panel").forEach((panel) => {
          const title = panel.querySelector("[data-formula-title], .formula-title");
          if (!title) return;
          const titleRect = rect(title);
          panel.querySelectorAll(".katex, .katex *").forEach((math) => {
            const mathRect = rect(math);
            if (mathRect.width > 0.5 && mathRect.height > 0.5 && overlaps(titleRect, mathRect)) {
              formulaOverlaps.push({
                title: title.textContent.trim().slice(0, 60),
                math: math.textContent.trim().slice(0, 60),
              });
            }
          });
        });

        const labels = Array.from(
          slide.querySelectorAll('[data-role="row-label"], [data-lane="label"], [data-connector="false"]'),
        ).map((element) => ({ text: element.textContent.trim(), rect: rect(element) }));
        let arrowLabelHits = 0;
        slide.querySelectorAll("svg .arrow-line, svg path[marker-end]").forEach((path) => {
          if (!path.getTotalLength || !path.getPointAtLength) return;
          const svg = path.closest("svg");
          if (!svg || !svg.createSVGPoint || !svg.getScreenCTM()) return;
          const total = path.getTotalLength();
          for (let i = 0; i <= 80; i += 1) {
            const point = path.getPointAtLength((total * i) / 80);
            const svgPoint = svg.createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            const global = svgPoint.matrixTransform(svg.getScreenCTM());
            if (
              labels.some(
                (label) =>
                  global.x >= label.rect.left &&
                  global.x <= label.rect.right &&
                  global.y >= label.rect.top &&
                  global.y <= label.rect.bottom,
              )
            ) {
              arrowLabelHits += 1;
              break;
            }
          }
        });

        return {
          slide: index + 1,
          overflowCount: overflowElements.length,
          formulaTitleOverlapCount: formulaOverlaps.length,
          arrowLabelHitCount: arrowLabelHits,
          markerEndCount: slide.querySelectorAll("svg path[marker-end], svg .arrow-line[marker-end]").length,
          branchPathCount: slide.querySelectorAll("svg .arrow-branch").length,
        };
      });
    },
    { slideSelector: args.slides },
  );

  await fs.writeFile(
    path.join(outDir, "render-report.json"),
    `${JSON.stringify({ input: inputUrl, slides: report }, null, 2)}\n`,
  );

  const contactHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body{margin:0;background:#ecece9;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#323232}
.sheet{padding:24px;display:grid;grid-template-columns:repeat(2,800px);gap:24px;align-items:start}
.item{background:#fbfbf8;border:1px solid #d7dad4;border-radius:10px;overflow:hidden}
.item h2{margin:0;padding:10px 14px 11px;font-size:18px;font-weight:800;color:#4d7cc6;background:#edf4fa}
.item img{display:block;width:800px;height:450px;object-fit:contain;background:#fefefc}
</style>
</head>
<body>
<main class="sheet">
${screenshotPaths
  .map((filePath, index) => {
    const label = String(index + 1).padStart(2, "0");
    return `<section class="item"><h2>Slide ${label}</h2><img src="${pathToFileURL(filePath).href}"></section>`;
  })
  .join("\n")}
</main>
</body>
</html>`;
  await fs.writeFile(path.join(outDir, "contact-sheet.html"), contactHtml);

  if (sharp) {
    const resized = await Promise.all(
      screenshotPaths.map((filePath) => sharp(filePath).resize(800, 450).toBuffer()),
    );
    const columns = 2;
    const rows = Math.ceil(resized.length / columns);
    const cellWidth = 800;
    const cellHeight = 450;
    const headerHeight = 42;
    const gap = 24;
    const padding = 24;
    const sheetWidth = padding * 2 + columns * cellWidth + (columns - 1) * gap;
    const sheetHeight = padding * 2 + rows * (headerHeight + cellHeight) + (rows - 1) * gap;
    const composites = [];

    resized.forEach((image, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const left = padding + col * (cellWidth + gap);
      const top = padding + row * (headerHeight + cellHeight + gap);
      const label = String(index + 1).padStart(2, "0");
      const header = Buffer.from(
        `<svg width="${cellWidth}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#edf4fa"/><text x="14" y="27" font-family="-apple-system,BlinkMacSystemFont,Helvetica Neue,Arial,sans-serif" font-size="18" font-weight="800" fill="#4d7cc6">Slide ${label}</text></svg>`,
      );
      composites.push({ input: header, left, top });
      composites.push({ input: image, left, top: top + headerHeight });
    });

    await sharp({
      create: {
        width: sheetWidth,
        height: sheetHeight,
        channels: 3,
        background: "#ecece9",
      },
    })
      .composite(composites)
      .png()
      .toFile(path.join(outDir, "contact-sheet.png"));
  }

  await browser.close();
  const issueCount = report.reduce(
    (sum, slide) =>
      sum + slide.overflowCount + slide.formulaTitleOverlapCount + slide.arrowLabelHitCount,
    0,
  );
  console.log(
    JSON.stringify(
      {
        slides: slideCount,
        outDir,
        contactSheetPng: Boolean(sharp),
        issueCount,
        report: path.join(outDir, "render-report.json"),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
