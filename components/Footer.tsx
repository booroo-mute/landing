import Image from "next/image";
import Link from "next/link";

type FooterLink = { href: string; label: string; external?: boolean };

/** Четыре группы вместо двух длинных строк: продукт, возможности, игрокам, о нас. */
const groups: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Продукт",
    links: [
      { href: "/download", label: "Скачать" },
      { href: "/install", label: "Установка" },
      { href: "/releases", label: "Что нового" },
      { href: "/help", label: "Помощь" },
    ],
  },
  {
    title: "Возможности",
    links: [
      { href: "/voice-chat", label: "Голосовой чат онлайн" },
      { href: "/voice-chat/sozvon", label: "Созвон для игр" },
      { href: "/voice-chat/rooms", label: "Комнаты до 8 человек" },
      { href: "/voice-chat/screen-share", label: "Демонстрация экрана" },
      { href: "/voice-chat/phone", label: "На телефоне" },
    ],
  },
  {
    title: "Игрокам",
    links: [
      { href: "/games", label: "Гайды по играм" },
      { href: "/discord-alternative", label: "Аналог Discord" },
      { href: "/blog", label: "Блог" },
    ],
  },
  {
    title: "Mute",
    links: [
      { href: "/about", label: "О Mute" },
      { href: "https://t.me/mutecalls", label: "Мы в Telegram", external: true },
      { href: "https://t.me/mute_calls_bot", label: "Бот поддержки", external: true },
      { href: "mailto:hello@mute.ac", label: "Связаться с нами", external: true },
    ],
  },
];

const linkClass = "body-text text-text-secondary hover:text-accent transition-colors no-underline";

function FooterAnchor({ href, label, external }: FooterLink) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="container border-b border-[#1F1F1F]"></div>
      <div className="h-8 md:h-10 lg:h-[48px]"></div>
      <div className="container">
        <nav aria-label="Разделы сайта" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
          {groups.map(({ title, links }) => (
            <div key={title}>
              <h2 className="body-text text-text-primary font-semibold mb-3 md:mb-4">{title}</h2>
              <ul className="flex flex-col gap-2 md:gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <FooterAnchor {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="h-8 md:h-10"></div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/mute-icon.svg" alt="Mute" width={32} height={32} />
            <span className="body-text text-text-secondary">© 2026 Mute</span>
          </div>
          <nav aria-label="Документы" className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/privacy" className={linkClass}>
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className={linkClass}>
              Пользовательское соглашение
            </Link>
          </nav>
        </div>
      </div>
      <div className="h-8 md:h-10 lg:h-[48px]"></div>
    </footer>
  );
}
