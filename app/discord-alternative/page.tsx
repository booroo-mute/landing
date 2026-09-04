import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { FAQ_ITEMS } from "@/lib/faq";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Аналог Discord в России без VPN — Mute, бесплатный голосовой чат",
  description:
    "Ищете замену Discord, которая работает в России без VPN? Mute — бесплатный голосовой чат для игр: звонки 1:1, комнаты до 8 человек, чаты. Сравнение с Discord по пунктам.",
  alternates: { canonical: "/discord-alternative" },
  openGraph: {
    title: "Аналог Discord в России — Mute",
    description:
      "Бесплатный голосовой чат для игр, работает без VPN. Сравнение Mute и Discord по пунктам.",
    url: "/discord-alternative",
    type: "article",
  },
};

const comparisonRows: Array<{ label: string; mute: string; discord: string }> = [
  { label: "Доступ из России", mute: "Работает без VPN", discord: "Заблокирован, нужен VPN" },
  { label: "Цена", mute: "Бесплатно, без подписок", discord: "Бесплатно + платный Nitro" },
  { label: "Что внутри", mute: "Друзья, звонки, видео, чаты, демонстрация экрана", discord: "То же плюс серверы, каналы, роли, магазин, Nitro" },
  { label: "Звонки 1-1", mute: "Без ограничений по времени", discord: "Есть" },
  { label: "Видеозвонки", mute: "Есть, в фирменном пиксельном ретро-стиле (отключается)", discord: "Есть" },
  { label: "Демонстрация экрана", mute: "Есть, в приложении и в браузере", discord: "Есть (Go Live)" },
  { label: "Голосовые комнаты", mute: "До 8 участников", discord: "Серверы и каналы, тысячи участников" },
  { label: "Текстовые чаты", mute: "Личные и групповые", discord: "Личные, групповые, каналы" },
  { label: "Публичные сообщества", mute: "Нет — только свой круг", discord: "Да, основной сценарий" },
  { label: "Сложность", mute: "Позвонить можно сразу после регистрации", discord: "Серверы, роли, права, настройки" },
  { label: "Платформы", mute: "Windows, macOS, браузер", discord: "Windows, macOS, Linux, iOS, Android, браузер" },
  { label: "Язык интерфейса", mute: "Русский", discord: "Русский (частично)" },
];

const faqSubset = FAQ_ITEMS.slice(0, 6);

export default function DiscordAlternativePage() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Аналог Discord" }]} />

          <h1 className="title-large mt-6 md:mt-8">
            Аналог Discord в России — Mute
          </h1>

          <div className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
            <p className="body-text text-text-secondary">
              Осенью 2024 года Discord перестал открываться в России без VPN,
              и миллионам геймеров пришлось искать замену для голосовых
              созвонов. Mute — один из вариантов такой замены. Это бесплатный
              голосовой чат, который работает в России без VPN и сделан
              специально для игр и общения со своей компанией.
            </p>
            <p className="body-text text-text-secondary">
              Копировать Discord целиком мы не стали. В Mute нет публичных
              серверов, каналов и ролей, есть друзья, звонки один на один,
              комнаты до 8 человек и чаты. Этого хватает, чтобы созвониться
              и играть, а настройка не растягивается на час.
            </p>
          </div>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            Mute и Discord: сравнение по пунктам
          </h2>
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
              className="text-accent hover:underline"
            >
              По данным TechRadar
            </a>
            , Discord — один из самых требовательных к памяти фоновых
            приложений на Windows. В Mute интерфейс маленький, потому что в нём
            нет серверов, магазина и ленты сообществ; видеозвонки и
            демонстрация экрана при этом есть. А на слабом железе можно вообще
            ничего не ставить и открыть звонок вкладкой браузера.
          </p>

          <h2 className="title-medium-semibold mt-10 md:mt-12">Кому подойдёт Mute</h2>
          <ul className="mt-4 list-disc list-inside space-y-3 md:space-y-4">
            <li className="body-text text-text-secondary">
              Компаниям друзей, которые созваниваются ради игр и общения
            </li>
            <li className="body-text text-text-secondary">
              Тем, кому надоело включать VPN ради каждого созвона
            </li>
            <li className="body-text text-text-secondary">
              Тем, кто хочет лёгкое приложение без лишних настроек
            </li>
          </ul>

          <h2 className="title-medium-semibold mt-8 md:mt-10">Кому Mute не подойдёт</h2>
          <p className="body-text text-text-secondary mt-4">
            Если вы ведёте сообщество на сотни участников с каналами, ролями
            и ботами, в Mute вам будет тесно, таких инструментов в нём нет.
            Для больших публичных сообществ лучше подойдут Discord с VPN или
            Telegram. Mute рассчитан на созвоны со своими.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3">
            <ButtonPrimary href="/download">Скачать Mute бесплатно</ButtonPrimary>
            <ButtonSecondary href="https://beta.mute.ac/welcome" target="_blank">
              Открыть в браузере
            </ButtonSecondary>
          </div>

          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Полезное по теме:{" "}
            <Link href="/install" className="text-accent hover:underline">
              как установить Mute
            </Link>{" "}
            и{" "}
            <Link href="/releases" className="text-accent hover:underline">
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
