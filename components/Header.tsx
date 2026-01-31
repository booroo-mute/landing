import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "./ButtonPrimary";

export default function Header() {
  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[80px] flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={92} height={24} />
        </Link>
        <div className="flex items-center gap-6">
          <a href="#" className="text-text-secondary hover:text-accent transition-colors">
            Телеграм канал
          </a>
          <ButtonPrimary icon="/windows.svg">Скачать</ButtonPrimary>
        </div>
      </div>
    </header>
  );
}
