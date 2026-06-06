const deck = document.getElementById("deck");

const katexOptions = {
  throwOnError: false,
  strict: "ignore",
  output: "html",
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function math(tex, className = "") {
  const safeTex = escapeHtml(tex);
  const classes = className ? ` ${className}` : "";
  return `<span class="tex${classes}" data-tex="${safeTex}">${safeTex}</span>`;
}

function header(index, eyebrow, title, subtitle = "") {
  return `
    <header class="slide-header">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="title">${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
      </div>
      <div class="slide-number">${String(index).padStart(2, "0")}</div>
    </header>
  `;
}

function arrowSvg(id, connectors) {
  return `
    <svg class="arrow-svg" data-arrow-root data-marker="${id}" data-connectors="${connectors}" aria-hidden="true">
      <defs>
        <marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
          <path class="arrow-head-path" d="M1.5 1.7 L8 5 L1.5 8.3" />
        </marker>
      </defs>
      <g class="arrow-layer"></g>
    </svg>
  `;
}

function flowItem(key, tex, label, fill = "unknown-fill", large = false) {
  return `
    <div class="flow-item ${large ? "large" : ""} ${fill}" data-node="${key}">
      <div class="flow-symbol">${math(tex)}</div>
      <div class="flow-label">${label}</div>
    </div>
  `;
}

function completionRow(id, text, score) {
  return `
    <div class="completion">
      <div class="completion-id" data-role="row-label" data-lane="label" data-connector="false">${math(`${id.replace("o", "o_")}`)}</div>
      <div class="completion-text" data-node="${id}-text" data-role="connector-target" data-lane="connector">${text}</div>
      <div class="score" data-node="${id}-score" data-role="connector-target" data-lane="connector">${score}</div>
    </div>
  `;
}

function groupConstructionDiagram(rows) {
  const connectors = rows
    .flatMap((row) => [`q>${row.id}-text`, `${row.id}-score>base`])
    .join(" ");

  return `
    ${arrowSvg("arrow-s3", connectors)}
    <div class="group-canvas">
      <div class="prompt-card" data-node="q">${math("q")}</div>
      <div class="completion-stack">
        ${rows.map((row) => completionRow(row.id, row.text, row.score)).join("")}
      </div>
      <div class="baseline-card" data-node="base">
        <div>${math("\\mu_G,\\;\\sigma_G")}</div>
        <div class="small-label">group statistics</div>
      </div>
    </div>
  `;
}

function formulaPanel(title, body, options = {}) {
  const classes = options.classes ? ` ${options.classes}` : "";
  const style = options.style ? ` style="${options.style}"` : "";
  const gap = options.gap ?? 12;
  const bottom = options.bottom ?? 28;
  const top = options.top ?? 16;
  const align = options.align || "center";
  return `
    <section class="formula-panel${classes}"${style} data-formula-panel data-formula-gap="${gap}" data-formula-top="${top}" data-formula-bottom="${bottom}" data-formula-align="${align}">
      <div class="formula-title" data-formula-title>${title}</div>
      <div class="formula-body ${options.bodyClass || ""}" data-formula-body>
        ${body}
      </div>
    </section>
  `;
}

function taggedTerm(tag, tex) {
  return `
    <span class="tagged-term">
      <span class="term-tag" data-formula-measure>${tag}</span>
      <span class="formula-main" data-formula-measure>${math(tex)}</span>
    </span>
  `;
}

function renderMath() {
  if (!window.katex) {
    document.body.classList.add("math-fallback");
    return;
  }

  document.querySelectorAll("[data-tex]").forEach((element) => {
    window.katex.render(element.dataset.tex, element, katexOptions);
  });
  document.body.classList.add("math-ready");
}

function layoutFormulaPanels() {
  document.querySelectorAll("[data-formula-panel]").forEach((panel) => {
    const body = panel.querySelector("[data-formula-body]");
    const title = panel.querySelector("[data-formula-title]");
    if (!body || !title) return;

    const labelElements = Array.from(panel.querySelectorAll("[data-formula-measure]")).filter(
      (element) => element.classList.contains("term-tag"),
    );
    const mathElements = Array.from(panel.querySelectorAll(".katex"));
    const captionElements = Array.from(panel.querySelectorAll(".formula-caption"));
    if (labelElements.length + mathElements.length + captionElements.length === 0) return;

    body.style.setProperty("--formula-body-y", "0px");

    const panelRect = panel.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const gap = Number(panel.dataset.formulaGap || 12);
    const topPadding = Number(panel.dataset.formulaTop || 16);
    const bottomPadding = Number(panel.dataset.formulaBottom || 28);
    const align = panel.dataset.formulaAlign || "center";
    const safeBottom = panelRect.height - bottomPadding;

    const relativeRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - panelRect.left,
        right: rect.right - panelRect.left,
        top: rect.top - panelRect.top,
        bottom: rect.bottom - panelRect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const boxesFor = (element) => {
      const elements = element.classList.contains("katex")
        ? [element, ...Array.from(element.querySelectorAll("*"))]
        : [element];
      return elements.map(relativeRect).filter((rect) => rect.width > 0.5 && rect.height > 0.5);
    };

    const titleBox = relativeRect(title);
    const labelBoxes = labelElements.flatMap(boxesFor);
    const mathBoxes = mathElements.flatMap(boxesFor);
    const captionBoxes = captionElements.flatMap(boxesFor);
    const measureBoxes = [...labelBoxes, ...mathBoxes, ...captionBoxes];
    if (measureBoxes.length === 0) return;

    const mathBounds = mathBoxes.reduce(
      (acc, rect) => {
        return {
          top: Math.min(acc.top, rect.top),
          bottom: Math.max(acc.bottom, rect.bottom),
        };
      },
      { top: Infinity, bottom: -Infinity },
    );

    const measureBounds = measureBoxes.reduce(
      (acc, rect) => {
        return {
          top: Math.min(acc.top, rect.top),
          bottom: Math.max(acc.bottom, rect.bottom),
        };
      },
      { top: Infinity, bottom: -Infinity },
    );

    const centeredShift =
      (topPadding + safeBottom - (measureBounds.bottom - measureBounds.top)) / 2 -
      measureBounds.top;
    const bottomShift = safeBottom - measureBounds.bottom;
    const maxShift = safeBottom - measureBounds.bottom;
    let minShift = -Infinity;

    measureBoxes.forEach((rect) => {
      const overlapsTitleColumn = rect.left < titleBox.right && rect.right > titleBox.left;
      const minTop = overlapsTitleColumn ? titleBox.bottom + gap : topPadding;
      minShift = Math.max(minShift, minTop - rect.top);
    });

    let shift = align === "bottom" ? bottomShift : centeredShift;
    shift = Math.max(shift, minShift);
    if (minShift <= maxShift) {
      shift = Math.min(shift, maxShift);
    }

    const bounds = measureBoxes.reduce(
      (acc, rect) => {
        return {
          top: Math.min(acc.top, rect.top + shift),
          bottom: Math.max(acc.bottom, rect.bottom + shift),
        };
      },
      { top: Infinity, bottom: -Infinity },
    );

    body.style.setProperty("--formula-body-y", `${shift.toFixed(1)}px`);
    panel.dataset.formulaLayout = JSON.stringify({
      align,
      safeBottom: Number(safeBottom.toFixed(1)),
      groupTop: Number(bounds.top.toFixed(1)),
      groupBottom: Number(bounds.bottom.toFixed(1)),
      mathBottom: Number((mathBounds.bottom + shift).toFixed(1)),
      shift: Number(shift.toFixed(1)),
    });
  });
}

function drawConnectors() {
  document.querySelectorAll("[data-arrow-root]").forEach((svg) => {
    const scope = svg.closest("[data-connector-scope]");
    const layer = svg.querySelector(".arrow-layer");
    if (!scope || !layer) return;

    const scopeRect = scope.getBoundingClientRect();
    const marker = svg.dataset.marker;
    const connectableElements = Array.from(scope.querySelectorAll("[data-node]")).filter(
      (element) =>
        element.dataset.connector !== "false" && element.dataset.lane !== "label",
    );
    const nodes = new Map(
      connectableElements.map((element) => [
        element.dataset.node,
        element,
      ]),
    );

    svg.setAttribute("viewBox", `0 0 ${scope.offsetWidth} ${scope.offsetHeight}`);
    layer.replaceChildren();

    const rectFor = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - scopeRect.left,
        right: rect.right - scopeRect.left,
        top: rect.top - scopeRect.top,
        bottom: rect.bottom - scopeRect.top,
        centerX: (rect.left + rect.right) / 2 - scopeRect.left,
        centerY: (rect.top + rect.bottom) / 2 - scopeRect.top,
      };
    };

    const addPath = (d, options = {}) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", options.className || "arrow-line");
      if (options.marker !== false) {
        path.setAttribute("marker-end", `url(#${marker})`);
      }
      path.setAttribute("d", d);
      layer.append(path);
    };

    const connectorEntries = svg.dataset.connectors
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((spec) => {
        const [fromKey, toKey] = spec.split(">");
        const from = nodes.get(fromKey);
        const to = nodes.get(toKey);
        if (!from || !to) return null;

        return {
          spec,
          fromKey,
          toKey,
          a: rectFor(from),
          b: rectFor(to),
        };
      })
      .filter(Boolean);

    const byTarget = new Map();
    connectorEntries.forEach((entry) => {
      if (!byTarget.has(entry.toKey)) byTarget.set(entry.toKey, []);
      byTarget.get(entry.toKey).push(entry);
    });

    const groupedSpecs = new Set();

    byTarget.forEach((entries) => {
      const leftToRightFanIn =
        entries.length > 1 && entries.every((entry) => entry.b.left > entry.a.right);
      if (!leftToRightFanIn) return;

      entries.forEach((entry) => groupedSpecs.add(entry.spec));

      const target = entries[0].b;
      const sourceYs = entries.map((entry) => entry.a.centerY);
      const minY = Math.min(...sourceYs, target.centerY);
      const maxY = Math.max(...sourceYs, target.centerY);
      const maxSourceRight = Math.max(...entries.map((entry) => entry.a.right));
      const gap = target.left - maxSourceRight;
      const joinX = target.left - Math.min(46, Math.max(24, gap * 0.42));
      const endX = target.left - Math.min(14, Math.max(6, gap * 0.18));
      const joinY = target.centerY;

      entries.forEach((entry) => {
        const sourceGap = target.left - entry.a.right;
        const startX = Math.min(
          entry.a.right + Math.min(10, Math.max(4, sourceGap * 0.12)),
          joinX - 8,
        );
        addPath(
          `M${startX.toFixed(1)} ${entry.a.centerY.toFixed(1)} L${joinX.toFixed(1)} ${entry.a.centerY.toFixed(1)}`,
          { marker: false, className: "arrow-line arrow-branch" },
        );
      });

      addPath(
        `M${joinX.toFixed(1)} ${minY.toFixed(1)} L${joinX.toFixed(1)} ${maxY.toFixed(1)}`,
        { marker: false, className: "arrow-line arrow-branch" },
      );
      addPath(
        `M${joinX.toFixed(1)} ${joinY.toFixed(1)} L${endX.toFixed(1)} ${joinY.toFixed(1)}`,
      );
    });

    connectorEntries
      .filter((entry) => !groupedSpecs.has(entry.spec))
      .forEach(({ a, b }) => {
        const gap = b.left - a.right;
        const pad = Math.min(14, Math.max(4, gap * 0.22));
        const startX = a.right + pad;
        const endX = b.left - pad;
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const sourceY =
          a.bottom - a.top > (b.bottom - b.top) * 1.35
            ? clamp(b.centerY, a.top + 12, a.bottom - 12)
            : a.centerY;
        const targetY =
          b.bottom - b.top > (a.bottom - a.top) * 1.35
            ? clamp(sourceY, b.top + 12, b.bottom - 12)
            : b.centerY;

        if (Math.abs(sourceY - targetY) < 1) {
          addPath(
            `M${startX.toFixed(1)} ${sourceY.toFixed(1)} L${endX.toFixed(1)} ${targetY.toFixed(1)}`,
          );
          return;
        }

        const midX = (startX + endX) / 2;
        addPath(
          `M${startX.toFixed(1)} ${sourceY.toFixed(1)} C${midX.toFixed(1)} ${sourceY.toFixed(1)}, ${midX.toFixed(1)} ${targetY.toFixed(1)}, ${endX.toFixed(1)} ${targetY.toFixed(1)}`,
        );
      });
  });
}

const slides = [
  `
  <section class="slide" data-slide="03">
    ${header(3, "Sampling Unit", "One prompt, many answers", "GRPO's comparison set is local: completions are sampled for the same prompt, then ranked by their own group statistics.")}
    <main class="content">
      <section class="panel group-panel green" data-connector-scope>
        <div>
          <h2 class="panel-title" style="color: var(--main-blue);">Group construction</h2>
          <p class="panel-note">For each prompt ${math("q")}, sample ${math("G")} candidate responses from the current policy.</p>
        </div>
        ${groupConstructionDiagram([
          { id: "o1", text: "Correct path, concise reasoning", score: "0.92" },
          { id: "o2", text: "Correct answer, noisy derivation", score: "0.70" },
          { id: "o3", text: "Wrong final value", score: "0.18" },
          { id: "o4", text: "Partial reasoning only", score: "0.42" },
        ])}
      </section>
    </main>
  </section>
  `,
  `
  <section class="slide" data-slide="05">
    ${header(5, "Objective", "PPO-style update without a critic", "GRPO keeps the clipped policy ratio and KL control, but plugs in the group-relative advantage instead of a value-model advantage.")}
    <main class="content">
      ${formulaPanel(
        "GRPO objective, compact view",
        `<div class="formula-main" style="font-size: 30px;">${math("\\begin{aligned}J_{\\mathrm{GRPO}}(\\theta)=\\mathbb E_{q,\\{o_i\\}_{i=1}^{G}}\\frac{1}{G}\\sum_{i=1}^{G}\\frac{1}{|o_i|}\\sum_t\\Big[&\\min(\\rho_{i,t}\\hat A_i,\\operatorname{clip}(\\rho_{i,t},1-\\epsilon,1+\\epsilon)\\hat A_i)\\\\&-\\beta D_{\\mathrm{KL}}(\\pi_\\theta\\,\\|\\,\\pi_{\\mathrm{ref}})\\Big]\\end{aligned}")}</div>`,
        { classes: "blue objective-formula", bottom: 24, gap: 18 },
      )}
      <div class="term-glossary">
        <section class="term-note"><h2>${math("\\rho_{i,t}")}</h2><p>The policy ratio compares current and old token probabilities.</p></section>
        <section class="term-note"><h2>${math("\\hat A_i")}</h2><p>The group-normalized reward tells which completions to reinforce.</p></section>
        <section class="term-note"><h2>${math("\\beta D_{KL}")}</h2><p>The reference policy prevents reward hacking and unstable drift.</p></section>
      </div>
    </main>
  </section>
  `,
];

deck.innerHTML = slides.join("");

renderMath();
layoutFormulaPanels();
drawConnectors();

if (document.fonts) {
  document.fonts.ready.then(() => {
    layoutFormulaPanels();
    drawConnectors();
  });
}

window.setTimeout(() => {
  layoutFormulaPanels();
  drawConnectors();
}, 800);

window.setTimeout(() => {
  layoutFormulaPanels();
  drawConnectors();
}, 2400);

window.addEventListener("resize", () => {
  layoutFormulaPanels();
  drawConnectors();
});
