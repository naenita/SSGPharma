#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ssgpharma.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.ssgpharma.com}"
APP_PORT="${APP_PORT:-5050}"
NGINX_SITE_PATH="${NGINX_SITE_PATH:-/etc/nginx/sites-available/nextapp}"
NGINX_ENABLED_PATH="${NGINX_ENABLED_PATH:-/etc/nginx/sites-enabled/nextapp}"

echo "=== Configuring Nginx for ${DOMAIN} (app port ${APP_PORT}) ==="

sudo tee "$NGINX_SITE_PATH" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${WWW_DOMAIN};
    return 301 http://${DOMAIN}\$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_vary on;
    gzip_proxied any;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.ms-fontobject
        application/wasm
        application/x-font-ttf
        application/xml
        font/opentype
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;

    brotli on;
    brotli_comp_level 5;
    brotli_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.ms-fontobject
        application/wasm
        application/x-font-ttf
        application/xml
        font/opentype
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

if [ ! -L "$NGINX_ENABLED_PATH" ]; then
  sudo ln -s "$NGINX_SITE_PATH" "$NGINX_ENABLED_PATH"
fi

if [ -L /etc/nginx/sites-enabled/default ]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi

sudo nginx -t
sudo systemctl reload nginx

echo "=== Nginx setup complete ==="
