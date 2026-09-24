"use client";

import Image from "next/image";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import { usePathname } from "next/navigation";
import { useOS } from "@/components/OSProvider";
import { webAppUrl, pageIdFromPath } from "@/lib/webApp";

interface CtaBannerProps {
  /** Компактная однострочная версия для середины статьи. */
  compact?: boolean;
  heading?: string;
  text?: string;
}

const DEFAULT_HEADING = "Созвонись с друзьями без VPN";
const DEFAULT_TEXT =
  "Зарегистрируйся за минуту (ник, почта, пароль) и зови своих по ссылке. Бесплатно, в браузере или в приложении для Windows и macOS.";
// Компактная версия: две короткие строки вместо одной длинной, которая
// ломалась переносом посреди фразы.
const COMPACT_TEXT = "Mute бесплатный и открывается прямо в браузере.";

// Баннер-призыв в статьях вместо голых кнопок: квадратный знак Mute, короткая
// подводка и кнопки как в hero (зависят от ОС, поэтому компонент клиентский,
// как и HeroBlock). data-goal="guide_cta" и адреса ссылок совпадают с тем,
// что считает MetrikaGoals; data-variant уходит в параметры цели.
export default function CtaBanner({
  compact = false,
  heading = DEFAULT_HEADING,
  text = compact ? COMPACT_TEXT : DEFAULT_TEXT,
}: CtaBannerProps) {
  const os = useOS();
  const isMobile = os === "mobile";
  const icon = os === "macos" ? "/macos.svg" : "/windows.svg";
  const label = os === "macos" ? "Скачать для macOS" : "Скачать для Windows";
  // Тот же адрес, что ловит MetrikaGoals как open_web, плюс UTM страницы и места.
  const pathname = usePathname();
  const WEB_URL = webAppUrl(pageIdFromPath(pathname), compact ? "cta-compact" : "cta-full");

  if (compact) {
    return (
      <aside
        data-goal="guide_cta"
        data-variant="compact"
        aria-label="Попробовать Mute"
        className="my-8 md:my-10 bg-background-secondary p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Image src="/mute-icon.svg" alt="" width={44} height={44} className="w-11 h-11 shrink-0" />
          <div className="min-w-0">
            <p className="body-text font-medium">{heading}</p>
            <p className="body-text text-text-secondary">{text}</p>
          </div>
        </div>
        <ButtonPrimary href={WEB_URL} target="_blank" className="sm:w-fit sm:shrink-0">
          {isMobile ? "Начать общаться" : "Открыть в браузере"}
        </ButtonPrimary>
      </aside>
    );
  }

  return (
    <aside
      data-goal="guide_cta"
      data-variant="full"
      aria-label="Попробовать Mute"
      // Кнопки всегда под текстом: колонка статьи не шире 920px, и в строке
      // две кнопки (~500px) оставляли тексту узкий столбик с переносом заголовка.
      className="mt-10 md:mt-12 bg-background-secondary p-4 md:p-6 flex flex-col gap-5 md:gap-6"
    >
      <div className="flex items-start gap-4 md:gap-5 min-w-0">
        <Image
          src="/mute-icon.svg"
          alt=""
          width={80}
          height={80}
          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0"
        />
        <div className="min-w-0">
          <p className="title-medium-semibold">{heading}</p>
          <p className="body-text text-text-secondary mt-1 md:mt-2">{text}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {isMobile ? (
          <ButtonPrimary href={WEB_URL} target="_blank" className="md:w-fit">
            Начать общаться
          </ButtonPrimary>
        ) : (
          <>
            <ButtonPrimary icon={icon} href="/download" className="md:w-fit">
              {label}
            </ButtonPrimary>
            <ButtonSecondary href={WEB_URL} target="_blank" className="md:w-fit">
              Открыть в браузере
            </ButtonSecondary>
          </>
        )}
      </div>
    </aside>
  );
}
