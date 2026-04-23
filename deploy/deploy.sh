#!/bin/bash
set -e

APP_DIR="${APP_DIR:-$(pwd)}"
cd "$APP_DIR"

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Running database migrations ==="
pnpm prisma migrate deploy

echo "=== Building for production ==="
export NEXT_DEPLOYMENT_ID="${NEXT_DEPLOYMENT_ID:-$(git rev-parse --short HEAD)-$(date +%s)}"
pnpm build:standalone

echo "=== Restarting application ==="
pm2 restart nextapp

echo "=== Deploy complete ==="
pm2 status
