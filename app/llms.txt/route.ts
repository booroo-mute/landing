import { getAllBlogPosts } from "@/lib/blog";
import { getAllGameGuides } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

// llms.txt — краткая машиночитаемая сводка сайта для AI-краулеров
// (конвенция llmstxt.org). Генерируется из данных, чтобы не устаревать.
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllBlogPosts();
  const guides = getAllGameGuides();

  const body = `# Mute

> Mute — бесплатный голосовой чат для геймеров, российский аналог и замена Discord,
> который работает в России без VPN. Звонки 1:1 без ограничения времени,
> голосовые комнаты до 8 человек, видеозвонки, демонстрация экрана,
> личные и групповые чаты. Приложения для Windows и macOS + веб-версия.
> По-русски название читается «мьют», пишут также «мут» и «муте».

> Mute is a free Russian voice chat app for gamers — a Discord alternative
> that works in Russia without a VPN. 1:1 calls, voice rooms up to 8 people,
> video calls, screen sharing, personal and group text chats. Windows,
> macOS and web. Russian spellings: «мьют», «мут».

## Основное

- [Главная](${SITE_URL}/): что такое Mute и его возможности
- [Аналог Discord в России](${SITE_URL}/discord-alternative): сравнение Mute и Discord по пунктам
- [Голосовой чат с другом онлайн](${SITE_URL}/voice-chat): как созвониться в браузере за пару минут, в том числе с телефона
- [Голосовой чат в играх](${SITE_URL}/games): гайды по войсу в конкретных играх и что делать, когда он не работает
- [Скачать](${SITE_URL}/download): установщики для Windows и macOS
- [Установка](${SITE_URL}/install): инструкции для Windows (SmartScreen) и macOS (Gatekeeper)
- [Что нового](${SITE_URL}/releases): история обновлений приложения
- [Веб-версия](https://beta.mute.ac/welcome): Mute в браузере, без установки

## Гайды по играм

${guides.map((g) => `- [${g.title}](${SITE_URL}/games/${g.slug}): ${g.description ?? ""}`).join("\n")}

## Блог

${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Факты

- Цена: бесплатно, без подписок
- Платформы: Windows, macOS, веб-браузер (WebRTC)
- Лимит голосовой комнаты: 8 участников
- Видеозвонки: есть; фирменная стилизация под пиксельный ретро-телефон, отключается
- Демонстрация экрана: есть, в приложении и в браузере, со звуком системы
- Веб-версия на телефоне: работает в Safari (iOS) и Chrome (Android), отдельных мобильных приложений нет
- Регистрация: ник, e-mail, пароль; гостевого входа без аккаунта нет
- Push-to-talk: нет, микрофон включается и выключается кнопкой
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
