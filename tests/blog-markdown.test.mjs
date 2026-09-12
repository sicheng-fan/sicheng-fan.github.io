import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import matter from 'gray-matter'
import { renderMarkdown } from '../src/lib/render-markdown.ts'
import { getPostBySlugBilingual, getAllPosts } from '../src/lib/mdx.ts'
import { GET as getSearchIndex } from '../src/app/api/search/route.ts'
import { formatPostDate, blogPostPath, canonicalTag } from '../src/lib/blog-display.ts'

test('legacy post titles with inline markup appear only in the page header', () => {
  for (const name of ['webchain-cvpr-first-author', 'webfactory-iclr-first-author']) {
    const { data, content } = matter(fs.readFileSync(`content/blog/${name}.mdx`, 'utf8'))
    const { html } = renderMarkdown(`# <span>${data.title}</span>\n\n${content}`, data.title)
    assert.doesNotMatch(html, /<h1\b/)
    assert.ok(!html.startsWith('<h2'), 'the duplicated title should be removed, not demoted')
    assert.match(html, /<p>/)
  }
})

test('lists, links, tables, images and literal code retain their structure', () => {
  const { html } = renderMarkdown(`- first\n- second\n\n1. ordered\n2. next\n\n[paper](https://example.com/paper)\n\n![figure](/figure.png)\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n\`\`\`html\n<h1>literal</h1>\n# code heading\n$not_math$\n\`\`\``, 'Title')
  assert.match(html, /<ul>\s*<li>first<\/li>/)
  assert.match(html, /<ol>\s*<li>ordered<\/li>/)
  assert.match(html, /<a href="https:\/\/example.com\/paper" target="_blank" rel="noopener noreferrer">paper<\/a>/)
  assert.match(html, /<img src="\/figure.png" alt="figure">/)
  assert.match(html, /<table class="blog-table">/)
  assert.match(html, /<thead>/)
  assert.match(html, /&#x3C;h1>literal&#x3C;\/h1>/)
  assert.match(html, /# code heading\n\$not_math\$/)
})

test('math renders and untrusted HTML cannot inject executable markup', () => {
  const { html } = renderMarkdown('$x^2$\n\n$$\nx^2 + y^2\n$$\n\n<script>alert(1)</script>\n\n[bad](javascript:alert)\n\n<img src="/x.png" onerror="alert(1)">', 'Title')
  assert.match(html, /class="katex"/)
  assert.match(html, /class="katex-display"/)
  assert.doesNotMatch(html, /<script|onerror|javascript:/)
})

test('TOC targets are unique, including repeated and formatted headings', () => {
  const { html, toc } = renderMarkdown('## **Repeated** heading\n\n## **Repeated** heading\n\n### 中文标题\n\n```md\n## Not a heading\n```\n\n# Different body heading', 'Title')
  assert.equal(toc.length, 4)
  assert.equal(new Set(toc.map(item => item.id)).size, 4)
  assert.equal(toc[0].text, 'Repeated heading')
  for (const entry of toc) assert.ok(html.includes(`id="${entry.id}"`))
  assert.doesNotMatch(html, /<h1\b/)
})

test('every existing Chinese and English article compiles without math errors', () => {
  for (const name of fs.readdirSync('content/blog').filter(name => /\.mdx?$/.test(name))) {
    const { data, content } = matter(fs.readFileSync(`content/blog/${name}`, 'utf8'))
    const { html } = renderMarkdown(content, data.title)
    assert.doesNotMatch(html, /katex-error/, name)
    assert.doesNotMatch(html, /<h1\b/, name)
  }
})


test('language availability reflects real files, never a copy of the fallback', () => {
  for (const post of getAllPosts('zh')) {
    const { zh, en, exists } = getPostBySlugBilingual(post.slug)
    assert.equal(exists, true)
    assert.equal(Boolean(zh), post.hasZh)
    assert.equal(Boolean(en), post.hasEn)
    if (zh) assert.equal(zh.lang, 'zh')
    if (en) assert.equal(en.lang, 'en')
  }
  const missing = getPostBySlugBilingual('nonexistent-regression-test-post')
  assert.equal(missing.exists, false)
  assert.equal(missing.zh, null)
  assert.equal(missing.en, null)
})

test('every published article has a distinct full English translation', () => {
  for (const post of getAllPosts('zh')) {
    const { zh, en } = getPostBySlugBilingual(post.slug)
    assert.ok(zh && en, `Missing translation: ${post.slug}`)
    assert.notEqual(zh.content, en.content)
    assert.notEqual(zh.meta.title, en.meta.title)
    assert.equal(zh.meta.date, en.meta.date)
    assert.deepEqual(zh.meta.tags.map(canonicalTag), en.meta.tags.map(canonicalTag))
    assert.doesNotMatch(zh.content, /^\d+[、]|^\d+\.[^\s\d]/m, post.slug)
    assert.equal((zh.content.match(/\*\*/g) || []).length % 2, 0, `Unclosed bold: ${post.slug}`)
  }
})

test('search results route to actual posts and select their translation', async () => {
  const { results } = await (await getSearchIndex()).json()
  const slugs = new Set(getAllPosts('zh').map(post => post.slug))
  const posts = results.filter(result => result.type === 'post')
  assert.equal(posts.length, slugs.size * 2)
  assert.equal(new Set(posts.map(post => post.url)).size, posts.length)
  for (const post of posts) {
    const url = new URL(post.url, 'https://sicheng-fan.github.io')
    assert.ok(slugs.has(url.pathname.split('/')[2]), post.url)
    assert.equal(url.searchParams.get('lang'), post.lang)
    assert.doesNotMatch(url.pathname, /\.en/)
  }
})

test('all five imported notes preserve their source and date in both languages', () => {
  const notes = [
    ['coding-agent-to-computer-use', '6a99c3410000000011032722', '2026-09-04'],
    ['long-horizon-agent-task-synthesis', '6a934737000000000700772a', '2026-08-30'],
    ['expert-trajectories-agent-training', '6a933248000000002903f3cf', '2026-08-30'],
    ['webchain-human-web-trajectory-dataset', '6a9325940000000025011b7f', '2026-08-30'],
    ['gui-agent-hybrid-future', '6a874f3a0000000014026162', '2026-08-21'],
  ]
  for (const [slug, id, date] of notes) {
    const { zh, en } = getPostBySlugBilingual(slug)
    for (const post of [zh, en]) {
      assert.ok(post)
      assert.equal(post.meta.date, date)
      assert.ok(post.content.includes(`https://www.xiaohongshu.com/explore/${id}`))
      assert.doesNotMatch(post.content, /xsec_token|xsec_source/)
    }
  }
})

test('date-only metadata and language-specific share URLs remain stable', () => {
  const originalZone = process.env.TZ
  process.env.TZ = 'America/Los_Angeles'
  try {
    assert.equal(formatPostDate('2026-02-18', 'en'), 'February 18, 2026')
    assert.equal(formatPostDate('2026-02-18', 'zh'), '2026年2月18日')
    assert.equal(blogPostPath('webchain-cvpr-first-author', 'zh'), '/blog/webchain-cvpr-first-author/?lang=zh')
  } finally {
    if (originalZone) process.env.TZ = originalZone
    else delete process.env.TZ
  }
})
