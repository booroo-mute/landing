# Deploy mute.ac landing

## Stack

`https://mute.ac` → nginx (TLS) → `next start` on port 3002 (PM2).

## Initial server setup

```bash
cd /root/mute/landing
cp .env.example .env.local
npm ci && npm run build
mkdir -p logs
npm install -g pm2
pm2 start ecosystem.config.js && pm2 save && pm2 startup
```

## Nginx + SSL (first time)

1. Install nginx and deploy a **bootstrap** HTTP-only config (proxy to `127.0.0.1:3002` for `mute.ac` and `www.mute.ac`).
2. Obtain a certificate: `certbot --nginx -d mute.ac` (add `-d www.mute.ac` once DNS exists for www).
3. Copy `deploy/nginx-mute.ac.conf` to `/etc/nginx/sites-available/mute.ac` and reload nginx.

## Ongoing deploys

```bash
cd /root/mute/landing
git pull
npm ci && npm run build
pm2 reload mute-landing
```
