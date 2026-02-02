import LinkText from "./LinkText";

export default function Footer() {
  return (
    <footer>
      <div className="container border-b border-[#1F1F1F]"></div>
      <div className="h-[48px]"></div>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="body-text text-text-secondary">
              © 2026 Mute
            </span>
            <div className="w-8 h-8 bg-[#1F1F1F] rounded" />
          </div>
          <div className="flex items-center gap-8">
            <LinkText href="#" underline={false}>Мы в Telegram</LinkText>
            <LinkText href="#" underline={false}>Поддержка</LinkText>
            <LinkText href="#" underline={false}>Связаться с нами</LinkText>
          </div>
        </div>
      </div>
      <div className="h-[48px]"></div>
    </footer>
  );
}
