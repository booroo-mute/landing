import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, DOWNLOAD_UPDATED, PRODUCT_LAUNCHED } from "@/lib/site";
import Link from "next/link";
import DownloadClient from "./DownloadClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";
import { DOWNLOAD_CONFIG } from "@/lib/downloads";

const TITLE = "Скачать Mute — голосовой чат для игр на Windows и macOS";
const DESCRIPTION =
  "Скачайте Mute — российский аналог Discord без VPN. Бесплатная установка для Windows и macOS, голосовые звонки и чаты для геймеров.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/download" },
  openGraph: {
    ...OG_SITE,
    title: "Скачать Mute — голосовой чат для игр",
    description:
      "Российский аналог Discord без VPN. Установка для Windows и macOS, бесплатно.",
    url: "/download",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
};

const h2 = "title-medium-semibold mt-10 md:mt-12";
const h3 = "title-medium-semibold mt-6 md:mt-8";
const p = "body-text text-text-secondary mt-4";
const link = "text-accent hover:underline";

// Страница скачивания — единственная, где SoftwareApplication сопровождается
// прямыми ссылками на дистрибутивы: поисковики и LLM берут отсюда версию
// и ссылки. Шапки нет намеренно (страница-редирект), футер и крошки — есть,
// чтобы у краулера и у человека без JS был путь дальше по сайту.
// Текст ниже серверный: краулеры с мобильным UA раньше уезжали редиректом на
// beta.mute.ac (noindex) и видели только заголовок; теперь OSProvider держит
// для них нейтральный вариант, и страница читается целиком.
export default function DownloadPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            ...SOFTWARE_APPLICATION_SCHEMA,
            downloadUrl: [DOWNLOAD_CONFIG.files.windows, DOWNLOAD_CONFIG.files.macos],
          },
          webPageSchema({
            url: `${SITE_URL}/download`,
            name: TITLE,
            description: DESCRIPTION,
            datePublished: PRODUCT_LAUNCHED,
            dateModified: DOWNLOAD_UPDATED,
          }),
        ]}
      />
      <main className="container">
        <div className="max-w-[1200px] mx-auto pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Скачать" }]} />
        </div>
        <DownloadClient />
        <article className="max-w-[920px] mx-auto pb-12 md:pb-16 lg:pb-[80px]">
          <p className="body-text text-text-secondary text-center">
            Текущая версия — {DOWNLOAD_CONFIG.version}, изменения по версиям в разделе{" "}
            <Link href="/releases" className={link}>«Что нового»</Link>.
            Не хотите ничего устанавливать?{" "}
            <a href={DOWNLOAD_CONFIG.webVersion} className={link}>Веб-версия</a>{" "}
            работает в браузере на компьютере и телефоне.
          </p>

          <h2 className={h2}>Что внутри</h2>
          <p className={p}>
            Mute сделан как программа для общения в играх на ПК: звонки один на один без
            ограничения по времени, голосовые комнаты до 8 человек, личные и
            групповые чаты. В звонке можно включить камеру или показать экран
            со звуком, так что вместе смотрят и реплеи, и фильмы. Друзей зовут
            по ссылке-приглашению. Публичных серверов, каналов и push-to-talk
            нет: микрофон включается и выключается кнопкой.
          </p>

          <h2 className={h2}>Что нужно для работы</h2>
          <p className={p}>
            Приложение ставится на Windows (файл .exe) и macOS (файл .dmg). Для
            звонка нужен интернет и любой микрофон, лучше гарнитура. Веб-версии
            хватает браузера с поддержкой WebRTC: Chrome, Яндекс Браузер, Safari
            или Firefox. Mute работает в России без VPN, дополнительных настроек
            не требует.
          </p>
          {/* TODO: минимальные версии Windows и macOS подтвердить у команды, в репозитории их нет */}

          <h2 className={h2}>Не хотите устанавливать: веб-версия</h2>
          <p className={p}>
            Всё, что есть в приложении, работает и во вкладке браузера на{" "}
            <a href={DOWNLOAD_CONFIG.webVersion} className={link}>beta.mute.ac</a>:
            звонки, комнаты, чаты, видео и демонстрация экрана. На телефоне
            откройте ту же ссылку в Safari на iPhone или в Chrome на Android,
            отдельного мобильного приложения нет. На слабом компьютере вкладка
            в уже открытом браузере легче отдельной программы. Подробнее на
            страницах про{" "}
            <Link href="/voice-chat" className={link}>голосовой чат онлайн</Link>{" "}
            и{" "}
            <Link href="/voice-chat/phone" className={link}>Mute на телефоне</Link>.
          </p>

          <h2 className={h2}>Предупреждение при первом запуске</h2>
          <p className={p}>
            Windows показывает окно SmartScreen, а macOS с первого раза не
            открывает программу: так обе системы встречают приложения небольших
            разработчиков. Как пройти дальше, по шагам:{" "}
            <Link href="/install/windows" className={link}>инструкция для Windows</Link>{" "}
            и{" "}
            <Link href="/install/macos" className={link}>инструкция для macOS</Link>.
          </p>

          <h2 className={h2}>Три коротких вопроса</h2>
          <h3 className={h3}>Сколько стоит Mute?</h3>
          <p className={p}>
            Ничего. Подписок и платных функций нет, ограничений по времени
            звонка тоже.
          </p>
          <h3 className={h3}>Нужна ли регистрация?</h3>
          <p className={p}>
            Да: ник, почта и пароль, телефон не нужен. Другу для звонка тоже
            понадобится аккаунт, гостевого входа нет.
          </p>
          <h3 className={h3}>Можно ли не устанавливать?</h3>
          <p className={p}>
            Да, веб-версия работает в браузере, в том числе на телефоне.
            Приложение удобнее тем, кто созванивается каждый день: не нужно
            искать вкладку среди остальных.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
