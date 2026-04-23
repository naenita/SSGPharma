#!/bin/bash
set -euo pipefail

APP_PORT="${APP_PORT:-5050}"
APP_URL="${APP_URL:-https://ssgpharma.com}"
INTERNAL_URL="http://127.0.0.1:${APP_PORT}"

echo "=== Health Check ==="
FAILURES=0

status_code() {
  curl -o /dev/null -s -w "%{http_code}" "$1" 2>/dev/null || echo "000"
}

if pm2 pid nextapp >/dev/null 2>&1; then
  echo "✓ PM2 process running"
else
  echo "✗ PM2 process NOT running — run: APP_PORT=${APP_PORT} pm2 startOrReload deploy/ecosystem.config.cjs --env production"
  FAILURES=$((FAILURES + 1))
fi

INTERNAL_STATUS="$(status_code "$INTERNAL_URL")"
if [ "$INTERNAL_STATUS" = "200" ]; then
  echo "✓ Internal app returns 200 on ${INTERNAL_URL}"
else
  echo "✗ Internal app returned HTTP ${INTERNAL_STATUS} on ${INTERNAL_URL}"
  FAILURES=$((FAILURES + 1))
fi

EXTERNAL_STATUS="$(status_code "$APP_URL")"
if [ "$EXTERNAL_STATUS" = "200" ]; then
  echo "✓ External homepage returns 200 on ${APP_URL}"
else
  echo "✗ External homepage returned HTTP ${EXTERNAL_STATUS} on ${APP_URL}"
  FAILURES=$((FAILURES + 1))
fi

ADMIN_STATUS="$(status_code "${APP_URL}/admin")"
if [ "$ADMIN_STATUS" = "200" ] || [ "$ADMIN_STATUS" = "302" ] || [ "$ADMIN_STATUS" = "307" ]; then
  echo "✓ Admin page reachable (HTTP ${ADMIN_STATUS})"
else
  echo "✗ Admin page returned HTTP ${ADMIN_STATUS}"
  FAILURES=$((FAILURES + 1))
fi

HOMEPAGE_HTML="$(curl -s "$APP_URL")"
if echo "$HOMEPAGE_HTML" | grep -q "/_next/_next/static/"; then
  echo "✗ Homepage HTML contains invalid /_next/_next/static references."
  FAILURES=$((FAILURES + 1))
fi

ASSET_PATHS="$(echo "$HOMEPAGE_HTML" | grep -oE '/_next/static/[^"]+\.js' | head -n 5 || true)"
if [ -n "$ASSET_PATHS" ]; then
  STATIC_STATUS="200"
  while IFS= read -r asset; do
    [ -z "$asset" ] && continue
    ASSET_STATUS="$(status_code "${APP_URL}${asset}")"
    if [ "$ASSET_STATUS" = "200" ]; then
      echo "✓ Asset reachable ${asset}"
    else
      echo "✗ Asset failed ${asset} (HTTP ${ASSET_STATUS})"
      STATIC_STATUS="$ASSET_STATUS"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$ASSET_PATHS"
else
  STATIC_STATUS="000"
  echo "✗ Could not extract script assets from homepage HTML."
  FAILURES=$((FAILURES + 1))
fi

if [ "$STATIC_STATUS" = "200" ]; then
  echo "✓ Static JS assets loading"
else
  echo "✗ Static assets not loading (HTTP ${STATIC_STATUS}) — rerun: node scripts/standalone-setup.mjs"
fi

if [ "$FAILURES" -gt 0 ]; then
  echo "=== Done with ${FAILURES} failure(s) ==="
  exit 1
fi

echo "=== Done ==="
