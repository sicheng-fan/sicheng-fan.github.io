#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SERVER_HOST="${SERVER_HOST:-139.224.69.22}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/fansicheng}"
PM2_APP_NAME="${PM2_APP_NAME:-fansicheng-website}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-10}"

if ! command -v sshpass >/dev/null 2>&1; then
  echo "Missing required dependency: sshpass" >&2
  exit 1
fi

if [[ -z "${SERVER_PASSWORD:-}" ]]; then
  echo "SERVER_PASSWORD is required." >&2
  echo "Example: SERVER_PASSWORD='***' npm run deploy:server" >&2
  exit 1
fi

SSH_OPTS=(
  -o StrictHostKeyChecking=accept-new
  -o PreferredAuthentications=password
  -o PubkeyAuthentication=no
  -o KbdInteractiveAuthentication=no
  -o ConnectTimeout="$CONNECT_TIMEOUT"
  -p "$SERVER_PORT"
)

REMOTE_TARGET="${SERVER_USER}@${SERVER_HOST}"
BACKUP_DIR="/root/fansicheng-backups/$(date +%F-%H%M%S)"

echo "==> Checking SSH connectivity"
sshpass -p "$SERVER_PASSWORD" ssh "${SSH_OPTS[@]}" "$REMOTE_TARGET" "echo connected >/dev/null"

echo "==> Building local Next.js app"
cd "$ROOT_DIR"
npm run build

echo "==> Backing up key remote files to ${BACKUP_DIR}"
sshpass -p "$SERVER_PASSWORD" ssh "${SSH_OPTS[@]}" "$REMOTE_TARGET" "\
  mkdir -p '$BACKUP_DIR' && \
  cp '$REMOTE_DIR/src/components/AboutPageClient.tsx' '$BACKUP_DIR/AboutPageClient.tsx' && \
  cp '$REMOTE_DIR/src/components/academic/AcademicHomeClient.tsx' '$BACKUP_DIR/AcademicHomeClient.tsx' && \
  { cp '$REMOTE_DIR/public/avatar.jpg' '$BACKUP_DIR/avatar.jpg' 2>/dev/null || true; } && \
  { cp '$REMOTE_DIR/public/avatar.png' '$BACKUP_DIR/avatar.png' 2>/dev/null || true; }"

echo "==> Syncing project files"
sshpass -p "$SERVER_PASSWORD" rsync -az --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  --exclude 'website.tar.gz' \
  --exclude '个人照片.PNG' \
  --exclude '.claude/' \
  -e "ssh ${SSH_OPTS[*]}" \
  "$ROOT_DIR"/ "$REMOTE_TARGET:$REMOTE_DIR/"

echo "==> Rebuilding on server"
sshpass -p "$SERVER_PASSWORD" ssh "${SSH_OPTS[@]}" "$REMOTE_TARGET" "\
  cd '$REMOTE_DIR' && \
  npm run build"

echo "==> Restarting PM2 app: ${PM2_APP_NAME}"
sshpass -p "$SERVER_PASSWORD" ssh "${SSH_OPTS[@]}" "$REMOTE_TARGET" "\
  pm2 restart '$PM2_APP_NAME' && \
  pm2 show '$PM2_APP_NAME' | sed -n '1,40p'"

echo "==> Verifying remote avatar endpoint from server"
sshpass -p "$SERVER_PASSWORD" ssh "${SSH_OPTS[@]}" "$REMOTE_TARGET" "\
  curl -I --max-time 15 http://127.0.0.1:3000/avatar.png"

echo "Deploy completed."
