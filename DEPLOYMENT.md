# 部署指南：阿里云服务器 + fansicheng.online 域名

本指南将详细介绍如何将网站部署到阿里云服务器，并配置域名 `fansicheng.online`。

## 目录

1. [准备工作](#准备工作)
2. [服务器初始化](#服务器初始化)
3. [安装 Node.js 和 PM2](#安装-nodejs-和-pm2)
4. [配置 Nginx](#配置-nginx)
5. [SSL 证书配置](#ssl-证书配置)
6. [域名解析配置](#域名解析配置)
7. [部署网站](#部署网站)
8. [安全配置](#安全配置)
9. [自动化部署（可选）](#自动化部署可选)
10. [监控和维护](#监控和维护)
11. [故障排除](#故障排除)

---

## 准备工作

### 你需要准备

- [x] 阿里云 ECS 服务器（推荐 2核4G 以上）
- [x] 已购买的域名 `fansicheng.online`
- [x] 域名已完成实名认证
- [x] 本地已安装 Node.js 16+

### 推荐的服务器配置

- **操作系统**: Ubuntu 22.04 LTS 或 CentOS 7/8
- **CPU**: 2 核以上
- **内存**: 4GB 以上
- **带宽**: 5Mbps 以上
- **磁盘**: 40GB SSD

---

## 服务器初始化

### 1. 连接服务器

```bash
ssh root@你的服务器IP
```

### 2. 创建普通用户（安全起见，避免使用 root）

```bash
# 创建用户
adduser deploy

# 添加 sudo 权限
usermod -aG sudo deploy

# 切换到新用户
su - deploy
```

### 3. 更新系统

**Ubuntu:**
```bash
sudo apt update && sudo apt upgrade -y
```

**CentOS:**
```bash
sudo yum update -y
```

### 4. 安装基础工具

**Ubuntu:**
```bash
sudo apt install -y curl wget git vim htop ufw
```

**CentOS:**
```bash
sudo yum install -y curl wget git vim htop firewalld
```

---

## 安装 Node.js 和 PM2

### 1. 安装 Node.js (使用 nvm)

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18

# 验证安装
node -v  # 应显示 v18.x.x
npm -v
```

### 2. 安装 PM2

```bash
npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
# 按照提示执行生成的命令
```

---

## 配置 Nginx

### 1. 安装 Nginx

**Ubuntu:**
```bash
sudo apt install -y nginx
```

**CentOS:**
```bash
sudo yum install -y nginx
```

### 2. 配置 Nginx

创建网站配置文件：

```bash
sudo vim /etc/nginx/sites-available/fansicheng.online
```

添加以下内容：

```nginx
# HTTP 配置 - 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name fansicheng.online www.fansicheng.online;
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fansicheng.online www.fansicheng.online;

    # SSL 证书配置（稍后配置）
    ssl_certificate /etc/letsencrypt/live/fansicheng.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fansicheng.online/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src 'self' https://www.youtube.com https://player.bilibili.com;" always;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
    gzip_comp_level 6;
    
    # 日志
    access_log /var/log/nginx/fansicheng.online.access.log;
    error_log /var/log/nginx/fansicheng.online.error.log;

    # 静态文件缓存
    location /_next/static/ {
        alias /home/deploy/website/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /static/ {
        alias /home/deploy/website/public/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 代理到 Next.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

### 3. 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/fansicheng.online /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

---

## SSL 证书配置

### 1. 安装 Certbot

**Ubuntu:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**CentOS:**
```bash
sudo yum install -y certbot python3-certbot-nginx
```

### 2. 获取 SSL 证书

首先，确保域名已解析到服务器 IP，然后运行：

```bash
# 创建验证目录
sudo mkdir -p /var/www/certbot

# 获取证书
sudo certbot certonly --webroot -w /var/www/certbot \
    -d fansicheng.online \
    -d www.fansicheng.online \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email
```

### 3. 自动续期

```bash
# 测试续期
sudo certbot renew --dry-run

# 添加定时任务
sudo crontab -e
```

添加以下行：
```
0 0,12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

## 域名解析配置

### 1. 登录阿里云控制台

1. 进入 **域名管理** → **域名列表**
2. 点击域名 `fansicheng.online` 的 **解析**

### 2. 添加解析记录

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 你的服务器IP | 600 |
| A | www | 你的服务器IP | 600 |

### 3. 等待生效

DNS 解析通常在几分钟到几小时内生效。可以用以下命令检查：

```bash
nslookup fansicheng.online
ping fansicheng.online
```

---

## 部署网站

### 1. 上传代码到服务器

**方法一：使用 Git（推荐）**

```bash
# 在服务器上
cd /home/deploy
git clone https://github.com/yourusername/your-repo.git website
cd website
```

**方法二：使用 scp**

```bash
# 在本地
npm run build
scp -r .next package.json next.config.js public deploy@your-server-ip:/home/deploy/website/
```

### 2. 安装依赖并构建

```bash
cd /home/deploy/website
npm install --production
npm run build
```

### 3. 使用 PM2 启动

创建 PM2 配置文件：

```bash
vim ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'fansicheng-website',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/website',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

启动应用：

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 4. 验证部署

访问 https://fansicheng.online 检查网站是否正常运行。

---

## 安全配置

### 1. 配置防火墙

**Ubuntu (ufw):**
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

**CentOS (firewalld):**
```bash
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 配置 SSH 安全

编辑 `/etc/ssh/sshd_config`：

```bash
sudo vim /etc/ssh/sshd_config
```

修改以下配置：

```
# 禁用 root 登录
PermitRootLogin no

# 禁用密码登录（先确保已配置 SSH 密钥）
PasswordAuthentication no

# 修改默认端口（可选）
Port 22022

# 限制登录用户
AllowUsers deploy
```

重启 SSH：

```bash
sudo systemctl restart sshd
```

### 3. 安装 Fail2ban

```bash
# Ubuntu
sudo apt install -y fail2ban

# CentOS
sudo yum install -y fail2ban
```

配置 Fail2ban：

```bash
sudo vim /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
```

启动 Fail2ban：

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. 配置阿里云安全组

在阿里云控制台：

1. 进入 **云服务器 ECS** → **安全组**
2. 配置入站规则：

| 协议 | 端口 | 源 | 说明 |
|-----|------|-----|------|
| TCP | 22 | 你的IP/0 | SSH |
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |

---

## 自动化部署（可选）

### 使用 GitHub Actions

在你的仓库中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/deploy/website
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload fansicheng-website
```

在 GitHub 仓库设置中添加 Secrets：
- `SERVER_HOST`: 服务器 IP
- `SERVER_USER`: deploy
- `SERVER_SSH_KEY`: SSH 私钥

---

## 监控和维护

### 1. 查看应用状态

```bash
pm2 status
pm2 monit
pm2 logs fansicheng-website
```

### 2. 查看 Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/fansicheng.online.access.log

# 错误日志
sudo tail -f /var/log/nginx/fansicheng.online.error.log
```

### 3. 监控服务器资源

```bash
htop
df -h
free -m
```

### 4. 定期更新

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新 Node.js 包
cd /home/deploy/website
npm update
```

---

## 故障排除

### 网站无法访问

1. 检查 PM2 应用状态：`pm2 status`
2. 检查 Nginx 状态：`sudo systemctl status nginx`
3. 检查端口监听：`sudo netstat -tlpn | grep 3000`
4. 检查防火墙：`sudo ufw status`
5. 检查日志：`pm2 logs` 和 Nginx 日志

### SSL 证书问题

```bash
# 检查证书状态
sudo certbot certificates

# 手动续期
sudo certbot renew --force-renewal
```

### 性能问题

1. 检查服务器资源：`htop`
2. 检查 PM2 进程：`pm2 monit`
3. 检查 Nginx 配置是否开启 Gzip
4. 考虑启用 CDN（如阿里云 CDN）

### 502 Bad Gateway

1. 检查 Next.js 应用是否在运行：`pm2 status`
2. 检查应用端口是否正确
3. 检查 Nginx upstream 配置

---

## 有用的命令速查

```bash
# PM2 命令
pm2 start ecosystem.config.js   # 启动应用
pm2 stop fansicheng-website     # 停止应用
pm2 restart fansicheng-website  # 重启应用
pm2 reload fansicheng-website   # 零停机重载
pm2 delete fansicheng-website   # 删除应用
pm2 logs                        # 查看日志
pm2 monit                       # 监控面板

# Nginx 命令
sudo nginx -t                   # 测试配置
sudo systemctl reload nginx     # 重载配置
sudo systemctl restart nginx    # 重启 Nginx

# 系统命令
sudo systemctl status nginx     # 查看 Nginx 状态
sudo ufw status                 # 查看防火墙状态
sudo certbot certificates       # 查看 SSL 证书
```

---

如有问题，欢迎联系或查阅官方文档：

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Nginx 文档](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)
- [阿里云帮助文档](https://help.aliyun.com/)

