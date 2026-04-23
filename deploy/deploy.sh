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
pnpm build:standalone

echo "=== Restarting application ==="
pm2 restart nextapp

echo "=== Deploy complete ==="
pm2 status
