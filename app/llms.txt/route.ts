import { getAllBlogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// llms.txt — краткая машиночитаемая сводка сайта для AI-краулеров
// (конвенция llmstxt.org). Генерируется из данных, чтобы не устаревать.
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllBlogPosts();

  const body = `# Mute

> Mute — бесплатный голосовой чат для геймеров, российский аналог Discord,
> который работает в России без VPN. Звонки 1:1 без ограничения времени,
> голосовые комнаты до 8 человек, видеозвонки, демонстрация экрана,
> личные и групповые чаты. Приложения для Windows и macOS + веб-версия.

> Mute is a free Russian voice chat app for gamers — a Discord alternative
> that works in Russia without a VPN. 1:1 calls, voice rooms up to 8 people,
> video calls, screen sharing, personal and group text chats. Windows,
> macOS and web.

## Основное

- [Главная](${SITE_URL}/): что такое Mute и его возможности
- [Аналог Discord в России](${SITE_URL}/discord-alternative): сравнение Mute и Discord по пунктам
- [Скачать](${SITE_URL}/download): установщики для Windows и macOS
- [Установка](${SITE_URL}/install): инструкции для Windows (SmartScreen) и macOS (Gatekeeper)
- [Что нового](${SITE_URL}/releases): история обновлений приложения
- [Веб-версия](https://beta.mute.ac/welcome): Mute в браузере, без установки

## Блог

${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Факты

- Цена: бесплатно, без подписок
- Платформы: Windows, macOS, веб-браузер (WebRTC)
- Лимит голосовой комнаты: 8 участников
- Видеозвонки: есть; фирменная стилизация под пиксельный ретро-телефон, отключается
- Демонстрация экрана: есть, в приложении и в браузере
- Регистрация: ник, e-mail, пароль
- Работает в России: да, VPN не требуется
- Публичных серверов и каналов нет — общение только в своём круге

## Контакты

- Сайт: ${SITE_URL}
- Telegram-канал: https://t.me/mutecalls
- Поддержка: https://t.me/mute_calls_bot
- E-mail: hello@mute.ac

Расширенная версия: ${SITE_URL}/llms-full.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
