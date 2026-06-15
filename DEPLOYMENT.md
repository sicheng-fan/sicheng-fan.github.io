# 部署指南：阿里云服务器 + fansicheng.online

## 当前部署环境

| 项目 | 值 |
|------|-----|
| 服务器 IP | 139.224.69.22 |
| 操作系统 | Ubuntu 22.04 LTS |
| 规格 | 2 vCPU / 2 GiB / 40GB ESSD |
| 带宽 | 3 Mbps |
| 域名 | fansicheng.online |
| 部署路径 | /var/www/fansicheng |
| PM2 进程名 | fansicheng-website |
| Node.js | v18.20.8 |
| 到期时间 | 2026年11月29日 |

---

## 快速部署（日常更新）

本地修改代码后，执行以下命令即可一键更新线上网站：

```bash
# 1. 同步本地文件到服务器
rsync -avz --delete \
    --exclude="node_modules" \
    --exclude=".next" \
    --exclude=".git" \
    --exclude="website.tar.gz" \
    --exclude=".DS_Store" \
    --exclude=".claude" \
    -e "ssh -o StrictHostKeyChecking=no" \
    "/Users/fansicheng02/Downloads/project/Person website/" \
    "root@139.224.69.22:/var/www/fansicheng/"

# 2. 在服务器上安装依赖、构建、重启
ssh root@139.224.69.22 "cd /var/www/fansicheng && npm install && npm run build && pm2 reload fansicheng-website"

# 3. 验证
curl -sI https://fansicheng.online | head -5
```

也可以使用 Claude Code 的 `/deploy` 命令自动执行以上步骤。

### SSH 免密登录

已配置 SSH 密钥认证（`~/.ssh/id_ed25519`），无需输入密码即可连接服务器。

如需重新配置：
```bash
ssh-copy-id root@139.224.69.22
```

---

## 服务器架构

```
用户 → fansicheng.online → Nginx (443/SSL) → localhost:3000 (Next.js/PM2)
```

### Nginx 配置

配置文件位于 `/etc/nginx/sites-enabled/`，主要功能：
- HTTP 80 端口自动重定向到 HTTPS 443
- SSL 证书由 Let's Encrypt 提供（Certbot 自动续期）
- 反向代理到 Next.js 应用（127.0.0.1:3000）
- 开启 Gzip 压缩

### PM2 进程管理

```bash
# 查看状态
ssh root@139.224.69.22 "pm2 status"

# 查看日志
ssh root@139.224.69.22 "pm2 logs fansicheng-website --lines 50"

# 重启
ssh root@139.224.69.22 "pm2 reload fansicheng-website"

# 停止
ssh root@139.224.69.22 "pm2 stop fansicheng-website"
```

### SSL 证书

- 提供商：Let's Encrypt
- 证书路径：`/etc/letsencrypt/live/fansicheng.online/`
- 自动续期：Certbot 定时任务

```bash
# 检查证书状态
ssh root@139.224.69.22 "sudo certbot certificates"

# 手动续期
ssh root@139.224.69.22 "sudo certbot renew --force-renewal && systemctl reload nginx"
```

---

## 故障排除

### 网站无法访问

```bash
# 1. 检查 PM2 进程
ssh root@139.224.69.22 "pm2 status"

# 2. 检查 Nginx
ssh root@139.224.69.22 "systemctl status nginx"

# 3. 检查端口
ssh root@139.224.69.22 "ss -tlpn | grep -E '3000|80|443'"

# 4. 查看错误日志
ssh root@139.224.69.22 "pm2 logs fansicheng-website --err --lines 30"
ssh root@139.224.69.22 "tail -20 /var/log/nginx/fansicheng.error.log"
```

### 构建失败

```bash
# 在服务器上手动构建查看完整错误
ssh root@139.224.69.22 "cd /var/www/fansicheng && npm run build"
```

### 502 Bad Gateway

Next.js 进程未运行或端口不对：
```bash
ssh root@139.224.69.22 "pm2 restart fansicheng-website && pm2 logs fansicheng-website --lines 10"
```

---

## 从零部署（仅首次需要）

以下是首次搭建服务器时的完整步骤记录，日常更新不需要重复执行。

### 1. 系统初始化

```bash
ssh root@139.224.69.22
apt update && apt upgrade -y
apt install -y curl wget git vim htop nginx
```

### 2. 安装 Node.js (nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm alias default 18
npm install -g pm2
pm2 startup
```

### 3. 配置 Nginx

```bash
vim /etc/nginx/sites-available/fansicheng.online
```

配置内容：
```nginx
server {
    server_name fansicheng.online www.fansicheng.online;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    access_log /var/log/nginx/fansicheng.access.log;
    error_log /var/log/nginx/fansicheng.error.log;

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
    }
}
```

```bash
ln -s /etc/nginx/sites-available/fansicheng.online /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 4. SSL 证书

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d fansicheng.online -d www.fansicheng.online
```

### 5. 域名解析（阿里云控制台）

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 139.224.69.22 |
| A | www | 139.224.69.22 |

### 6. 首次部署代码

```bash
mkdir -p /var/www/fansicheng
# 从本地 rsync 代码（同"快速部署"一节）
cd /var/www/fansicheng
npm install
npm run build
pm2 start npm --name fansicheng-website -- start
pm2 save
```

---

## 有用的命令速查

```bash
# 连接服务器
ssh root@139.224.69.22

# PM2
pm2 status                          # 查看进程状态
pm2 reload fansicheng-website       # 零停机重载
pm2 logs fansicheng-website         # 查看日志
pm2 monit                           # 监控面板

# Nginx
nginx -t                            # 测试配置
systemctl reload nginx              # 重载
systemctl restart nginx             # 重启

# 系统
htop                                # 资源监控
df -h                               # 磁盘使用
certbot certificates                # SSL 证书状态
```
