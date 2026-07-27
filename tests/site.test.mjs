import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const requiredResources = [
  'README.md',
  'mrongm-developer-icon.png',
  'mrongm-developer-icon.svg',
  'mrongm-header.png',
  'mrongm-header.svg',
  'promotional-text-zh-CN.txt',
];

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

test('homepage has the required semantic sections and honest product state', async () => {
  const html = await readFile('index.html', 'utf8');

  for (const id of ['main-content', 'work', 'principles', 'studio']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }

  assert.match(html, /AudioLoop/);
  assert.match(html, /Coming to Google Play/i);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\//i);
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
});
