export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = Object.freeze(['en', 'zh-CN']);
export const STORAGE_KEY = 'mrongm.studio.language';

export const zhCN = Object.freeze({
  'meta.description': 'MRongM Studio 专注打造轻量、清晰的独立软件，包括 FlowLane、Hobgoblin 与 AudioLoop。',
  'meta.ogTitle': 'MRongM Studio — 独立应用与开发者工具',
  'meta.ogDescription': '用心打磨的独立应用与开发者工具。',
  'meta.title': 'MRongM Studio — 独立应用与开发者工具',
  'a11y.skip': '跳到主要内容',
  'a11y.brandHome': 'MRongM Studio 首页',
  'a11y.primaryNavigation': '主导航',
  'a11y.languageSelection': '语言选择',
  'nav.products': '产品',
  'nav.principles': '原则',
  'nav.studio': '工作室',
  'hero.eyebrow': '独立软件工作室',
  'hero.titleLead': '实用的软件，',
  'hero.titleAccent': '用心调校。',
  'hero.intro': 'MRongM Studio 打造专注而轻量的应用：保持清晰，也尊重每一位使用者。',
  'hero.explore': '查看产品',
  'hero.status': '独立构建中',
  'hero.build': '构建',
  'hero.tune': '调校',
  'hero.ship': '发布',
  'products.eyebrow': '已发布产品',
  'products.title': '为专注工作而生。',
  'products.intro': '不同的工具，共享同一种取舍：流程清晰、控制权在本地，软件不打扰你正在做的事。',
  'products.listLabel': '已发布产品',
  'hobgoblin.status': '最新版本 · v2.2.0',
  'hobgoblin.tagline': '让 Git 上下文始终完整的 AI 工作空间。',
  'hobgoblin.description': '把项目、工作树、分支、终端和 AI CLI 会话收纳在一个清晰的工作空间中，覆盖桌面、Web 与 Android。',
  'hobgoblin.platformsLabel': 'Hobgoblin 支持的平台',
  'hobgoblin.releaseAction': '查看 v2.2.0 发布说明',
  'hobgoblin.sourceAction': '源代码',
  'hobgoblin.map.mobile': '移动端',
  'hobgoblin.map.sessions': '会话',
  'hobgoblin.map.sharedTmux': '共享 tmux',
  'hobgoblin.map.notices': '通知',
  'hobgoblin.map.workspaces': '工作区',
  'audioloop.status': '已在 Google Play 上架',
  'audioloop.tagline': '录制、转换并有序管理音频。',
  'audioloop.description': '在一个专注的 Android 工作流中录制高保真音频、管理项目、转换 PCM 与 WAV 文件、导出结果并播放录音。',
  'audioloop.platformsLabel': 'AudioLoop 支持的平台',
  'audioloop.playAction': '前往 Google Play',
  'audioloop.screenAlt': 'Android 上的 AudioLoop 项目页面',
  'audioloop.caption': '项目集中管理录音、转换结果与导出文件。',
  'flowlane.status': '原生 macOS 工具',
  'flowlane.tagline': '为每个应用选择连接方式。',
  'flowlane.description': '将已有 SOCKS5 或 HTTP CONNECT 代理分配给所选应用；未匹配的流量直连。',
  'flowlane.platformsLabel': 'FlowLane 支持的平台',
  'flowlane.action': '了解 FlowLane',
  'flowlane.screenAlt': 'macOS 上的 FlowLane 应用规则页面',
  'flowlane.caption': '选择需要使用的应用和连接方式。',
  'principles.eyebrow': '我们的构建方式',
  'principles.title': '少一点软件阻隔，多一点专注于你真正要做的事。',
  'principles.lightweight.label': '轻量',
  'principles.lightweight.title': '主动保持精简。',
  'principles.lightweight.body': '任何功能都不会仅凭“听起来很厉害”就获得一席之地。每个产品只专注于它真正要完成的工作。',
  'principles.clear.label': '清晰',
  'principles.clear.title': '一用便懂。',
  'principles.clear.body': '界面通过结构、语言与熟悉的操作自我说明，而不是依赖说明书。',
  'principles.respectful.label': '尊重',
  'principles.respectful.title': '注意力属于你。',
  'principles.respectful.body': '不使用诱导式设计、不制造紧迫感，也不提供嘈杂的默认设置。好软件知道何时退到一旁。',
  'studio.eyebrow': '关于工作室',
  'studio.titleLead': '选择独立，',
  'studio.titleAccent': '出于本意。',
  'studio.body': 'MRongM Studio 是一家小型软件工作室，从最初的问题到最终的交互，对每一个细节负责。',
  'studio.quote': '“用心构建”意味着少一些假设、更短的路径，以及懂得何时退到一旁的软件。',
  'footer.tagline': '独立应用，用心打磨。',
  'footer.copyright': '© 2026 MRongM Studio',
  'footer.backToTop': '返回顶部',
});

const bindingDefinitions = Object.freeze([
  {
    selector: '[data-i18n]',
    keyAttribute: 'data-i18n',
    property: 'textContent',
  },
  {
    selector: '[data-i18n-content]',
    keyAttribute: 'data-i18n-content',
    property: 'content',
  },
  {
    selector: '[data-i18n-aria-label]',
    keyAttribute: 'data-i18n-aria-label',
    property: 'ariaLabel',
  },
  {
    selector: '[data-i18n-alt]',
    keyAttribute: 'data-i18n-alt',
    property: 'alt',
  },
]);

export const resolveLanguage = (value) => (
  SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE
);

export const readStoredLanguage = (storage) => {
  try {
    return resolveLanguage(storage?.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const writeStoredLanguage = (storage, value) => {
  const language = resolveLanguage(value);

  try {
    storage?.setItem(STORAGE_KEY, language);
  } catch {
    // The current session still switches when persistent storage is blocked.
  }

  return language;
};

const captureBindings = (root) => bindingDefinitions.flatMap((definition) => (
  [...root.querySelectorAll(definition.selector)].map((element) => ({
    element,
    englishValue: element[definition.property],
    key: element.getAttribute(definition.keyAttribute),
    property: definition.property,
  }))
));

const applyLanguage = (root, bindings, language) => {
  const localizedValues = language === 'zh-CN' ? zhCN : null;

  for (const binding of bindings) {
    binding.element[binding.property] = (
      localizedValues?.[binding.key] ?? binding.englishValue
    );
  }

  root.documentElement.lang = language;

  for (const button of root.querySelectorAll('[data-language]')) {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.language === language),
    );
  }
};

export const initLanguageSwitcher = (root, storage) => {
  const switcher = root.querySelector('[data-language-switcher]');

  if (!switcher) {
    return null;
  }

  const bindings = captureBindings(root);
  const selectLanguage = (value, persist = true) => {
    const language = resolveLanguage(value);
    applyLanguage(root, bindings, language);

    if (persist) {
      writeStoredLanguage(storage, language);
    }

    return language;
  };

  for (const button of root.querySelectorAll('[data-language]')) {
    button.addEventListener('click', () => {
      selectLanguage(button.dataset.language);
    });
  }

  selectLanguage(readStoredLanguage(storage), false);
  switcher.hidden = false;

  return Object.freeze({ selectLanguage });
};

if (typeof document !== 'undefined') {
  let storage = null;

  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }

  initLanguageSwitcher(document, storage);
}
