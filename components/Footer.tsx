import LinkText from "./LinkText";

export default function Footer() {
  return (
    <footer>
      <div className="container border-b border-[#1F1F1F]"></div>
      <div className="h-8 md:h-10 lg:h-[48px]"></div>
      <div className="container">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          <div className="flex items-center gap-4">
            <img src="/mute-icon.svg" alt="Mute" width={32} height={32} />
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
