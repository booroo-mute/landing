import Image from "next/image";
import Link from "next/link";
import LinkText from "./LinkText";

const productLinks = [
  { href: "/download", label: "Скачать" },
  { href: "/install", label: "Установка" },
  { href: "/discord-alternative", label: "Аналог Discord" },
  { href: "/voice-chat", label: "Голосовой чат онлайн" },
  { href: "/releases", label: "Что нового" },
  { href: "/blog", label: "Блог" },
];

export default function Footer() {
  return (
    <footer>
      <div className="container border-b border-[#1F1F1F]"></div>
      <div className="h-8 md:h-10 lg:h-[48px]"></div>
      <div className="container">
        <nav aria-label="Разделы сайта" className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8">
          {productLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="body-text text-text-secondary hover:text-accent transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <div className="h-6 md:h-8"></div>
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          <div className="flex items-center gap-4">
            <Image src="/mute-icon.svg" alt="Mute" width={32} height={32} />
            <span className="body-text text-text-secondary">
              © 2026 Mute
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8">
            <LinkText href="https://t.me/mutecalls" underline={false} target="_blank">Мы в Telegram</LinkText>
            <LinkText href="https://boosty.to/muteapp" underline={false} target="_blank">Поддержать проект</LinkText>
            <LinkText href="https://t.me/mute_calls_bot" underline={false} target="_blank">Помощь</LinkText>
            <LinkText href="mailto:hello@mute.ac" underline={false} target="_blank">Связаться с нами</LinkText>
          </div>
        </div>
      </div>
      <div className="h-8 md:h-10 lg:h-[48px]"></div>
    </footer>
  );
}
