# MRongM Developer Website

MRongM 独立软件工作室的英文官方网站。项目使用原生 HTML 与 CSS 构建，无运行时依赖、无第三方字体请求，也不采集用户数据。

## 本地预览

```bash
python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。

## 验证

```bash
node --test "tests/site.test.mjs"
```

## 项目结构

- `index.html`：语义化页面内容与 Signal Path SVG。
- `styles.css`：品牌令牌、响应式布局、动效与无障碍样式。
- `resource/`：原始 Google Play 开发者页面素材。
- `tests/`：不依赖第三方包的网站契约测试。
- `docs/superpowers/`：设计说明与实施计划。

AudioLoop 当前仅展示为 “Coming to Google Play”，未配置虚构的商店链接、发布日期或产品截图。
