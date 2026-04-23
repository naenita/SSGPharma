#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
APP_PORT="${APP_PORT:-5050}"
DOMAIN="${DOMAIN:-ssgpharma.com}"
DATABASE_URL="${DATABASE_URL:-file:/var/www/app/data/prod.db}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"
ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET:-}"
cd "$APP_DIR"

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Ensuring production environment file exists ==="
APP_DIR="$APP_DIR" DOMAIN="$DOMAIN" APP_PORT="$APP_PORT" DATABASE_URL="$DATABASE_URL" ADMIN_PASSWORD="$ADMIN_PASSWORD" ADMIN_SESSION_SECRET="$ADMIN_SESSION_SECRET" \
  bash deploy/create-env.sh

ASSET_PREFIX="$(sed -n 's/^NEXT_PUBLIC_ASSET_PREFIX=//p' .env | tr -d '"' | tail -n 1)"
if [ "${ASSET_PREFIX:-}" = "/_next" ]; then
  echo "ERROR: NEXT_PUBLIC_ASSET_PREFIX=/_next creates invalid /_next/_next asset URLs."
  echo "Set NEXT_PUBLIC_ASSET_PREFIX to empty in .env and redeploy."
  exit 1
fi

echo "=== Inspecting runtime configuration ==="
bash deploy/inspect-runtime.sh

echo "=== Running database migrations ==="
pnpm prisma migrate deploy

echo "=== Building for production ==="
export NEXT_DEPLOYMENT_ID="${NEXT_DEPLOYMENT_ID:-$(git rev-parse --short HEAD)-$(date +%s)}"
rm -rf .next
pnpm build:standalone
node scripts/standalone-setup.mjs

echo "=== Reloading application on port ${APP_PORT} ==="
APP_PORT="$APP_PORT" pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save

echo "=== Deploy complete ==="
pm2 status
