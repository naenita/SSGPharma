# Deployment Guide — AWS Lightsail (`ssgpharma.com`)

This repo now supports one-command bootstrap for a fresh Ubuntu Lightsail instance.

## DNS + Network Prerequisites

Before running scripts:

1. Attach a static IP to the instance.
2. Add DNS records:
   - `A` record for `@` -> Lightsail static IP
   - `A` record for `www` -> Lightsail static IP
3. Open Lightsail firewall ports:
   - `22` (SSH)
   - `80` (HTTP)
   - `443` (HTTPS)

## Runtime Topology

- Public traffic: `80/443`
- Reverse proxy: `nginx`
- App process: `pm2` process `nextapp`
- App listen port: `5050` (`127.0.0.1:5050`)
- SSL: `certbot` (nginx plugin)

## `.env` Is Auto-Created

You do not need to manually create `.env` anymore.  
`deploy/create-env.sh` auto-generates a production `.env` (including secure random secrets) on first run.

Defaults:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://ssgpharma.com`
- `DATABASE_URL=file:/var/www/app/data/prod.db`
- `PORT=5050`
- Random `ADMIN_SESSION_SECRET`
- Random `ADMIN_PASSWORD` (printed once if not provided)

Override any value by passing environment variables to bootstrap/deploy commands.

## One-Command First-Time Bootstrap (Recommended)

On the server:

```bash
sudo mkdir -p /var/www/app
sudo chown -R $USER:$USER /var/www/app
git clone <your-github-repo-url> /var/www/app
cd /var/www/app
CERTBOT_EMAIL=<your-email> bash deploy/bootstrap.sh
```

What this does:
1. Installs system dependencies (Node 20, pnpm, pm2, nginx, certbot).
2. Creates `.env` automatically and deploys app.
3. Builds standalone Next.js output.
4. Starts/reloads PM2 app on port `5050`.
5. Configures nginx for `ssgpharma.com` and `www.ssgpharma.com` (www redirects to root).
6. Issues SSL certs and verifies renewal.
7. Runs health checks.

## Alternative Manual First Deploy

If you prefer step-by-step:

```bash
bash deploy/setup-lightsail.sh
REPO_URL=<your-github-repo-url> bash deploy/first-deploy.sh
DOMAIN=ssgpharma.com WWW_DOMAIN=www.ssgpharma.com APP_PORT=5050 bash deploy/setup-nginx.sh
DOMAIN=ssgpharma.com WWW_DOMAIN=www.ssgpharma.com CERTBOT_EMAIL=<your-email> bash deploy/setup-ssl.sh
APP_URL=https://ssgpharma.com APP_PORT=5050 bash deploy/check-health.sh
```

## Every Subsequent Deploy

After pushing to GitHub:

```bash
cd /var/www/app
bash deploy/deploy.sh
APP_URL=https://ssgpharma.com APP_PORT=5050 bash deploy/check-health.sh
```

If this is a brand-new server and `.env` does not exist, deploy will auto-create it.

## Useful Operations

### Logs
```bash
pm2 logs nextapp
pm2 logs nextapp --lines 100
```

### PM2 status/restart
```bash
pm2 status
APP_PORT=5050 pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save
```

### Reset admin password
```bash
cd /var/www/app
bash deploy/reset-admin-password.sh
```

### If static assets break after deploy
```bash
cd /var/www/app
node scripts/standalone-setup.mjs
APP_PORT=5050 pm2 startOrReload deploy/ecosystem.config.cjs --env production
```

## Rollback (Quick)

```bash
cd /var/www/app
git log --oneline -n 5
git checkout <previous-commit-sha>
pnpm install --frozen-lockfile
pnpm prisma migrate deploy
pnpm build:standalone
APP_PORT=5050 pm2 startOrReload deploy/ecosystem.config.cjs --env production
```

## Troubleshooting

- `nginx -t` fails: inspect `/etc/nginx/sites-available/nextapp`.
- certbot fails: verify DNS propagation and that port 80 is open.
- app down but nginx up: check `pm2 logs nextapp`.
- DB errors: verify `.env` `DATABASE_URL` uses absolute server path.
