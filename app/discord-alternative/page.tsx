import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, DISCORD_ALTERNATIVE_UPDATED } from "@/lib/site";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import CtaBanner from "@/components/CtaBanner";
import { FAQ_ITEMS, type FaqItem } from "@/lib/faq";
import { SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";

const TITLE = "Аналог и замена Discord в России 2026 — Mute, без VPN";
const DESCRIPTION =
  "Замена Discord в России без VPN для ПК и браузера: Mute — бесплатный голосовой чат для игр с демонстрацией экрана, комнаты до 8 человек. Сравнение по пунктам.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/discord-alternative" },
  openGraph: {
    ...OG_SITE,
    title: "Аналог и замена Discord в России — Mute",
    description:
      "Бесплатный голосовой чат для игр, работает без VPN. Сравнение Mute и Discord по пунктам.",
    url: "/discord-alternative",
    images: [DEFAULT_OG_IMAGE],
    type: "article",
    modifiedTime: DISCORD_ALTERNATIVE_UPDATED,
  },
};

const comparisonRows: Array<{ label: string; mute: string; discord: string }> = [
  { label: "Доступ из России", mute: "Работает без VPN", discord: "Доступ ограничен с октября 2024" },
  { label: "Цена", mute: "Бесплатно, без подписок", discord: "Бесплатно + платный Nitro" },
  { label: "Что внутри", mute: "Друзья, звонки, видео, чаты, демонстрация экрана", discord: "То же плюс серверы, каналы, роли, магазин, Nitro" },
  { label: "Звонки 1-1", mute: "Без ограничений по времени", discord: "Есть" },
  { label: "Видеозвонки", mute: "Есть, в фирменном пиксельном ретро-стиле (отключается)", discord: "Есть" },
  { label: "Демонстрация экрана", mute: "Есть, со звуком, в приложении и в браузере", discord: "Есть (Go Live)" },
  { label: "Шумоподавление", mute: "Включено сразу, без настройки", discord: "Есть" },
  { label: "Голосовые комнаты", mute: "До 8 участников", discord: "Серверы и каналы, тысячи участников" },
  { label: "Текстовые чаты", mute: "Личные и групповые", discord: "Личные, групповые, каналы" },
  { label: "Публичные сообщества", mute: "Нет — только свой круг", discord: "Да, основной сценарий" },
  { label: "Сложность", mute: "Позвонить можно сразу после регистрации", discord: "Серверы, роли, права, настройки" },
  { label: "Платформы", mute: "ПК (Windows, macOS) и браузер", discord: "Windows, macOS, Linux, iOS, Android, браузер" },
  { label: "Язык интерфейса", mute: "Русский", discord: "Русский (частично)" },
];

// В поиске это слово чаще пишут кириллицей («аналог дискорда»), поэтому один
// вопрос страницы задан именно так: на сайте иначе не было ни одной формы,
// которую люди набирают.
const pageFaq: FaqItem = {
  question: "Чем Mute отличается от других замен Дискорда?",
  answer:
    "Mute сделан для своей компании, а не для сообществ: в нём нет серверов, ролей и ботов, зато созвон начинается через минуту после регистрации, а экран показывается со звуком прямо из браузера. Если нужны каналы на сотни человек, ищите сервис с серверами.",
};
const faqSubset = [...FAQ_ITEMS.slice(0, 5), pageFaq];

const h2 = "title-medium-semibold mt-10 md:mt-12";
const h3 = "title-medium-semibold mt-6 md:mt-8";
const p = "body-text text-text-secondary mt-4";
const link = "text-accent hover:underline";

export default function DiscordAlternativePage() {
  return (
    <>
      <JsonLd
        data={[
          SOFTWARE_APPLICATION_SCHEMA,
          webPageSchema({
            url: `${SITE_URL}/discord-alternative`,
            name: TITLE,
            description: DESCRIPTION,
            dateModified: DISCORD_ALTERNATIVE_UPDATED,
          }),
        ]}
      />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Аналог Discord" }]} />

          <h1 className="title-large mt-6 md:mt-8">
            Аналог и замена Discord в России — Mute
          </h1>

          <div className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
            <p className="body-text text-text-secondary">
              Осенью 2024 года доступ к Discord в России ограничили,
              и миллионам геймеров пришлось искать замену для голосовых
              созвонов. Mute — один из вариантов такой замены. Это бесплатный
              голосовой чат для ПК и браузера, который работает в России
              без VPN и сделан специально для игр и общения со своей компанией.
            </p>
            <p className="body-text text-text-secondary">
              Копировать Discord целиком мы не стали. В Mute нет публичных
              серверов, каналов и ролей, есть друзья, звонки один на один,
              комнаты до 8 человек, чаты и демонстрация экрана. Этого
              хватает, чтобы созвониться и играть, а настройка не
              растягивается на час.
            </p>
          </div>

          <h2 className={h2}>Mute и Discord: сравнение по пунктам</h2>
          <div className="mt-4 md:mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="body-text text-text-secondary font-normal py-3 pr-4"></th>
                  <th className="title-medium-semibold py-3 pr-4">Mute</th>
                  <th className="title-medium-semibold py-3">Discord</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-[#1F1F1F]">
                    <td className="body-text text-text-secondary py-3 pr-4">{row.label}</td>
                    <td className="body-text py-3 pr-4">{row.mute}</td>
                    <td className="body-text text-text-secondary py-3">{row.discord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="body-text text-text-secondary mt-6 md:mt-8">
            Отдельный пункт: ресурсы компьютера.{" "}
            <a
              href="https://www.techradar.com/computing/memory/some-windows-11-apps-have-a-massive-ram-problem-and-this-app-is-the-worst-offender"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              По данным TechRadar
            </a>
            , Discord — один из самых требовательных к памяти фоновых
            приложений на Windows. В Mute интерфейс маленький, потому что в нём
            нет серверов, магазина и ленты сообществ; видеозвонки и
            демонстрация экрана при этом есть. А на слабом железе можно вообще
            ничего не ставить и открыть звонок вкладкой браузера.
          </p>

          <p className="body-text text-text-secondary mt-4 md:mt-5">
            И про пинг. Mute не трогает трафик игры и никуда его не
            перенаправляет, поэтому от созвона пинг не поднимается. Канал при
            этом общий: слабый Wi-Fi, загрузки и перегруженный компьютер
            ухудшат и игру, и звонок. Настраивать перед созвоном ничего не нужно.
          </p>

          <h2 className={h2}>Замена Дискорда для игр: что умеет Mute</h2>
          <p className={p}>
            Замену Дискорду обычно ищут с уточнением: с демонстрацией экрана,
            в браузере, на телефон, для слабого ПК, с шумоподавлением, для
            стрима, на PS5. По каждому пункту коротко.
          </p>

          <h3 className={h3}>С демонстрацией экрана и звуком</h3>
          <p className={p}>
            Показать весь экран или одно окно можно и в приложении, и в
            браузере, вместе со звуком системы: фильм, реплей или чужую игру
            слышно так же, как видно. Качество выбирается в меню демонстрации,
            до 1080p при 60 кадрах. Подробнее на странице про{" "}
            <Link href="/voice-chat/screen-share" className={link}>
              демонстрацию экрана
            </Link>
            .
          </p>

          <h3 className={h3}>В браузере, без установки</h3>
          <p className={p}>
            Всё работает во вкладке на beta.mute.ac: звонки, комнаты, чаты,
            видео и экран. Ставить приложение не обязательно, а на чужом или
            школьном компьютере это единственный вариант.
          </p>

          <h3 className={h3}>На телефоне</h3>
          <p className={p}>
            Мобильного приложения нет, но та же веб-версия открывается в
            Safari на iPhone и в Chrome на Android. Как добавить её на
            домашний экран и дать доступ к микрофону, рассказано на странице{" "}
            <Link href="/voice-chat/phone" className={link}>
              про Mute на телефоне
            </Link>
            .
          </p>

          <h3 className={h3}>На слабом ПК</h3>
          <p className={p}>
            Если компьютер еле тянет игру, не ставьте ничего: откройте звонок
            вкладкой в уже запущенном браузере. Интерфейс Mute маленький, в нём
            нет серверов, магазина и ленты, а собственных замеров памяти
            приложения мы пока не публикуем.
          </p>

          <h3 className={h3}>С шумоподавлением</h3>
          <p className={p}>
            Шумоподавление в Mute включено сразу, настраивать его не нужно.
            Режима «нажми и говори» нет: микрофон включается и выключается
            кнопкой.
          </p>

          <h3 className={h3}>Для стрима</h3>
          <p className={p}>
            Голос для стрима с другом идёт из обычного звонка в отдельном
            окне. В OBS звук приложения захватывается отдельным источником,
            так что голос друзей можно пустить в эфир или оставить себе.
            Интеграции со стриминговыми площадками и оверлея в Mute нет. Как
            показать игру другу без стрима, разобрано в статье{" "}
            <Link href="/blog/kak-pokazat-igru-drugu" className={link}>
              «Как показать игру другу»
            </Link>
            .
          </p>

          <h3 className={h3}>На PS5 и Xbox</h3>
          <p className={p}>
            Приложения для приставок нет. Компании с консолями созваниваются в
            Mute на телефоне или ноутбуке рядом, игра остаётся на большом
            экране. Что на консоли работает без Discord, разобрано в{" "}
            <Link href="/blog/discord-na-ps5-i-xbox-v-rossii" className={link}>
              заметке про PS5 и Xbox
            </Link>
            .
          </p>

          <h2 className={h2}>Кому подойдёт Mute</h2>
          <ul className="mt-4 list-disc list-inside space-y-3 md:space-y-4">
            <li className="body-text text-text-secondary">
              Компаниям друзей, которые созваниваются ради игр и общения
            </li>
            <li className="body-text text-text-secondary">
              Тем, кому надоело перед каждым созвоном выяснять, у кого что
              открывается
            </li>
            <li className="body-text text-text-secondary">
              Тем, кто хочет лёгкое приложение без лишних настроек
            </li>
          </ul>

          <h2 className="title-medium-semibold mt-8 md:mt-10">Кому Mute не подойдёт</h2>
          <p className={p}>
            Если вы ведёте сообщество на сотни участников с каналами, ролями
            и ботами, в Mute вам будет тесно, таких инструментов в нём нет.
            Для больших публичных сообществ по-прежнему подойдёт Discord,
            если он у вас открывается, или свой сервер вроде TeamSpeak. Mute рассчитан на созвоны со своими.
          </p>

          <CtaBanner />

          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Полезное по теме:{" "}
            <Link href="/blog/analogi-discord-v-rossii" className={link}>
              обзор остальных замен
            </Link>
            ,{" "}
            <Link href="/install" className={link}>
              как установить Mute
            </Link>{" "}
            и{" "}
            <Link href="/releases" className={link}>
              что нового в последних версиях
            </Link>
            .
          </p>
        </article>
      </main>
      {/* FAQPage JSON-LD объявлен только на главной — дубль на двух URL
          выглядит для поисковиков как повторяющаяся разметка */}
      <FaqSection items={faqSubset} withSchema={false} />
      <Footer />
    </>
  );
}
