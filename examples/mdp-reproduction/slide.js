const body = document.body;

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
  const classes = className ? ` ${className}` : "";
  const safeTex = escapeHtml(tex);
  return `<span class="tex${classes}" data-tex="${safeTex}">${safeTex}</span>`;
}

function rewardTerm(tex) {
  return `<span class="math-highlight">${math(tex)}</span>`;
}

function arrowMarker(id) {
  return `
    <defs>
      <marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
        <path class="arrow-head-path" d="M1.5 1.7 L8 5 L1.5 8.3" />
      </marker>
    </defs>
    <g class="arrow-layer"></g>
  `;
}

function timelineNode(key, type, tex, extraClass = "") {
  const classes = extraClass ? ` ${extraClass}` : "";
  return `<div class="timeline-item node ${type}${classes}" data-key="${key}">${math(tex)}</div>`;
}

function timelineDots(key) {
  return `<div class="timeline-item timeline-dots ellipsis" data-key="${key}">${math("\\ldots")}</div>`;
}

function timelineReward(key, tex, extraClass = "") {
  const classes = extraClass ? ` ${extraClass}` : "";
  return `<div class="timeline-reward node reward${classes}" data-key="${key}">${math(tex)}</div>`;
}

function renderMath() {
  if (!window.katex) {
    body.classList.add("math-fallback");
    return;
  }

  document.querySelectorAll("[data-tex]").forEach((element) => {
    window.katex.render(element.dataset.tex, element, katexOptions);
  });
  body.classList.add("math-ready");
}

function drawTimelineArrows() {
  document.querySelectorAll(".timeline-panel").forEach((panel) => {
    const svg = panel.querySelector(".arrow-svg");
    const layer = panel.querySelector(".arrow-layer");
    if (!svg || !layer) return;

    const panelBox = panel.getBoundingClientRect();
    const scaleX = panel.offsetWidth / panelBox.width;
    const scaleY = panel.offsetHeight / panelBox.height;
    const markerId = panel.dataset.marker;
    const keyToElement = new Map(
      Array.from(panel.querySelectorAll("[data-key]")).map((element) => [
        element.dataset.key,
        element,
      ]),
    );

    svg.setAttribute("viewBox", `0 0 ${panel.offsetWidth} ${panel.offsetHeight}`);
    layer.replaceChildren();

    const rectFor = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: (rect.left - panelBox.left) * scaleX,
        right: (rect.right - panelBox.left) * scaleX,
        top: (rect.top - panelBox.top) * scaleY,
        bottom: (rect.bottom - panelBox.top) * scaleY,
        centerX: ((rect.left + rect.right) / 2 - panelBox.left) * scaleX,
        centerY: ((rect.top + rect.bottom) / 2 - panelBox.top) * scaleY,
      };
    };

    const addPath = (d, className = "arrow-line") => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", className);
      path.setAttribute("marker-end", `url(#${markerId})`);
      path.setAttribute("d", d);
      layer.append(path);
    };

    const mainKeys = panel.dataset.main.trim().split(/\s+/);
    mainKeys.slice(0, -1).forEach((key, index) => {
      const from = keyToElement.get(key);
      const to = keyToElement.get(mainKeys[index + 1]);
      if (!from || !to) return;

      const fromRect = rectFor(from);
      const toRect = rectFor(to);
      const startX = fromRect.right + 13;
      const endX = toRect.left - 13;
      const y = (fromRect.centerY + toRect.centerY) / 2;
      addPath(`M${startX.toFixed(1)} ${y.toFixed(1)} L${endX.toFixed(1)} ${y.toFixed(1)}`);
    });

    panel.dataset.rewards.trim().split(/\s+/).forEach((spec) => {
      const match = spec.match(/^([^>]+)>([^:]+):(.+)$/);
      if (!match) return;

      const [, sourceKey, targetKey, rewardKey] = match;
      const source = keyToElement.get(sourceKey);
      const target = keyToElement.get(targetKey);
      const reward = keyToElement.get(rewardKey);
      if (!source || !target || !reward) return;

      const sourceRect = rectFor(source);
      const targetRect = rectFor(target);
      const rewardCenterX = (sourceRect.centerX + targetRect.centerX) / 2;
      reward.style.left = `${rewardCenterX}px`;

      const rewardRect = rectFor(reward);
      const startX = sourceRect.centerX + 13;
      const startY = sourceRect.bottom + 15;
      const endX = rewardRect.centerX - 7;
      const endY = rewardRect.top - 13;
      addPath(`M${startX.toFixed(1)} ${startY.toFixed(1)} L${endX.toFixed(1)} ${endY.toFixed(1)}`);
    });
  });
}

function layoutFormulaPanels() {
  document.querySelectorAll("[data-formula-panel]").forEach((panel) => {
    const body = panel.querySelector("[data-formula-body]");
    const title = panel.querySelector("[data-formula-title]");
    const labelElements = Array.from(panel.querySelectorAll("[data-formula-measure]")).filter(
      (element) => element.classList.contains("mini-tag"),
    );
    const mathElements = Array.from(
      panel.querySelectorAll(".discount-equation .katex, .discount-recursive .katex"),
    );
    const measureElements = [...labelElements, ...mathElements];
    if (!body || !title || measureElements.length === 0) return;

    body.style.setProperty("--formula-body-y", "0px");

    const panelRect = panel.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const gap = Number(panel.dataset.formulaGap || 18);
    const topPadding = Number(panel.dataset.formulaTop || 16);
    const bottomPadding = Number(panel.dataset.formulaBottom || 18);
    const desiredMathBottom = panelRect.height - bottomPadding;

    const relativeRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - panelRect.left,
        right: rect.right - panelRect.left,
        top: rect.top - panelRect.top,
        bottom: rect.bottom - panelRect.top,
      };
    };

    const mathBounds = mathElements.reduce(
      (acc, element) => {
        const rect = relativeRect(element);
        return {
          top: Math.min(acc.top, rect.top),
          bottom: Math.max(acc.bottom, rect.bottom),
        };
      },
      { top: Infinity, bottom: -Infinity },
    );

    const titleBox = relativeRect(title);
    let shift = desiredMathBottom - mathBounds.bottom;

    measureElements.forEach((element) => {
      const rect = relativeRect(element);
      const overlapsTitleColumn = rect.left < titleBox.right && rect.right > titleBox.left;
      const minTop = overlapsTitleColumn ? titleBox.bottom + gap : topPadding;
      const shiftedTop = rect.top + shift;
      if (shiftedTop < minTop) {
        shift += minTop - shiftedTop;
      }
    });

    const bounds = measureElements.reduce(
      (acc, element) => {
        const rect = relativeRect(element);
        return {
          top: Math.min(acc.top, rect.top + shift),
          bottom: Math.max(acc.bottom, rect.bottom + shift),
        };
      },
      { top: Infinity, bottom: -Infinity },
    );

    const groupHeight = bounds.bottom - bounds.top;

    body.style.setProperty("--formula-body-y", `${shift.toFixed(1)}px`);
    panel.dataset.formulaLayout = JSON.stringify({
      desiredMathBottom: Number(desiredMathBottom.toFixed(1)),
      groupHeight: Number(groupHeight.toFixed(1)),
      groupTop: Number(bounds.top.toFixed(1)),
      groupBottom: Number(bounds.bottom.toFixed(1)),
      shift: Number(shift.toFixed(1)),
    });
  });
}

body.innerHTML = `
  <main class="slide" aria-label="Markov Decision Process reproduction">
    <h1 class="title step" style="--order:0">Markov Decision Process</h1>

    <section class="panel timeline-panel observed-panel step" style="--order:1" data-marker="arrowhead-observed" data-main="s1 a1 s2 a2 dots atminus st" data-rewards="a1>s2:r1 a2>dots:r2 atminus>st:rtminus" aria-label="observed value timeline">
      <h2 class="panel-title">observed value</h2>
      <svg class="arrow-svg" aria-hidden="true">
        ${arrowMarker("arrowhead-observed")}
      </svg>
      <div class="timeline-main">
        ${timelineNode("s1", "state", "s_1")}
        ${timelineNode("a1", "action", "a_1")}
        ${timelineNode("s2", "state", "s_2")}
        ${timelineNode("a2", "action", "a_2")}
        ${timelineDots("dots")}
        ${timelineNode("atminus", "action", "a_{t-1}")}
        ${timelineNode("st", "state", "s_t")}
      </div>
      ${timelineReward("r1", "r_1")}
      ${timelineReward("r2", "r_2")}
      ${timelineReward("rtminus", "r_{t-1}")}
    </section>

    <section class="panel timeline-panel unknown-panel step" style="--order:2" data-marker="arrowhead-unknown" data-main="at stplus atplus fdots" data-rewards="at>stplus:rt stplus>atplus:rtplus" aria-label="unknown variable future timeline">
      <h2 class="panel-title">unknown variable</h2>
      <svg class="arrow-svg" aria-hidden="true">
        ${arrowMarker("arrowhead-unknown")}
      </svg>
      <div class="timeline-main">
        ${timelineNode("at", "action future", "A_t")}
        ${timelineNode("stplus", "state future", "S_{t+1}")}
        ${timelineNode("atplus", "action future", "A_{t+1}")}
        ${timelineDots("fdots")}
      </div>
      ${timelineReward("rt", "R_t", "future")}
      ${timelineReward("rtplus", "R_{t+1}", "future")}
    </section>

    <div class="return-row row1 step" style="--order:3">
      <div class="return-label">Return</div>
      <div class="return-formula">
        ${math("U_1")}
        ${math("=")}
        ${rewardTerm("R_1")}
        ${math("+")}
        ${math("\\gamma")}
        ${rewardTerm("R_2")}
        ${math("+ \\cdots +")}
        ${math("\\gamma^{t-2}")}
        ${rewardTerm("R_{t-1}")}
        ${math("+")}
        ${math("\\gamma^{t-1}")}
        ${rewardTerm("R_t")}
        ${math("+")}
        ${math("\\gamma^t")}
        ${rewardTerm("R_{t+1}")}
        ${math("+ \\cdots +")}
        ${math("\\gamma^{n-1}")}
        ${rewardTerm("R_n")}
      </div>
    </div>

    <div class="return-row row2 step" style="--order:4">
      <div class="return-label">Return (next state)</div>
      <div class="return-formula">
        ${math("U_2")}
        ${math("=")}
        ${rewardTerm("R_2")}
        ${math("+ \\cdots +")}
        ${math("\\gamma^{t-3}")}
        ${rewardTerm("R_{t-1}")}
        ${math("+")}
        ${math("\\gamma^{t-2}")}
        ${rewardTerm("R_t")}
        ${math("+")}
        ${math("\\gamma^{t-1}")}
        ${rewardTerm("R_{t+1}")}
        ${math("+ \\cdots +")}
        ${math("\\gamma^n")}
        ${rewardTerm("R_n")}
      </div>
    </div>

    <section class="discount-panel step" style="--order:5" data-formula-panel data-formula-gap="10" data-formula-top="16" data-formula-bottom="42" aria-label="discounted return formulas">
      <div class="discount-title" data-formula-title>Discounted Return</div>
      <div class="discount-body" data-formula-body>
        <div class="discount-equation" data-formula-measure>
          ${math("\\displaystyle U_t = \\sum_{k=t}^{n} \\gamma^{k-t} R_k")}
        </div>
        <div class="discount-recursive" data-formula-measure>
          <span class="formula-prefix">${math("U_t =")}</span>
          <span class="tagged-term">
            <span class="mini-tag" data-formula-measure>Immediate<br />rewards</span>
            <span class="formula-term">${math("R_t")}</span>
          </span>
          <span class="formula-plus">${math("+")}</span>
          <span class="tagged-term future-term">
            <span class="mini-tag" data-formula-measure>Future<br />rewards</span>
            <span class="formula-term">${math("\\gamma U_{t+1}")}</span>
          </span>
        </div>
      </div>
    </section>

    <section class="gridworld step" style="--order:6" aria-label="gridworld value comparison">
      <svg viewBox="0 0 214 164" aria-hidden="true">
        <rect x="0" y="0" width="212" height="160" fill="transparent" />
        <g stroke="#9ea09e" stroke-width="2.2">
          <path d="M0 0H212V160H0Z" fill="none" />
          <path d="M53 0V160M106 0V160M159 0V160" />
          <path d="M0 53H212M0 106H212" />
        </g>
      </svg>
      <img class="noto robot-1" src="./assets/noto-emoji/robot.svg" alt="" />
      <img class="noto robot-2" src="./assets/noto-emoji/robot.svg" alt="" />
      <img class="noto coin" src="./assets/noto-emoji/coin.svg" alt="" />
      <div class="grid-label s1g">${math("s_1")}</div>
      <div class="grid-label s2g">${math("s_2")}</div>
    </section>

    <section class="comparison step" style="--order:7" aria-label="value and action-value comparison">
      <div>${math("V(s_2) > V(s_1)")}</div>
      <div>${math("Q(s_2, \\mathrm{up}) > Q(s_2, \\mathrm{down})")}</div>
    </section>
  </main>
`;

renderMath();
layoutFormulaPanels();
drawTimelineArrows();
if (document.fonts) {
  document.fonts.ready.then(() => {
    layoutFormulaPanels();
    drawTimelineArrows();
  });
}
window.setTimeout(() => {
  layoutFormulaPanels();
  drawTimelineArrows();
}, 900);
window.setTimeout(() => {
  layoutFormulaPanels();
  drawTimelineArrows();
}, 3800);
window.addEventListener("resize", () => {
  layoutFormulaPanels();
  drawTimelineArrows();
});
