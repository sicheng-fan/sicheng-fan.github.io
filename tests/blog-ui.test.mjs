import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import matter from 'gray-matter'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { renderMarkdown } from '../src/lib/render-markdown.ts'
import { canonicalTag } from '../src/lib/blog-display.ts'
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime.js'

const dom = new JSDOM('<!doctype html><html><head><title>Blog</title><meta name="description"></head><body><div id="root"></div></body></html>', { url: 'https://sicheng-fan.github.io/blog/' })
Object.assign(globalThis, {
  React, window: dom.window, document: dom.window.document,
  localStorage: dom.window.localStorage, HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element, SVGElement: dom.window.SVGElement,
  getComputedStyle: dom.window.getComputedStyle, IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: callback => setTimeout(callback, 0), cancelAnimationFrame: clearTimeout,
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
})
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })

const { LanguageProvider, useLanguage } = await import('../src/lib/i18n.tsx')
const { ThemeProvider, useTheme } = await import('../src/lib/theme.tsx')
const { BlogPostClient } = await import('../src/components/BlogPostClient.tsx')
const { BlogPageClient } = await import('../src/components/BlogPageClient.tsx')

function Controls() {
  const { setLanguage } = useLanguage()
  const { setTheme } = useTheme()
  return React.createElement('div', null,
    ...['zh', 'en'].map(lang => React.createElement('button', { key: lang, id: `lang-${lang}`, onClick: () => setLanguage(lang) }, lang)),
    ...['academic', 'cyber'].map(theme => React.createElement('button', { key: theme, id: `theme-${theme}`, onClick: () => setTheme(theme) }, theme)),
  )
}

let root
async function mount(element, search = '') {
  if (root) await act(() => root.unmount())
  localStorage.clear()
  window.history.replaceState({}, '', `/blog/${search}`)
  root = createRoot(document.getElementById('root'))
  await act(() => root.render(React.createElement(SearchParamsContext.Provider, { value: new URLSearchParams(search) },
    React.createElement(LanguageProvider, null, React.createElement(ThemeProvider, null, React.createElement(Controls), element)),
  )))
}
async function click(selector) {
  const element = document.querySelector(selector)
  assert.ok(element, selector)
  await act(() => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })))
}
function readPost(slug, lang) {
  const { data, content } = matter(fs.readFileSync(`content/blog/${slug}${lang === 'en' ? '.en' : ''}.mdx`, 'utf8'))
  return { slug, lang, hasZh: true, hasEn: true, meta: { ...data, readingTime: '5 min' }, content, ...renderMarkdown(content, data.title) }
}
const slugs = fs.readdirSync('content/blog').filter(name => name.endsWith('.mdx') && !name.endsWith('.en.mdx')).map(name => name.replace('.mdx', ''))

test('all articles switch correctly in both themes with matching titles and TOC targets', async () => {
  for (const slug of slugs) {
    const zhPost = readPost(slug, 'zh')
    const enPost = readPost(slug, 'en')
    await mount(React.createElement(BlogPostClient, { slug, zhPost, enPost }))
    for (const theme of ['academic', 'cyber']) {
      await click(`#theme-${theme}`)
      for (const lang of ['zh', 'en']) {
        await click(`#lang-${lang}`)
        const post = lang === 'zh' ? zhPost : enPost
        assert.equal(document.querySelectorAll('h1').length, 1, `${slug}/${theme}/${lang}`)
        assert.equal(document.querySelector('h1').textContent, post.meta.title)
        assert.equal(document.title, `${post.meta.title} | Fan Sicheng`)
        assert.equal(document.querySelector('.blog-content').lang, lang === 'zh' ? 'zh-CN' : 'en')
        assert.equal(new URL(window.location.href).searchParams.get('lang'), lang)
        for (const link of document.querySelectorAll('a[href^="#section-"]')) {
          assert.ok(document.getElementById(link.getAttribute('href').slice(1)), link.textContent)
        }
        assert.doesNotMatch(document.body.textContent, /not available yet|暂无中文版本/)
      }
    }
  }
})

test('explicit Chinese links initialize the language and persist the preference', async () => {
  const slug = slugs[0]
  await mount(React.createElement(BlogPostClient, { slug, zhPost: readPost(slug, 'zh'), enPost: readPost(slug, 'en') }), '?lang=zh')
  assert.equal(document.querySelector('h1').textContent, readPost(slug, 'zh').meta.title)
  assert.equal(localStorage.getItem('site-language'), 'zh')
  await click('#lang-en')
  assert.equal(localStorage.getItem('site-language'), 'en')
  assert.equal(document.documentElement.lang, 'en')
})

test('translated tags keep the same matches across languages and theme changes', async () => {
  const zhPosts = slugs.map(slug => ({ ...readPost(slug, 'zh').meta, slug }))
  const enPosts = slugs.map(slug => ({ ...readPost(slug, 'en').meta, slug }))
  const matchingSlugs = new Set(zhPosts.filter(post => post.tags.some(tag => canonicalTag(tag) === 'Data')).map(post => post.slug))
  await mount(React.createElement(BlogPageClient, { zhPosts, enPosts, allTags: [] }), '?tag=数据&lang=zh')
  for (const theme of ['academic', 'cyber']) {
    await click(`#theme-${theme}`)
    for (const lang of ['zh', 'en']) {
      await click(`#lang-${lang}`)
      const articleLinks = [...document.querySelectorAll('a[href*="/blog/"]')]
      assert.equal(articleLinks.length, matchingSlugs.size)
      for (const link of articleLinks) {
        assert.ok(matchingSlugs.has(new URL(link.href).pathname.split('/')[2]))
        assert.ok(link.getAttribute('href').includes(`lang=${lang}`))
      }
      assert.equal(document.querySelectorAll('h1').length, 1)
    }
  }
  await click('button[aria-label="Clear tag filter"]')
  assert.equal(new URL(window.location.href).searchParams.get('tag'), null)
  assert.equal(document.querySelectorAll('a[href*="/blog/"]').length, slugs.length)
  await click('#theme-academic')
  assert.equal(document.querySelectorAll('a[href*="/blog/"]').length, slugs.length)
  const dataTag = [...document.querySelectorAll('button')].find(button => button.textContent === 'Data')
  await act(() => dataTag.click())
  assert.equal(document.querySelectorAll('a[href*="/blog/"]').length, matchingSlugs.size)
  await click('button[aria-label="Clear tag filter"]')
  await click('#theme-cyber')
  assert.equal(document.querySelectorAll('a[href*="/blog/"]').length, slugs.length)
  await act(() => root.unmount())
  root = null
})
