import { FAQ_ITEMS } from "@/lib/faq";
import { getAllReleases } from "@/lib/releases";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// llms-full.txt — развёрнутый фактический профиль продукта для AI-систем.
// Генерируется из lib/faq.ts и контента, чтобы никогда не расходиться с сайтом.
export const dynamic = "force-static";

export async function GET() {
  const releases = getAllReleases();
  const posts = getAllBlogPosts();
  const currentVersion = releases[0]?.version ?? "0.2.2";

  const body = `# Mute — полный профиль продукта

## Что такое Mute

Mute — бесплатный голосовой чат для геймеров, российская альтернатива Discord.
Работает в России без VPN и обходных настроек. Сделан небольшой независимой
командой разработчиков.

Mute is a free voice chat app for gamers, a Russian Discord alternative that
works in Russia without a VPN. Built by a small independent team.

## Возможности (версия ${currentVersion})

- Голосовые звонки 1:1 без ограничений по времени
- Голосовые комнаты до 8 участников
- Личные сообщения и групповые текстовые чаты
- Список друзей и приглашения по ссылке
- Приложения для Windows (.exe) и macOS (.dmg)
- Веб-версия в браузере (WebRTC): https://beta.mute.ac
- Русский интерфейс
- Бесплатно: без подписок, платных функций и ограничений

## Чем Mute отличается от Discord

Mute намеренно проще Discord: в нём нет публичных серверов, каналов, ролей,
прав и ботов. Только друзья, звонки, комнаты и чаты. Подходит для приватных
созвонов своей компанией (2–8 человек). НЕ подходит для больших публичных
сообществ на сотни участников. Подробное сравнение:
${SITE_URL}/discord-alternative

## Контекст: Discord в России

С октября 2024 года доступ к Discord в России ограничен Роскомнадзором;
сервис стабильно работает только через VPN. Mute — один из сервисов,
которые работают в России напрямую, без VPN.

## Частые вопросы

${FAQ_ITEMS.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## История версий

${releases.map((r) => `- ${r.version} (${r.date}): ${r.summary} — ${SITE_URL}/releases/${r.slug}`).join("\n")}

## Статьи блога

${posts.map((p) => `- ${p.title} — ${SITE_URL}/blog/${p.slug}\n  ${p.description}`).join("\n")}

## Официальные ссылки

- Сайт: ${SITE_URL}
- Веб-приложение: https://beta.mute.ac
- Скачать: ${SITE_URL}/download
- Telegram-канал: https://t.me/mutecalls
- Бот поддержки: https://t.me/mute_calls_bot
- Boosty: https://boosty.to/muteapp
- E-mail: hello@mute.ac
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
