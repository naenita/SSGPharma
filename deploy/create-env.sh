#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/app}"
DOMAIN="${DOMAIN:-ssgpharma.com}"
APP_PORT="${APP_PORT:-5050}"
DATABASE_URL="${DATABASE_URL:-file:/var/www/app/data/prod.db}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"
ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET:-}"

cd "$APP_DIR"

if [ -f .env ]; then
  echo "=== .env already exists; skipping creation ==="
  exit 0
fi

if [ -z "$ADMIN_SESSION_SECRET" ]; then
  ADMIN_SESSION_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")"
fi

if [ -z "$ADMIN_PASSWORD" ]; then
  ADMIN_PASSWORD="$(node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))")"
  GENERATED_PASSWORD="true"
else
  GENERATED_PASSWORD="false"
fi

cat > .env <<EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
NEXT_PUBLIC_ASSET_PREFIX=
NEXT_PUBLIC_GA_ID=
NEXT_DEPLOYMENT_ID=
DATABASE_URL="${DATABASE_URL}"
ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
PORT=${APP_PORT}
EOF

chmod 600 .env

echo "=== Created production .env at ${APP_DIR}/.env ==="
if [ "$GENERATED_PASSWORD" = "true" ]; then
  echo "Generated ADMIN_PASSWORD: ${ADMIN_PASSWORD}"
  echo "Save this now and rotate after first login."
fi
