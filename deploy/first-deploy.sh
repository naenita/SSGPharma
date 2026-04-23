#!/bin/bash
set -e

APP_DIR="${APP_DIR:-/var/www/app}"
REPO_URL="${REPO_URL:-}"  # set via: REPO_URL=https://github.com/you/repo.git bash deploy/first-deploy.sh

if [ -z "$REPO_URL" ]; then
  echo "ERROR: Set REPO_URL environment variable before running this script."
  echo "Usage: REPO_URL=https://github.com/youruser/yourrepo.git bash deploy/first-deploy.sh"
  exit 1
fi

echo "=== Cloning repository ==="
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "=== Copying environment file ==="
if [ ! -f .env ]; then
  cp .env.example .env
  echo "IMPORTANT: Edit $APP_DIR/.env with your production values before continuing."
  echo "Press Enter when done..."
  read
fi

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Running database migrations ==="
pnpm prisma migrate deploy

echo "=== Building for production ==="
pnpm build:standalone

echo "=== Starting application with PM2 ==="
pm2 start .next/standalone/server.js --name "nextapp" \
  --env production \
  -i 1 \
  --max-memory-restart 512M

pm2 save
echo "=== First deploy complete. App running on port 3000. ==="
