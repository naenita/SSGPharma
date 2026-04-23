#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/app}"
APP_PORT="${APP_PORT:-5050}"
APP_URL="${APP_URL:-https://ssgpharma.com}"

cd "$APP_DIR"

echo "=== Recovery: stop running app ==="
pm2 stop nextapp || true

echo "=== Recovery: inspect runtime state ==="
bash deploy/inspect-runtime.sh

echo "=== Recovery: remove previous build artifacts ==="
rm -rf .next

echo "=== Recovery: install dependencies ==="
pnpm install --frozen-lockfile

echo "=== Recovery: apply migrations ==="
pnpm prisma migrate deploy

echo "=== Recovery: build standalone ==="
export NEXT_DEPLOYMENT_ID="${NEXT_DEPLOYMENT_ID:-$(git rev-parse --short HEAD)-$(date +%s)}"
pnpm build:standalone
node scripts/standalone-setup.mjs

echo "=== Recovery: start app ==="
APP_PORT="$APP_PORT" pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save

echo "=== Recovery: reload nginx and run health checks ==="
sudo nginx -t
sudo systemctl reload nginx
APP_URL="$APP_URL" APP_PORT="$APP_PORT" bash deploy/check-health.sh

echo "=== Recovery complete ==="
