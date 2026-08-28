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
  title: "Голосовой чат с другом онлайн: в браузере, без VPN — Mute",
  description:
    "Созвониться с другом за пару минут: откройте Mute в браузере, отправьте ссылку-приглашение и говорите. Бесплатно, без VPN, устанавливать ничего не нужно. Для компании есть комнаты до 8 человек.",
  alternates: { canonical: "/voice-chat" },
  openGraph: {
    title: "Голосовой чат с другом онлайн — Mute",
    description:
      "Откройте Mute в браузере, отправьте другу ссылку-приглашение и говорите. Бесплатно и без VPN.",
    url: "/voice-chat",
    type: "website",
  },
};

// Вопросы, релевантные именно этой странице (без дублирования FAQPage-разметки,
// она объявлена только на главной)
const faqQuestions = [
  "Работает ли Mute в России без VPN?",
  "Сколько человек может быть в комнате?",
  "Нужна ли регистрация?",
  "Как позвать друга в Mute?",
  "Можно ли пользоваться Mute без установки?",
];
const faqSubset = FAQ_ITEMS.filter((item) => faqQuestions.includes(item.question));

export default function VoiceChatPage() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Голосовой чат онлайн" }]} />

          <h1 className="title-large mt-6 md:mt-8">
            Голосовой чат с другом онлайн
          </h1>

          <div className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
            <p className="body-text text-text-secondary">
              Mute — голосовой чат для разговоров со своими: с другом во время
              игры, с компанией вечером, один на один без лимита времени. Он
              открывается прямо в браузере, работает в России без VPN и ничего
              не стоит.
            </p>
            <p className="body-text text-text-secondary">
              Случайных собеседников здесь нет. Это не чат-рулетка и не сайт
              знакомств: в разговор попадают только те, кого вы сами позвали.
              Посторонний не может подключиться к вашему звонку.
            </p>
          </div>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            Как созвониться
          </h2>
          <ol className="mt-4 list-decimal list-inside space-y-2">
            <li className="body-text text-text-secondary">
              Откройте{" "}
              <a href="https://beta.mute.ac/welcome" className="text-accent hover:underline">
                веб-версию Mute
              </a>{" "}
              в любом браузере или{" "}
              <Link href="/download" className="text-accent hover:underline">
                скачайте приложение
              </Link>{" "}
              для Windows или macOS.
            </li>
            <li className="body-text text-text-secondary">
              Зарегистрируйтесь: ник, почта и пароль. Телефон не нужен.
            </li>
            <li className="body-text text-text-secondary">
              Отправьте другу ссылку-приглашение в любом мессенджере.
            </li>
            <li className="body-text text-text-secondary">
              Друг откроет ссылку, зарегистрируется и добавится к вам в друзья.
              Звоните.
            </li>
          </ol>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            Работает в браузере, даже на телефоне
          </h2>
          <p className="body-text text-text-secondary mt-4">
            Устанавливать Mute не обязательно. Звонки, комнаты и чаты работают
            в веб-версии целиком, поэтому созвониться можно с чужого
            компьютера, со школьного ноутбука или с телефона. Если вы играете на консоли и
            голосовой чат в пати недоступен, Mute на телефоне в соседнем окне
            решает и эту проблему.
          </p>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            Вдвоём или компанией
          </h2>
          <p className="body-text text-text-secondary mt-4">
            Звонок один на один не ограничен по времени: хоть весь вечер, хоть
            всю ночь. Для компании есть голосовые комнаты до 8 человек, этого
            хватает на полный состав в большинстве игр. Внутри также есть личные
            и групповые текстовые чаты.
          </p>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            Почему без VPN
          </h2>
          <p className="body-text text-text-secondary mt-4">
            Mute не заблокирован в России, поэтому обходные настройки ему не
            нужны. Не приходится проверять перед каждым созвоном, «поднялся ли
            VPN» у вас и у друга. Если вы переходите с Discord, посмотрите{" "}
            <Link href="/discord-alternative" className="text-accent hover:underline">
              подробное сравнение Mute и Discord
            </Link>
            .
          </p>

          <h2 className="title-medium-semibold mt-10 md:mt-12">
            О чём честно предупредим
          </h2>
          <p className="body-text text-text-secondary mt-4">
            Mute — молодой проект небольшой команды. Мобильных приложений пока
            нет, на телефоне работает браузерная версия. Публичных серверов и
            каналов тоже нет: Mute рассчитан на созвоны со своим кругом, а не
            на сообщества на сотни человек.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3">
            <ButtonPrimary href="https://beta.mute.ac/welcome" target="_blank">
              Открыть в браузере
            </ButtonPrimary>
            <ButtonSecondary href="/download">Скачать приложение</ButtonSecondary>
          </div>

          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Полезное по теме:{" "}
            <Link href="/games" className="text-accent hover:underline">
              гайды по войсу в конкретных играх
            </Link>
            ,{" "}
            <Link href="/blog/golosovoy-chat-v-brauzere" className="text-accent hover:underline">
              как устроен голосовой чат в браузере
            </Link>{" "}
            и{" "}
            <Link href="/blog/kak-pozvonit-druzyam-v-igre-bez-discord" className="text-accent hover:underline">
              как позвонить друзьям в игре без Discord
            </Link>
            .
          </p>
        </article>
      </main>
      <FaqSection items={faqSubset} withSchema={false} />
      <Footer />
    </>
  );
}
