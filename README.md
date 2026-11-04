# MRongM Developer Website

MRongM 独立软件工作室的英文 / 简体中文官方网站。项目使用原生 HTML、CSS 与一个本地语言模块构建，无第三方运行时依赖、无第三方字体请求，也不采集用户数据。首页展示 Hobgoblin、AudioLoop 和 FlowLane，并可继续扩展其他产品。

## 产品

- **Hobgoblin v2.2.0**：面向 AI CLI 与 Git worktree 工作流的开发工作区，覆盖 macOS、Windows、Web/server mode 与 Android。
- **AudioLoop**：面向录音、PCM/WAV 转换、项目管理、导出和播放的 Android 工具，已在 Google Play 发布。
- **FlowLane**：为所选 macOS 应用分配已有 SOCKS5 / HTTP CONNECT 代理的工具。独立介绍页位于 `apps/flowlane/`，支持 11 种语言，说明直连、DNS、UDP 与 TUN 的验证边界。该页面暂不提供公开安装包下载。

## 本地预览

```bash
python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。

## 语言切换

页头的 `EN / 中文` 控件用于手动切换整页语言。新访客默认看到英文；明确选择后，网站仅通过 `localStorage` 的 `mrongm.studio.language` 保存这一个功能性偏好。网站不会根据浏览器语言自动切换，也不会发送该偏好或其他数据。

JavaScript 不可用时，页面保留完整的英文内容，并隐藏无法工作的语言控件。

## 验证

```bash
node --test "tests/site.test.mjs"
```

## 项目结构

- `index.html`：英文语义化回退内容、翻译键、产品组合与 Signal Path SVG。
- `styles.css`：品牌令牌、产品视觉、响应式布局、动效与无障碍样式。
- `scripts/i18n.mjs`：简体中文词典、手动切换、语言状态与安全的本地偏好存储。
- `resource/`：原始 Google Play 开发者页面素材。
- `resource/products/`：从对应产品发布版本提取的官网产品资源。
- `apps/flowlane/`：迁入的 FlowLane 独立静态页面与公开展示素材，不依赖其源码仓库。FlowLane 网络能力或限制改变时，应同步更新此页面及其翻译。
- `tests/`：不依赖第三方包的网站契约测试。
- `docs/superpowers/`：设计说明与实施计划。

## 产品资源来源

- `resource/products/hobgoblin/icon.svg`：Hobgoblin `v2.2.0` 的 `assets/hobgoblin-icon.svg`。
- `resource/products/audioloop/icon.png`：AudioLoop `v2.0.6` 的 Google Play 应用图标。
- `resource/products/audioloop/projects.png`：AudioLoop `v2.0.6` 的已验证手机端 Projects 截图。
- `apps/flowlane/assets/`：FlowLane 的品牌图与经处理的英文应用截图。

官网只链接官方发布入口，不展示可能独立变化的价格、评分、下载量，也不直接链接 Hobgoblin 的未签名构建文件。
