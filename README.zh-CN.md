# NicePre

[English](README.md) | 简体中文

NicePre 是一个 Codex skill 加一组小型展示样例，用于制作浅色、精致的
学术/技术演示文稿。它使用 HTML/CSS/SVG、KaTeX、语义化配色、自动图形
布局和渲染后的视觉 QA。

## Skill

可复用的 skill 位于：

- [`skills/academic-slide-deck/SKILL.md`](skills/academic-slide-deck/SKILL.md)

它包含这些参考内容：

- 视觉配色和字体
- 公式密集型页面布局
- 连接线和箭头规则
- token、embedding、model block 图形
- 截图和 contact sheet 视觉 QA

## 示例画廊

仓库中保留了几组已经渲染好的 PNG，读者不需要安装依赖也可以直接在 GitHub
上判断视觉效果。

### GRPO Showcase

源码：[`examples/grpo-showcase`](examples/grpo-showcase)

<a href="examples/grpo-showcase/export/contact-sheet.png">
  <img src="examples/grpo-showcase/export/contact-sheet.png" alt="GRPO showcase contact sheet" width="100%">
</a>

### MDP Polished Reproduction

源码：[`examples/mdp-reproduction`](examples/mdp-reproduction)

<a href="examples/mdp-reproduction/export/slide-01.png">
  <img src="examples/mdp-reproduction/export/slide-01.png" alt="MDP polished reproduction" width="100%">
</a>

### MoE Raster Concept

源码：[`examples/moe-router`](examples/moe-router)

<a href="examples/moe-router/export/contact-sheet.png">
  <img src="examples/moe-router/export/contact-sheet.png" alt="MoE raster concept contact sheet" width="100%">
</a>

安装开发依赖后可以直接打开 HTML 文件，也可以运行渲染脚本重新生成 PNG 和
contact sheet。

## 在 Codex 中使用

如果是作为 Codex skill 使用，不需要用户每次手动准备这个仓库。你可以让
agent 从这个仓库安装或使用该 skill：

```text
Install and use the academic-slide-deck skill from
https://github.com/bitkira/NicePre/tree/main/skills/academic-slide-deck
```

然后由 agent 在目标工作区里按需配置依赖。

依赖配置应该由 agent 管理。用户不需要这个仓库里的 `node_modules`，也不
需要为了使用 skill 而先在这个仓库执行 `npm install`。当某个 deck 需要
渲染时，agent 应该配置当前目标工作区：合适时复用已有的 `package.json`，
必要时创建最小配置，在目标工作区安装 KaTeX 和 Playwright，并使用可用浏览器
或安装 Playwright 浏览器。

这个仓库里的 `package.json` 只用于开发 NicePre 本身，以及重新生成仓库内置
示例。仓库中已经提交的 PNG 预览图可以直接在 GitHub 上查看，不需要任何
setup。

## 本地开发安装

只有当你想在本地 clone 后自己运行示例或渲染器时，才需要执行这一节。通过
Codex 安装或使用 skill 时不需要执行这一节。

```bash
npm install
```

本地公式渲染需要 KaTeX。渲染脚本还会使用 Playwright，并可选使用 Sharp。
在 macOS 上，如果检测到 Google Chrome，会自动使用它；否则请安装
Playwright 浏览器：

```bash
npx playwright install chromium
```

也可以通过 `--chrome-executable` 指定浏览器路径。

如果运行环境没有 Playwright 或 Sharp，可以安装开发依赖：

```bash
npm install --save-dev playwright sharp
```

## 渲染

```bash
npm run render:grpo
npm run render:mdp
npm run render:moe
npm run render:all
```

也可以直接使用共享渲染器：

```bash
node skills/academic-slide-deck/scripts/render-deck.mjs \
  examples/grpo-showcase/index.html \
  --out examples/grpo-showcase/export \
  --slides .slide \
  --width 1600 \
  --height 900 \
  --ready body.math-ready
```

脚本会写出 slide PNG、`contact-sheet.html`、可选的 `contact-sheet.png`，
以及 `render-report.json`。

## 鸣谢

NicePre 的视觉方向和学术 slides 打磨思路，部分受到 B 站 UP 主
[吃花椒的麦](https://www.bilibili.com/video/BV1rooaYVEk8/) 的启发。特别鸣谢。

## 许可证

Apache-2.0。`examples/mdp-reproduction/assets/noto-emoji/` 中的小型 Noto
Emoji SVG 子集保留其上游说明。
