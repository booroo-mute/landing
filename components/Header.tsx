import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "./ButtonPrimary";

export default function Header() {
  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[64px] md:h-[72px] lg:h-[80px] flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={92} height={24} className="w-[72px] md:w-[82px] lg:w-[92px] h-auto" />
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          <a href="#" className="hidden sm:block text-text-secondary hover:text-accent transition-colors text-[14px] md:text-base whitespace-nowrap">
            Телеграм канал
          </a>
          <ButtonPrimary icon="/windows.svg">Скачать</ButtonPrimary>
        </div>
      </div>
    </header>
  );
}
