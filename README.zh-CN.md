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

## 示例

仓库中保留了三个展示样例：

| 示例 | 源码 | 预览 |
|---|---|---|
| GRPO sampling unit，原第 03 页 | [`examples/grpo-showcase`](examples/grpo-showcase) | [`slide-01.png`](examples/grpo-showcase/export/slide-01.png) |
| GRPO objective，原第 05 页 | [`examples/grpo-showcase`](examples/grpo-showcase) | [`slide-02.png`](examples/grpo-showcase/export/slide-02.png) |
| MDP polished reproduction | [`examples/mdp-reproduction`](examples/mdp-reproduction) | [`slide-01.png`](examples/mdp-reproduction/export/slide-01.png) |

安装依赖后可以直接打开 HTML 文件，也可以运行渲染脚本重新生成 PNG 和
contact sheet。

## 在 Codex 中使用

如果是作为 Codex skill 使用，不需要用户每次手动准备这个仓库。你可以让
agent 从这个仓库安装或使用该 skill，然后由 agent 在目标工作区里按需配置
依赖。

只有当 agent 需要渲染或重新生成 slides 时，才需要安装 Node 依赖。仓库中
已经提交的 PNG 预览图可以直接在 GitHub 上查看，不需要任何 setup。

## 本地开发安装

只有当你想在本地 clone 后自己运行示例或渲染器时，才需要执行这一节。

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

## 许可证

Apache-2.0。`examples/mdp-reproduction/assets/noto-emoji/` 中的小型 Noto
Emoji SVG 子集保留其上游说明。
