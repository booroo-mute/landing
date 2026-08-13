# Деплой SEO-изменений: чеклист

## Лендинг (mute.ac)

1. На сервере: `git pull && npm install && npm run build`
2. `pm2 restart mute-landing`
3. Обновить nginx из `deploy/nginx-mute.ac.conf`:
   `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -s https://mute.ac/robots.txt` — генерируется, ссылается на sitemap
   - `curl -s https://mute.ac/sitemap.xml | grep -c "<loc>"` → 15
   - `curl -sI https://mute.ac/releases/1-3-0` → 308/301 на /releases
   - `curl -s https://mute.ac/llms.txt | head -3`
   - `curl -sI "https://mute.ac/_next/static/..."` (любой asset со страницы) →
     `Cache-Control: public, immutable`
5. `npm run indexnow` — пингануть Яндекс/Bing свежими URL
6. Прописать в `.env` токены `NEXT_PUBLIC_YANDEX_VERIFICATION` /
   `NEXT_PUBLIC_GOOGLE_VERIFICATION` (после регистрации в вебмастерах)
   и повторить шаги 1–2.

### www.mute.ac (отложено до DNS)

1. Добавить DNS A/AAAA запись для www.mute.ac
2. `certbot --nginx -d mute.ac -d www.mute.ac`
3. Раскомментировать www-блок в `deploy/nginx-mute.ac.conf`, залить, `nginx -t && reload`

## Веб-клиент (beta.mute.ac)

1. `git pull && npm install && npm run build`
2. `scripts/update-static.sh` (копирует build в /var/www/mute-app)
3. Обновить nginx из `beta.mute.ac.conf`: `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -sI https://beta.mute.ac/ | grep -i x-robots` → `noindex, nofollow`
   - `curl -sI https://beta.mute.ac/welcome | grep -i x-robots` → то же
   - `curl -s https://beta.mute.ac/ | grep noindex` → мета-тег на месте
   - `curl -s -o /dev/null -w "%{http_code}" https://beta.mute.ac/sitemap.xml` → 404
   - Приложение работает: логин, звонок, инвайт-ссылка
5. В GSC → Removals: запросить удаление beta.mute.ac/* (ускоряет выпадение
   из выдачи с недель до дней)
6. ⚠️ robots.txt на beta НЕ закрывать (`Disallow: /`) до полного выпадения
   из индекса (проверять `site:beta.mute.ac` раз в 2 недели, ждать 4–8 недель)

## Контент, требующий решения команды

- `content/releases/0-2-1.md`, `0-2-2.md` — проверить даты и дополнить
  реальными изменениями (сейчас — консервативные честные заглушки,
  помечены TODO в файлах)
- `lib/faq.ts` — проверить факты: регистрация (ник/почта/пароль?),
  формулировка про приватность
- Статьи блога `content/blog/*.md` — вычитать тон и факты
