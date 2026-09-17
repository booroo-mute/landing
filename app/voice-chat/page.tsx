import type { Metadata } from "next";
import { webAppUrl } from "@/lib/webApp";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, VOICE_CHAT_UPDATED } from "@/lib/site";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { FAQ_ITEMS } from "@/lib/faq";
import { SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";

const TITLE = "Голосовой чат с другом онлайн: в браузере, без VPN";
const DESCRIPTION =
  "Созвониться с другом за пару минут: откройте Mute в браузере, отправьте ссылку-приглашение и говорите. Бесплатно, без VPN и установки. Комнаты до 8 человек.";

export const metadata: Metadata = {
  title: `${TITLE} — Mute`,
  description: DESCRIPTION,
  alternates: { canonical: "/voice-chat" },
  openGraph: {
    ...OG_SITE,
    title: "Голосовой чат с другом онлайн — Mute",
    description:
      "Откройте Mute в браузере, отправьте другу ссылку-приглашение и говорите. Бесплатно и без VPN.",
    url: "/voice-chat",
    images: [DEFAULT_OG_IMAGE],
    // article, а не website: только у этого типа Next отдаёт modifiedTime
    type: "article",
    modifiedTime: VOICE_CHAT_UPDATED,
  },
};

// Вопросы, релевантные именно этой странице (без дублирования FAQPage-разметки,
// она объявлена только на главной)
const faqQuestions = [
  "Работает ли Mute в России без VPN?",
  "Сколько человек может быть в комнате?",
  "Есть ли в Mute видео и демонстрация экрана?",
  "Нужна ли регистрация?",
  "Как позвать друга в Mute?",
  "Можно ли пользоваться Mute без установки?",
];
const faqSubset = FAQ_ITEMS.filter((item) => faqQuestions.includes(item.question));

const h2 = "title-medium-semibold mt-10 md:mt-12";
const p = "body-text text-text-secondary mt-4";
const link = "text-accent hover:underline";

// Страница-хаб раздела: сценарии «на телефоне», «демонстрация экрана» и
// «комнаты» вынесены в /voice-chat/<slug>, здесь по абзацу и ссылке на каждый.
export default function VoiceChatPage() {
  return (
    <>
      <JsonLd
        data={[
          SOFTWARE_APPLICATION_SCHEMA,
          webPageSchema({
            url: `${SITE_URL}/voice-chat`,
            name: TITLE,
            description: DESCRIPTION,
            dateModified: VOICE_CHAT_UPDATED,
          }),
        ]}
      />
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
            {/* CTA сразу под заголовком: по Метрике запрос «голосовой чат»
                давал отказ 36% и 26 секунд на странице — люди не находили,
                где начать. Рядом честно про регистрацию, чтобы она не была
                сюрпризом на следующем шаге. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ButtonPrimary href={webAppUrl("voice-chat", "intro")} target="_blank">
                Открыть в браузере
              </ButtonPrimary>
              <span className="body-text text-text-secondary">
                Регистрация за минуту: ник, почта и пароль. Телефон не нужен.
              </span>
            </div>
            <p className="body-text text-text-secondary">
              Случайных собеседников здесь нет. Это не чат-рулетка и не сайт
              знакомств: в разговор попадают только те, кого вы сами позвали.
              Посторонний не может подключиться к вашему звонку.
            </p>
          </div>

          <h2 className={h2}>Как созвониться</h2>
          <ol className="mt-4 list-decimal list-inside space-y-3 md:space-y-4">
            <li className="body-text text-text-secondary">
              Откройте{" "}
              <a href={webAppUrl("voice-chat", "steps")} className={link}>
                веб-версию Mute
              </a>{" "}
              в любом браузере или{" "}
              <Link href="/download" className={link}>
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
              Друг откроет ссылку, зарегистрируется и сразу получит предложение
              добавить вас в друзья или зайти в вашу комнату. Звоните.
            </li>
          </ol>

          <h2 className={h2}>Где созвониться с друзьями в России</h2>
          <p className={p}>
            Сайт для созвона с друзьями сейчас выбирают по одному признаку:
            открывается ли он в России напрямую. Mute открывается и работает
            без VPN: звонок идёт своим путём, настраивать ничего не нужно, и
            проверять перед каждым созвоном, у кого что сегодня открывается,
            больше не приходится. Из того, что ещё работает, есть встроенный
            войс самой игры и свой сервер вроде TeamSpeak или Mumble. Чем они
            отличаются и когда что выбрать, разобрано в статье{" "}
            <Link href="/blog/kak-pozvonit-druzyam-v-igre-bez-discord" className={link}>
              «Где созвониться с друзьями в 2026: три способа»
            </Link>
            .
          </p>

          <h2 className={h2}>Работает в браузере, даже на телефоне</h2>
          <p className={p}>
            Устанавливать Mute не обязательно. Звонки, комнаты и чаты работают
            в веб-версии целиком, поэтому созвониться можно с чужого
            компьютера, со школьного ноутбука или с телефона. Отдельного
            мобильного приложения нет, но та же веб-версия открывается в Safari
            на iPhone и в Chrome на Android; если играете на консоли и войс в
            пати недоступен, Mute на телефоне в соседнем окне решает и это.
            Как открыть, дать доступ к микрофону и добавить иконку на домашний
            экран:{" "}
            <Link href="/voice-chat/phone" className={link}>
              Mute на телефоне
            </Link>
            .
          </p>

          <h2 className={h2}>Вдвоём или компанией</h2>
          <p className={p}>
            Звонок один на один не ограничен по времени: хоть весь вечер, хоть
            всю ночь. Для компании есть{" "}
            <Link href="/voice-chat/rooms" className={link}>
              голосовые комнаты до 8 человек
            </Link>
            , этого хватает на полный состав в большинстве игр. Внутри также
            есть личные и групповые текстовые чаты, а когда голоса мало, можно
            включить камеру или{" "}
            <Link href="/voice-chat/screen-share" className={link}>
              показать свой экран со звуком
            </Link>
            , в том числе из браузера.
          </p>

          <h2 className={h2}>Почему без VPN</h2>
          <p className={p}>
            Mute открывается в России напрямую, никаких дополнительных
            настроек ему не нужно. Не приходится проверять перед каждым
            созвоном, у кого что работает. Если вы переходите с Discord, посмотрите{" "}
            <Link href="/discord-alternative" className={link}>
              подробное сравнение Mute и Discord
            </Link>
            .
          </p>

          <h2 className={h2}>О чём честно предупредим</h2>
          <p className={p}>
            Mute — молодой проект небольшой команды. Мобильных приложений пока
            нет, на телефоне работает браузерная версия. Публичных серверов и
            каналов тоже нет: Mute рассчитан на созвоны со своим кругом, а не
            на сообщества на сотни человек.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3">
            <ButtonPrimary href={webAppUrl("voice-chat", "bottom")} target="_blank">
              Открыть в браузере
            </ButtonPrimary>
            <ButtonSecondary href="/download">Скачать приложение</ButtonSecondary>
          </div>

          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Полезное по теме:{" "}
            <Link href="/games" className={link}>
              гайды по войсу в конкретных играх
            </Link>
            ,{" "}
            <Link href="/blog/golosovoy-chat-v-brauzere" className={link}>
              как устроен голосовой чат в браузере
            </Link>{" "}
            и{" "}
            <Link href="/blog/kak-pozvonit-druzyam-v-igre-bez-discord" className={link}>
              где созвониться с друзьями в 2026
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
