# Fan Sicheng 个人网站

一个具有赛博朋克/数码风格的现代化个人网站，使用 Next.js 14 构建。

## ✨ 特色功能

- 🎨 **独特的数码风格设计** - 矩阵雨背景、终端风格 UI、故障文字效果
- 📝 **MDX 博客系统** - 支持 Markdown + React 组件，方便写作
- 🚀 **高性能** - Next.js SSG/SSR 优化，极快的加载速度
- 📱 **完全响应式** - 完美适配桌面、平板和手机
- 🔍 **搜索和过滤** - 快速找到感兴趣的内容
- ⌨️ **键盘快捷键** - 高效的导航体验
- 🌐 **SEO 优化** - 完善的元数据和结构化数据

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: MDX
- **动画**: Framer Motion
- **图标**: Lucide React

## 📁 项目结构

```
.
├── content/              # MDX 内容文件
│   ├── blog/            # 博客文章
│   └── projects/        # 项目介绍
├── public/              # 静态资源
├── src/
│   ├── app/            # Next.js App Router 页面
│   │   ├── blog/       # 博客页面
│   │   ├── projects/   # 项目页面
│   │   ├── timeline/   # 时间线页面
│   │   └── about/      # 关于页面
│   ├── components/     # React 组件
│   └── lib/            # 工具函数
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
npm run build
npm run start
```

## 📝 添加内容

### 添加博客文章

在 `content/blog/` 目录下创建新的 `.mdx` 文件：

```mdx
---
title: "文章标题"
excerpt: "文章摘要"
date: "2024-01-15"
tags: ["标签1", "标签2"]
featured: false
author: "Fan Sicheng"
---

# 文章内容

你的 Markdown 内容...
```

### 添加项目

在 `content/projects/` 目录下创建新的 `.mdx` 文件：

```mdx
---
title: "项目名称"
description: "项目描述"
tags: ["技术1", "技术2"]
github: "https://github.com/..."
demo: "https://demo.com"
status: "active"
category: "Backend"
---

# 项目详情

项目的详细介绍...
```

## 📸 添加图片和视频

### 图片

1. 将图片放入 `public/images/` 目录
2. 在 MDX 文件中引用：

```mdx
![图片描述](/images/your-image.png)
```

### 视频

```mdx
<video controls width="100%">
  <source src="/videos/your-video.mp4" type="video/mp4" />
</video>
```

或嵌入 YouTube/Bilibili：

```mdx
<iframe 
  width="100%" 
  height="400" 
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameBorder="0"
  allowFullScreen
/>
```

## 🎨 自定义样式

### 颜色主题

编辑 `tailwind.config.js` 中的 `colors.cyber` 对象来自定义颜色：

```js
cyber: {
  green: '#00ff9f',    // 主色调
  cyan: '#00d4ff',     // 强调色
  orange: '#ff6b35',   // 警告色
  // ...
}
```

### 字体

在 `src/app/globals.css` 中修改字体导入和配置。

## 📄 详细部署指南

请查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的阿里云部署指南。

## 📜 许可证

MIT License

---

如有问题，欢迎提 Issue 或联系我！

