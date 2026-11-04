import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';

const requiredResources = [
  'README.md',
  'mrongm-developer-icon.png',
  'mrongm-developer-icon.svg',
  'mrongm-header.png',
  'mrongm-header.svg',
  'promotional-text-zh-CN.txt',
];

const requiredProductResources = [
  'resource/products/hobgoblin/icon.svg',
  'resource/products/audioloop/icon.png',
  'resource/products/audioloop/projects.png',
  'apps/flowlane/assets/flowlane.png',
  'resource/products/one-tap-shutdown/icon.svg',
  'resource/products/toybox-battle/icon.png',
  'resource/products/cycleledger/icon.png',
  'resource/products/timekeeper/icon.svg',
  'resource/products/critter-merge/icon.png',
];

const languageModulePath = '../scripts/i18n.mjs';

const canAccess = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

test('all source materials live under resource', async () => {
  for (const file of requiredResources) {
    assert.equal(
      await canAccess(`resource/${file}`),
      true,
      `${file} is missing from resource/`,
    );

    if (file !== 'README.md') {
      assert.equal(
        await canAccess(file),
        false,
        `${file} must not remain at repository root`,
      );
    }
  }
});

test('verified product assets are stored locally', async () => {
  for (const resource of requiredProductResources) {
    assert.equal(
      await canAccess(resource),
      true,
      resource + ' is missing',
    );
  }
});

test('homepage presents the released product portfolio', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const id of ['main-content', 'products', 'principles', 'studio']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }

  assert.match(html, /Hobgoblin/);
  assert.match(html, /AudioLoop/);
  assert.match(html, /FlowLane/);
  for (const app of ['hobgoblin', 'audioloop', 'flowlane', 'one-tap-shutdown', 'toybox-battle', 'cycleledger', 'timekeeper', 'critter-merge']) {
    assert.match(html, new RegExp(`href=["']apps/${app}/["']`));
  }
  assert.match(
    html,
    /<span class="brand__name">MRongM Studio<\/span>/,
  );
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /(?:src|srcset)=["']https?:\/\//i);

  for (const resource of requiredProductResources.filter((item) => !item.endsWith('projects.png'))) {
    assert.match(html, new RegExp(resource.replaceAll('/', '\\/')));
  }

  const externalLinks = [
    ...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/g),
  ].map((match) => match[1]);

  assert.deepEqual(externalLinks, []);
});

test('additional product pages have accessible names and do not expose private source', async () => {
  for (const [slug, name] of [
    ['one-tap-shutdown', 'One-tap Shutdown'], ['toybox-battle', 'Toybox Battle'],
    ['cycleledger', 'CycleLedger'], ['timekeeper', 'Timekeeper'],
  ]) {
    const html = await readFile(`apps/${slug}/index.html`, 'utf8');
    assert.match(html, new RegExp(`<h1[^>]*>${name}</h1>`));
    assert.match(html, /href=["']\.\.\/\.\.\/["']/);
    assert.match(html, /data-language-switcher[^>]*\bhidden\b/);
    assert.doesNotMatch(html, /github\.com\/MRongM\/(?:android-one-tap-shutdown|toybox|cycle-ledger|timekeeper)/i);
  }
  const timekeeper = await readFile('apps/timekeeper/index.html', 'utf8');
  assert.match(timekeeper, /Hourly Time/);
});

test('Critter Merge page uses the public game listing and privacy policy', async () => {
  const page = await readFile('apps/critter-merge/index.html', 'utf8');
  assert.match(page, /<h1[^>]*>Critter Merge<\/h1>/);
  assert.match(page, /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.mrongm\.mergelong/);
  assert.match(page, /https:\/\/privacy-policy\.328064\.xyz\/critter-merge\//);
  assert.doesNotMatch(page, /github\.com\/MRongM\/MergeLong/i);
  assert.ok(await canAccess('resource/products/critter-merge/feature.png'));
});

test('all product pages reference existing local files and anchors', async () => {
  const pages = ['index.html', ...['hobgoblin', 'audioloop', 'flowlane', 'one-tap-shutdown', 'toybox-battle', 'cycleledger', 'timekeeper', 'critter-merge'].map((slug) => `apps/${slug}/index.html`)];
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${file} contains duplicate IDs`);
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|data:)/i.test(target)) continue;
      const [pathname, fragment] = target.split('#', 2);
      if (!pathname) {
        if (fragment) assert.ok(ids.includes(fragment), `${file}: missing anchor ${target}`);
        continue;
      }
      const destination = resolve(dirname(file), decodeURIComponent(pathname));
      assert.ok(await canAccess(destination), `${file}: missing ${target}`);
      if (fragment) {
        const linked = await readFile((await stat(destination)).isDirectory() ? `${destination}/index.html` : destination, 'utf8');
        assert.match(linked, new RegExp(`\\bid=["']${fragment}["']`));
      }
    }
  }
});

test('each Studio product has an independent page with its official links', async () => {
  const hobgoblin = await readFile('apps/hobgoblin/index.html', 'utf8');
  const audioloop = await readFile('apps/audioloop/index.html', 'utf8');
  for (const [html, name] of [[hobgoblin, 'Hobgoblin'], [audioloop, 'AudioLoop']]) {
    assert.match(html, new RegExp(`<h1[^>]*>${name}</h1>`));
    assert.match(html, /href=["']\.\.\/\.\.\/["']/);
    assert.match(html, /data-language-switcher[^>]*\bhidden\b/);
  }
  assert.match(hobgoblin, /https:\/\/github\.com\/MRongM\/hobgoblin\/releases\/tag\/v2\.2\.0/);
  assert.match(hobgoblin, /https:\/\/github\.com\/MRongM\/hobgoblin["']/);
  assert.match(audioloop, /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.mrongm\.audioloop/);
  assert.match(audioloop, /resource\/products\/audioloop\/projects\.png/);
});

test('FlowLane product page preserves public releases and source links', async () => {
  const page = await readFile('apps/flowlane/index.html', 'utf8');
  const catalog = JSON.parse(await readFile('apps/flowlane/locales.json', 'utf8'));
  assert.match(page, /FlowLane/);
  assert.match(page, /https:\/\/mrongm\.328064\.xyz\/apps\/flowlane\//);
  assert.match(page, /https:\/\/github\.com\/MRongM\/FlowLane\/releases\/latest\/download\/FlowLane-macos-arm64\.zip/);
  assert.match(page, /https:\/\/github\.com\/MRongM\/FlowLane\/releases\/latest\/download\/FlowLane-macos-x86_64\.zip/);
  assert.match(page, /https:\/\/github\.com\/MRongM\/FlowLane/);
  assert.equal(Object.keys(catalog).length, 11);
  assert.match(page, /href=["']\.\.\/\.\.\/["']/);
  const keys = [...page.matchAll(/data-i18n(?:-(?:aria|alt))?=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const [language, strings] of Object.entries(catalog)) {
    for (const key of keys) assert.equal(typeof strings[key], 'string', `${language} is missing ${key}`);
  }
  for (const asset of ['app.mjs', 'style.css', 'assets/flowlane.png', 'assets/flowlane-ui-en.png']) {
    assert.equal(await canAccess(`apps/flowlane/${asset}`), true, `${asset} is missing`);
  }
});

test('homepage exposes a manual language selector', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /<html\s+lang=["']en["']/);
  assert.match(
    html,
    /<script\s+type=["']module["']\s+src=["']scripts\/i18n\.mjs["']><\/script>/,
  );
  assert.match(html, /class=["']language-switcher["']/);
  assert.match(html, /data-language-switcher[^>]*\bhidden\b/);

  const languageButtons = [
    ...html.matchAll(
      /<button\b[^>]*data-language=["']([^"']+)["'][^>]*aria-pressed=["'](true|false)["'][^>]*>/g,
    ),
  ].map((match) => [match[1], match[2]]);

  assert.deepEqual(languageButtons, [
    ['en', 'true'],
    ['zh-CN', 'false'],
  ]);
});

test('language module covers the page and fails safely', async () => {
  const html = (await Promise.all(['index.html', ...['hobgoblin', 'audioloop', 'one-tap-shutdown', 'toybox-battle', 'cycleledger', 'timekeeper', 'critter-merge'].map((slug) => `apps/${slug}/index.html`)].map((path) => readFile(path, 'utf8')))).join('\n');
  const {
    DEFAULT_LANGUAGE,
    STORAGE_KEY,
    SUPPORTED_LANGUAGES,
    readStoredLanguage,
    resolveLanguage,
    writeStoredLanguage,
    zhCN,
  } = await import(languageModulePath);

  const htmlKeys = [
    ...html.matchAll(
      /data-i18n(?:-(?:content|aria-label|alt))?=["']([^"']+)["']/g,
    ),
  ].map((match) => match[1]);

  assert.equal(DEFAULT_LANGUAGE, 'en');
  assert.equal(STORAGE_KEY, 'mrongm.studio.language');
  assert.deepEqual(SUPPORTED_LANGUAGES, ['en', 'zh-CN']);
  assert.deepEqual(
    [...new Set(htmlKeys)].sort(),
    Object.keys(zhCN).sort(),
  );
  assert.equal(resolveLanguage('en'), 'en');
  assert.equal(resolveLanguage('zh-CN'), 'zh-CN');
  assert.equal(resolveLanguage('zh'), 'en');
  assert.equal(resolveLanguage(undefined), 'en');

  const memoryStorage = {
    value: null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
  };
  const throwingStorage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  };

  assert.equal(readStoredLanguage(memoryStorage), 'en');
  memoryStorage.value = 'zh-CN';
  assert.equal(readStoredLanguage(memoryStorage), 'zh-CN');
  assert.equal(readStoredLanguage(throwingStorage), 'en');
  assert.equal(writeStoredLanguage(memoryStorage, 'en'), 'en');
  assert.equal(memoryStorage.value, 'en');
  assert.equal(writeStoredLanguage(throwingStorage, 'zh-CN'), 'zh-CN');
});

test('stylesheet preserves brand tokens and accessibility contracts', async () => {
  const css = await readFile('styles.css', 'utf8');

  for (const color of [
    '#2a1b17',
    '#3a2822',
    '#f59e66',
    '#fff3e8',
    '#5eead4',
    '#e8d2c0',
  ]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }

  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation-delay:\s*0ms\s*!important/);
  assert.match(css, /@media\s*\(max-width:/);

  for (const selector of [
    '.site-header__tools',
    '.language-switcher',
    '.products-grid',
    '.product-panel',
    '.product-platforms',
    '.product-actions',
    '.product-visual',
  ]) {
    const escapedSelector = selector.replace('.', '\\.');
    assert.match(css, new RegExp(escapedSelector + '\\s*\\{'));
  }

  assert.match(css, /grid-template-columns:\s*repeat\(3,/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*48rem\)[\s\S]*?\.products-grid\s*\{[^}]*grid-template-columns:\s*1fr;/,
  );
  assert.match(
    css,
    /\.language-switcher\[hidden\]\s*\{[^}]*display:\s*none;/,
  );
  assert.match(
    css,
    /\.language-switcher button\[aria-pressed=["']true["']\]\s*\{/,
  );
  assert.match(css, /a:focus-visible,\s*button:focus-visible/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*48rem\)[\s\S]*?\.site-header__inner\s*\{[^}]*display:\s*grid;/,
  );
});
