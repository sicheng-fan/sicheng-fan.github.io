const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['localhost', 'fansicheng.online'],
    unoptimized: true,
  },
  output: isGitHubPages ? 'export' : 'standalone',
  trailingSlash: isGitHubPages,
}

module.exports = withMDX(nextConfig)
