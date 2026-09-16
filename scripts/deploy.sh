#!/usr/bin/env bash
# Выкладка лендинга на mute-prod: pull, build, перезапуск ТОЛЬКО mute-landing,
# IndexNow, контрольные curl. backend, sfu-server и nginx не трогаются: рядом
# идут живые звонки. Запуск: scripts/deploy.sh [ref] (по умолчанию origin/main).
set -euo pipefail

HOST="${MUTE_PROD_HOST:-mute-prod}"
REF="${1:-main}"

echo "== $HOST: pull $REF, build, restart mute-landing"
ssh -o BatchMode=yes -o ConnectTimeout=15 "$HOST" bash -s "$REF" <<'REMOTE'
set -euo pipefail
REF="$1"
cd /root/mute/landing
git fetch -q origin
git checkout -q "$REF" 2>/dev/null || true
git pull -q --ff-only origin "$REF"
echo "HEAD $(git rev-parse --short HEAD)"
if git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep -q package-lock.json; then
  echo "lockfile changed: npm install"; npm install --no-audit --no-fund >/dev/null
fi
npm run build 2>&1 | grep -E "check-content|✓ Compiled|rror" | head -5
pm2 restart mute-landing --update-env >/dev/null
i=0; until curl -sf -o /dev/null http://127.0.0.1:3002/robots.txt || [ $i -gt 60 ]; do i=$((i+1)); sleep 1; done
npm run indexnow 2>&1 | tail -2
pm2 jlist | python3 -c "import sys,json,time; [print(p['name'], p['pm2_env']['status'], 'up %dm' % ((time.time()*1000-p['pm2_env']['pm_uptime'])/60000)) for p in json.load(sys.stdin) if p['name'] in ('backend','sfu-server','mute-landing')]"
REMOTE

echo "== public checks"
B=https://mute.ac
echo "robots groups: $(curl -s $B/robots.txt | grep -c '^User-agent:')  sitemap loc: $(curl -s $B/sitemap.xml | grep -c '<loc>')  feed items: $(curl -s $B/blog/feed.xml | grep -c '<item>')"
for p in / download games voice-chat discord-alternative blog/discord-ne-rabotaet-segodnya games/steam; do
  printf "%-40s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$B/$p")"
done
echo "HSTS: $(curl -sI $B/ | grep -ic strict-transport)  beta x-robots: $(curl -sI https://beta.mute.ac/welcome | grep -i x-robots-tag | tr -d '\r')"
