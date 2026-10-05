import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_UPDATED, DEFAULT_OG_IMAGE, OG_SITE, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CtaBanner from "@/components/CtaBanner";
import { ORGANIZATION_SCHEMA, SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";

// Страница под запросы-определения: «мут это», «мьют это», «mute это»,
// «что такое mute» дали 159 показов в GSC на позиции 8–9 и ни одного клика
// (выгрузка на 27.09.2026): отвечающей страницы на сайте не было.
const TITLE = "Что такое Mute (мьют): голосовой чат для игр с друзьями";
const DESCRIPTION =
  "Mute, по-русски «мьют» или «мут», это бесплатный голосовой чат для игр с друзьями: звонки, комнаты до 8 человек, чаты и показ экрана. В России без VPN.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    ...OG_SITE,
    title: "Что такое Mute",
    description: DESCRIPTION,
    url: "/about",
    images: [DEFAULT_OG_IMAGE],
    type: "article",
    modifiedTime: ABOUT_UPDATED,
  },
};

const h2 = "title-medium-semibold mt-10 md:mt-12";
const p = "body-text text-text-secondary mt-4";
const link = "text-accent hover:underline";
const li = "body-text text-text-secondary";

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          ORGANIZATION_SCHEMA,
          SOFTWARE_APPLICATION_SCHEMA,
          webPageSchema({
            type: "AboutPage",
            url: `${SITE_URL}/about`,
            name: TITLE,
            description: DESCRIPTION,
            dateModified: ABOUT_UPDATED,
          }),
        ]}
      />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "О Mute" }]} />

          <h1 className="title-large mt-6 md:mt-8">Что такое Mute</h1>

          <div className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
            <p className="body-text text-text-secondary">
              Mute (читается «мьют», в поиске часто пишут «мут» или «муте»)
              это бесплатный голосовой чат для игр и разговоров со своими. В
              нём звонят другу один на один, собираются компанией в голосовой
              комнате до 8 человек, переписываются в личных и групповых чатах,
              включают камеру и показывают экран со звуком. Mute работает в
              России без VPN: в приложении для Windows и macOS и прямо в
              браузере, в том числе на телефоне.
            </p>
            <CtaBanner compact />
          </div>

          {/* GSC 6.09–5.10.2026: «мьют это» 147 показов, «мут это» 96, «mute
              это» 55, позиции 4–9 и ни одного клика. Это вопрос про сленг, а
              не про приложение, поэтому ответ на него стоит первым абзацем
              раздела, а мост к приложению идёт после. */}
          <h2 className={h2}>Что значит «мут» и «мьют» в играх</h2>
          <p className={p}>
            «Мут» и «мьют» в играх и чатах значат выключенный звук, от
            английского mute. «Замутить» или «замьютить» игрока значит
            перестать его слышать: его голос, а в некоторых играх и сообщения,
            пропадают только у вас, остальные слышат его как раньше. Снять заглушку значит
            «размутить».
          </p>
          <p className={p}>
            Ещё «мут» бывает наказанием. Модератор сервера или чата «даёт мут»,
            и игрок на время не может писать или говорить: «получил мут на
            час». А «ты в муте» в звонке говорят тому, у кого выключен
            микрофон и кого поэтому никто не слышит.
          </p>

          <h2 className={h2}>Откуда название</h2>
          <p className={p}>
            Mute назван тем же словом, по-английски оно значит «без звука».
            Название про тишину вокруг разговора: в интерфейсе нет серверов,
            лент и магазина, а в звонке сразу включено шумоподавление, чтобы
            посторонних звуков было меньше. Само приложение при этом для тех,
            кого как раз хочется слышать.
          </p>

          <h2 className={h2}>Что умеет Mute</h2>
          <ul className="mt-4 list-disc list-inside space-y-3 md:space-y-4">
            <li className={li}>Звонки один на один без ограничения по времени.</li>
            <li className={li}>
              <Link href="/voice-chat/rooms" className={link}>
                Голосовые комнаты до 8 человек
              </Link>
              : комната живёт постоянно, в неё можно заходить каждый вечер.
            </li>
            <li className={li}>Личные и групповые текстовые чаты.</li>
            <li className={li}>
              Видеозвонки с картинкой в стиле старого пиксельного телефона,
              стилизацию можно отключить.
            </li>
            <li className={li}>
              <Link href="/voice-chat/screen-share" className={link}>
                Демонстрация экрана
              </Link>{" "}
              вместе со звуком, в приложении и в браузере.
            </li>
            <li className={li}>
              Веб-версия, которая открывается в браузере на компьютере и{" "}
              <Link href="/voice-chat/phone" className={link}>
                на телефоне
              </Link>
              : в Safari на iPhone и в Chrome на Android.
            </li>
          </ul>

          <h2 className={h2}>Чего в Mute нет, и это осознанно</h2>
          <p className={p}>
            Публичных серверов, каналов и ролей: Mute сделан для своего круга,
            а не для сообществ на сотни человек. Push-to-talk тоже нет,
            микрофон включается и выключается кнопкой. Мобильных приложений
            пока нет, на телефоне работает веб-версия. Гостевого входа нет:
            чтобы попасть в звонок, другу нужен свой аккаунт. Регистрация
            занимает минуту, нужны ник, почта и пароль, номер телефона не
            нужен.
          </p>

          <h2 className={h2}>Сколько стоит</h2>
          <p className={p}>
            Нисколько. Подписок, платных функций и ограничений по времени
            звонка в Mute нет.
          </p>

          <h2 className={h2}>Кто делает Mute</h2>
          <p className={p}>
            Небольшая независимая команда разработчиков. Новости проекта
            выходят в Telegram-канале{" "}
            <a href="https://t.me/mutecalls" className={link} target="_blank" rel="noopener noreferrer">
              @mutecalls
            </a>
            , история версий собрана в разделе{" "}
            <Link href="/releases" className={link}>
              «Что нового»
            </Link>
            . Написать нам можно на{" "}
            <a href="mailto:hello@mute.ac" className={link}>
              hello@mute.ac
            </a>{" "}
            или в{" "}
            <a href="https://t.me/mute_calls_bot" className={link} target="_blank" rel="noopener noreferrer">
              бот поддержки
            </a>
            .
          </p>

          <h2 className={h2}>С чего начать</h2>
          <p className={p}>
            Проще всего открыть{" "}
            <Link href="/voice-chat" className={link}>
              голосовой чат в браузере
            </Link>{" "}
            и позвать друга по ссылке-приглашению. Если удобнее приложение,
            оно на странице{" "}
            <Link href="/download" className={link}>
              «Скачать»
            </Link>
            . Тем, кто переходит с Discord, пригодится{" "}
            <Link href="/discord-alternative" className={link}>
              сравнение по пунктам
            </Link>
            , а как созвониться в конкретной игре, разобрано{" "}
            <Link href="/games" className={link}>
              в гайдах
            </Link>
            .
          </p>

          <CtaBanner />
        </article>
      </main>
      <Footer />
    </>
  );
}
