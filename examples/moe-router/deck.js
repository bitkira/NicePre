const ASSET_PATH = "./assets/moe-routing-concept.png";

const needsDisplayStyle = (source) =>
  /\\(sum|prod|int|frac|lim|sup|inf|argmax|argmin)\b/.test(source);

const withDisplayLimits = (source) =>
  source
    .replace(/\\sum(?!\\limits|\\nolimits)/g, "\\sum\\limits")
    .replace(/\\prod(?!\\limits|\\nolimits)/g, "\\prod\\limits")
    .replace(/\\argmax(?!\\limits|\\nolimits)/g, "\\argmax\\limits")
    .replace(/\\argmin(?!\\limits|\\nolimits)/g, "\\argmin\\limits");

const tex = (source) => {
  const prepared = needsDisplayStyle(source)
    ? `\\displaystyle ${withDisplayLimits(source)}`
    : source;
  return katex.renderToString(prepared, {
    displayMode: false,
    throwOnError: false,
    strict: "ignore",
  });
};

const slideShell = ({ eyebrow, title, page, body }) => `
  <section class="slide">
    <p class="eyebrow">${eyebrow}</p>
    <h1 class="title">${title}</h1>
    <div class="page">${page}</div>
    ${body}
  </section>
`;

const formulaHtml = ({ title, math, tone = "" }) => `
  <div class="formula ${tone}" data-formula-panel>
    <div class="formula-title" data-formula-title>${title}</div>
    <div class="math">${tex(math)}</div>
  </div>
`;

const slideOne = slideShell({
  eyebrow: "Mixture of Experts",
  title: "Generated routing concept, formula-first",
  page: "01",
  body: `
    <div class="raster-stage">
      <img class="asset" src="${ASSET_PATH}" alt="Text-free generated MoE routing concept illustration" />
    </div>

    <div class="formula-row">
      ${[
        {
          title: "router gate",
          math: "p(e_i\\mid x)=\\operatorname{softmax}(W_g x)_i",
        },
        {
          title: "sparse mixture",
          math: "y(x)=\\sum\\limits_{i\\in S(x)}p(e_i\\mid x)\\,E_i(x)",
          tone: "green",
        },
      ]
        .map(formulaHtml)
        .join("")}
    </div>
  `,
});

const slideTwo = slideShell({
  eyebrow: "Raster Asset Rule",
  title: "Imagegen suggests the system, KaTeX states the math",
  page: "02",
  body: `
    <div class="audit-grid">
      <img class="audit-image" src="${ASSET_PATH}" alt="Generated MoE raster asset audit preview" />
      <div class="audit-list">
        <div class="audit-item">
          <div class="audit-term">bitmap object</div>
          <div class="audit-note">soft routing metaphor, not a hand-built flowchart</div>
        </div>
        <div class="audit-item">
          <div class="audit-term">text-free</div>
          <div class="audit-note">no baked-in labels, variables, legends, or pseudo-glyphs</div>
        </div>
        <div class="audit-item">
          <div class="audit-term">formula-first</div>
          <div class="audit-note">exact definitions stay in adjacent KaTeX groups</div>
        </div>
      </div>
    </div>
    <div class="asset-rule"><strong>Generated image for intuition.</strong>&nbsp; Code-native math for truth.</div>
  `,
});

document.body.innerHTML = `${slideOne}${slideTwo}`;

if (document.fonts?.ready) {
  document.fonts.ready.then(() => document.body.classList.add("math-ready"));
} else {
  document.body.classList.add("math-ready");
}
