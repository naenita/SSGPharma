#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/app}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
NGINX_SITE_PATH="${NGINX_SITE_PATH:-/etc/nginx/sites-available/nextapp}"
STRICT_NGINX_CHECK="${STRICT_NGINX_CHECK:-0}"

echo "=== Runtime Inspection ==="

if [ ! -f "$ENV_FILE" ]; then
  echo "✗ Missing env file at $ENV_FILE"
  exit 1
fi

ASSET_PREFIX="$(sed -n 's/^NEXT_PUBLIC_ASSET_PREFIX=//p' "$ENV_FILE" | tr -d '"' | tail -n 1)"
SITE_URL="$(sed -n 's/^NEXT_PUBLIC_SITE_URL=//p' "$ENV_FILE" | tr -d '"' | tail -n 1)"

echo "NEXT_PUBLIC_SITE_URL=${SITE_URL:-<empty>}"
echo "NEXT_PUBLIC_ASSET_PREFIX=${ASSET_PREFIX:-<empty>}"

if [ "${ASSET_PREFIX:-}" = "/_next" ]; then
  echo "✗ Invalid NEXT_PUBLIC_ASSET_PREFIX=/_next causes /_next/_next asset URLs."
  exit 1
fi

if [ ! -f "$NGINX_SITE_PATH" ]; then
  if [ "$STRICT_NGINX_CHECK" = "1" ]; then
    echo "✗ Nginx site config not found at $NGINX_SITE_PATH"
    exit 1
  fi
  echo "⚠ Nginx site config not found at $NGINX_SITE_PATH (skipping Nginx rule checks)."
  echo "=== Inspection complete ==="
  exit 0
fi

if rg -n "/_next/_next|rewrite.+_next|location\\s+/_next\\s*\\{" "$NGINX_SITE_PATH" >/dev/null 2>&1; then
  echo "✗ Potential problematic Nginx _next rule detected in $NGINX_SITE_PATH"
  rg -n "/_next/_next|rewrite.+_next|location\\s+/_next\\s*\\{" "$NGINX_SITE_PATH"
  exit 1
fi

echo "✓ No obvious _next path rewriting issues found."
echo "=== Inspection complete ==="
