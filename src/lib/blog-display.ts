import type { Language } from './i18n'

export function formatPostDate(date: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(date))
}

export function formatReadingTime(value: string, language: Language): string {
  return language === 'zh' ? value.replace(/ min$/, ' 分钟') : `${value} read`
}

export function blogPostPath(slug: string, language: Language): string {
  return `/blog/${encodeURIComponent(slug)}/?lang=${language}`
}

const tagTranslations: Record<string, string> = {
  '行业观察': 'Industry Observation',
  '数据': 'Data',
  '强化学习': 'Reinforcement Learning',
  '开源': 'Open Source',
  '人机交互': 'Human-Computer Interaction',
  '智能体': 'Agent',
}

export function canonicalTag(tag: string): string {
  return tagTranslations[tag] || tag
}

export function localizedTag(tag: string, language: Language): string {
  const canonical = canonicalTag(tag)
  if (language === 'en') return canonical
  return Object.keys(tagTranslations).find(key => tagTranslations[key] === canonical) || tag
}
