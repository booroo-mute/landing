import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, DOWNLOAD_UPDATED, PRODUCT_LAUNCHED } from "@/lib/site";
import Link from "next/link";
import DownloadClient from "./DownloadClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";
import { DOWNLOAD_CONFIG } from "@/lib/downloads";
import { webAppUrl } from "@/lib/webApp";

// «программа для созвона на пк», «приложение для созвона на пк» (подсказки
// 01.10.2026) в title. «голосовой чат скачать» (102 показа) и «скачать
// голосовой чат» (65) в GSC 6.09–5.10 стоят на позициях 7,7–8,3 почти без
// кликов: с 5.10 фраза в начале description и в своём H2, title пока не
// трогаем (поменяли 01.10, данных мало). Если к 26.10 сдвига нет, добавить
// «голосовой чат» и в title.
// 7.10: «программы для общения в играх» 32 показа на позиции 18,9, «программа
// для разговоров во время игры» 20 на 15,8: фраза вынесена в title.
const TITLE = "Скачать Mute: голосовой чат и программа для общения в играх на ПК";
const DESCRIPTION =
  "Скачать голосовой чат Mute для игр на ПК бесплатно: программа для общения и созвона с друзьями. Windows 10 и 11, macOS и веб-версия. В России без VPN.";

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

// Both installers and the browser option remain visible without automatic navigation.
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
            Актуальные версии: {DOWNLOAD_CONFIG.versions.windows} для Windows
            и {DOWNLOAD_CONFIG.versions.macos} для macOS, дальше обе обновляются
            сами. Для Mac нужен процессор Apple Silicon (M1 и новее) и macOS 14
            или новее. Что менялось от версии к версии, смотрите в разделе{" "}
            <Link href="/releases" className={link}>«Что нового»</Link>.
            Не хотите ничего устанавливать?{" "}
            <a href={webAppUrl("download", "text")} className={link}>Веб-версия</a>{" "}
            работает в браузере на компьютере и телефоне.
          </p>

          <h2 className={h2}>Скачать голосовой чат на ПК</h2>
          <p className={p}>
            Выберите установщик MuteSetup.exe для Windows или файл .dmg для
            macOS в начале страницы. Загрузка начинается по нажатию. Голосовой чат
            бесплатный, приложение дальше обновляется само. После
            установки зарегистрируйтесь, отправьте другу ссылку-приглашение и
            звоните: окно Mute можно свернуть, разговор идёт, пока вы в игре.
          </p>

          {/* GSC 27.09: «программы для общения в играх» на позиции 20,
              «программа для разговоров во время игры» на 17. Перечень
              формулировок подряд убран: он читался как набивка. */}
          <h2 className={h2}>Программа для общения в играх: что внутри</h2>
          <p className={p}>
            Mute сделан как программа для общения голосом в играх на ПК,
            по-простому приложение для созвона с друзьями: звонки один на один без ограничения по времени, голосовые комнаты
            до 8 человек, личные и групповые чаты. В звонке можно включить
            камеру или показать экран со звуком, так что вместе смотрят и
            реплеи, и фильмы. Друзей зовут по ссылке-приглашению. Публичных
            серверов, каналов и push-to-talk нет: микрофон включается и
            выключается кнопкой, а разговаривать во время игры можно, не
            сворачивая её, всё в одном окне со списком друзей.
          </p>

          {/* Метрика 12.09–6.10: «приложение для разговора в играх» 4 визита,
              «программа для разговоров во время игры» 20 показов в GSC. */}
          <h3 className={h3}>Приложение для разговора в играх, а не ещё один мессенджер</h3>
          <p className={p}>
            Mute нужен для одного: разговаривать с друзьями, пока идёт игра.
            Окно сворачивается, список друзей и комната остаются под рукой,
            а качество связи зависит от подключения: загрузки и перегруженный
            Wi-Fi могут мешать и игре, и голосу. Ни лент, ни каналов, ни магазина внутри нет.
          </p>

          <h2 className={h2}>Что нужно для работы</h2>
          <p className={p}>
            Приложение ставится на Windows 10 и 11, 64-битные (файл .exe, права
            администратора не нужны), и на macOS 14+ с Apple Silicon (файл .dmg). Для звонка нужен
            интернет и любой микрофон, лучше гарнитура. Веб-версии
            хватает браузера с поддержкой WebRTC: Chrome, Яндекс Браузер, Safari
            или Firefox. Mute работает в России без VPN, дополнительных настроек
            не требует.
          </p>

          <h2 className={h2}>Не хотите устанавливать: веб-версия</h2>
          <p className={p}>
            Звонки, комнаты, чаты и видео доступны во вкладке браузера на{" "}
            <a href={webAppUrl("download", "web-section")} className={link}>beta.mute.ac</a>:
            звонки, комнаты, чаты, видео и демонстрация экрана. На телефоне
            откройте ту же ссылку в Safari на iPhone или в Chrome на Android,
            отдельного мобильного приложения нет. Захват экрана и системного
            звука зависит от браузера и ОС; на телефоне можно смотреть показ друга.
            Для Windows и совместимого Mac доступны нативные приложения без Electron. Подробнее на
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
            Если после установки нет звука или не показывается экран, загляните
            в <Link href="/help" className={link}>помощь по Mute</Link>.
          </p>

          <h2 className={h2}>Короткие вопросы</h2>
          {/* «говорилка для игр» и варианты: 2–5 показов в день в Яндексе
              (Вебмастер 23–29.09.2026), слова на сайте не было. */}
          <h3 className={h3}>Mute это говорилка для игр?</h3>
          <p className={p}>
            Да, по-простому так и есть: говорилка для игр на ПК, бесплатная
            программа для голосовой связи с друзьями. Зашли в комнату,
            свернули окно и разговариваете, пока играете. В России работает
            без VPN.
          </p>
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
