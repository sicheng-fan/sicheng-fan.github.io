import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import matter from 'gray-matter'
import { renderMarkdown } from '../src/lib/render-markdown.ts'
import { getPostBySlugBilingual, getAllPosts } from '../src/lib/mdx.ts'

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
