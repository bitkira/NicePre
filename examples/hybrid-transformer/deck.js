const ASSET_PATH = "./assets/transformer-interior-v3.png";

const tex = (source, displayMode = false) =>
  katex.renderToString(source, { displayMode, throwOnError: false, strict: "ignore" });

const slideShell = ({ eyebrow, title, page, body }) => `
  <section class="slide">
    <p class="eyebrow">${eyebrow}</p>
    <h1 class="title">${title}</h1>
    <div class="page">${page}</div>
    ${body}
  </section>
`;

const slideOne = slideShell({
  eyebrow: "Hybrid raster test",
  title: "Generated model interior, formula-first",
  page: "01",
  body: `
    <div class="hybrid-stage">
      <img class="asset" src="${ASSET_PATH}" alt="Text-free generated transformer interior illustration" />
    </div>

    <div class="formula-strip">
      <div class="formula" data-formula-panel>
        <div class="formula-title" data-formula-title>attention weights</div>
        <div class="math">${tex("\\alpha_{ij}=\\mathrm{softmax}_{j}(q_i k_j^{\\top} d_k^{-1/2})")}</div>
      </div>
      <div class="formula" data-formula-panel>
        <div class="formula-title" data-formula-title>residual block</div>
        <div class="math">${tex("h'=h+\\mathrm{FFN}(\\mathrm{Attn}(h))")}</div>
      </div>
    </div>
  `,
});

const slideTwo = slideShell({
  eyebrow: "Asset audit",
  title: "Imagegen supplies texture, KaTeX supplies truth",
  page: "02",
  body: `
    <div class="audit-grid">
      <img class="audit-image" src="${ASSET_PATH}" alt="Generated transformer asset audit preview" />
      <div class="audit-list">
        <div class="audit-item">
          <div class="audit-term">text-free</div>
          <div class="audit-note">no baked-in labels, formulas, or pseudo-glyphs</div>
        </div>
        <div class="audit-item">
          <div class="audit-term">palette</div>
          <div class="audit-note">soft blue, green, peach, lavender on light canvas</div>
        </div>
        <div class="audit-item">
          <div class="audit-term">formula-first</div>
          <div class="audit-note">exact meaning lives in adjacent KaTeX, not on-image callouts</div>
        </div>
      </div>
    </div>
    <div class="asset-rule"><strong>Bitmap for intuition.</strong>&nbsp; KaTeX for precision.</div>
  `,
});

document.body.innerHTML = `${slideOne}${slideTwo}`;

if (document.fonts?.ready) {
  document.fonts.ready.then(() => document.body.classList.add("math-ready"));
} else {
  document.body.classList.add("math-ready");
}
