const needsDisplayStyle = (source) =>
  /\\(sum|prod|int|frac|lim|sup|inf|argmax|argmin)\b/.test(source);

const withDisplayLimits = (source) =>
  source
    .replace(/\\sum(?!\\limits|\\nolimits)/g, "\\sum\\limits")
    .replace(/\\prod(?!\\limits|\\nolimits)/g, "\\prod\\limits")
    .replace(/\\coprod(?!\\limits|\\nolimits)/g, "\\coprod\\limits")
    .replace(/\\bigcup(?!\\limits|\\nolimits)/g, "\\bigcup\\limits")
    .replace(/\\bigcap(?!\\limits|\\nolimits)/g, "\\bigcap\\limits")
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

const slides = [
  {
    eyebrow: "Mixture of Experts",
    title: "Router turns tokens into expert scores",
    page: "01",
    image: "./assets/moe-stage-01-router.png",
    formulas: [
      {
        title: "gate",
        math: "p(e_i\\mid x)=\\operatorname{softmax}(W_g x)_i",
      },
      {
        title: "sparse choice",
        math: "S(x)=\\operatorname{TopK}(p(e_i\\mid x))",
        tone: "green",
      },
    ],
  },
  {
    eyebrow: "Sparse Dispatch",
    title: "Only a few experts receive each token",
    page: "02",
    image: "./assets/moe-stage-02-topk-ref.png",
    formulas: [
      {
        title: "dispatch mask",
        math: "m_i(x)=\\mathbf{1}\\{e_i\\in S(x)\\}",
      },
      {
        title: "expert call",
        math: "\\tilde{y}_i=m_i(x)\\,E_i(x)",
        tone: "green",
      },
    ],
  },
  {
    eyebrow: "Weighted Combine",
    title: "Selected experts mix back into one state",
    page: "03",
    image: "./assets/moe-stage-03-combine-ref.png",
    formulas: [
      {
        title: "mixture output",
        math: "y(x)=\\sum\\limits_{i\\in S(x)}p(e_i\\mid x)\\,E_i(x)",
      },
      {
        title: "load balance",
        math: "\\mathcal{L}_{aux}=\\alpha N\\sum\\limits_i f_i P_i",
        tone: "purple",
      },
    ],
  },
];

const formulaHtml = ({ title, math, tone = "" }) => `
  <div class="formula ${tone}" data-formula-panel>
    <div class="formula-title" data-formula-title>${title}</div>
    <div class="math">${tex(math)}</div>
  </div>
`;

document.body.innerHTML = slides
  .map(
    (slide) => `
      <section class="slide">
        <p class="eyebrow">${slide.eyebrow}</p>
        <h1 class="title">${slide.title}</h1>
        <div class="page">${slide.page}</div>
        <img class="stage-image" src="${slide.image}" alt="${slide.title}" />
        <div class="formula-row">
          ${slide.formulas.map(formulaHtml).join("")}
        </div>
      </section>
    `,
  )
  .join("");

if (document.fonts?.ready) {
  document.fonts.ready.then(() => document.body.classList.add("math-ready"));
} else {
  document.body.classList.add("math-ready");
}
