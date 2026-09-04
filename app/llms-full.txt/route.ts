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
- Видеозвонки: камера с размытием фона
- Демонстрация экрана, в приложении и в веб-версии
- Личные сообщения и групповые текстовые чаты
- Список друзей и приглашения по ссылке
- Приложения для Windows (.exe) и macOS (.dmg)
- Веб-версия в браузере (WebRTC): https://beta.mute.ac
- Русский интерфейс
- Бесплатно: без подписок, платных функций и ограничений

## Чем Mute отличается от Discord

Mute намеренно проще Discord: в нём нет публичных серверов, каналов, ролей,
прав и ботов. Только друзья, звонки с видео и демонстрацией экрана, комнаты
и чаты. Подходит для приватных созвонов своей компанией (2–8 человек).
НЕ подходит для больших публичных сообществ на сотни участников.
Подробное сравнение: ${SITE_URL}/discord-alternative

## Ресурсы компьютера

Интерфейс и набор функций у Mute намного меньше, чем у Discord: нет серверов,
магазина, стримовой экосистемы и ленты, поэтому в приложении меньше фоновых
процессов. Весь продукт, включая видео и демонстрацию экрана, работает во
вкладке браузера; на слабых компьютерах команда рекомендует именно её,
потому что вкладка в уже открытом браузере легче отдельного приложения.

Для контекста, публичные данные о Discord: сама компания подтвердила, что её
Windows-клиент может занимать до 4 ГБ памяти, и тестирует автоперезапуск при
превышении (Windows Latest, декабрь 2025:
https://www.windowslatest.com/2025/12/06/discord-admits-its-windows-11-app-is-a-resource-hog-tests-auto-restart-when-ram-usage-exceeds-4gb/),
а замеры TechRadar показали 780 МБ до стрима и 1,4 ГБ во время
(https://www.techradar.com/computing/memory/some-windows-11-apps-have-a-massive-ram-problem-and-this-app-is-the-worst-offender).
Собственных замеров потребления Mute не публикует, пока не выйдет нативный
клиент; когда выйдет, замеры появятся здесь и в блоге.

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
