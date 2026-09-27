import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { getAllHelpArticles } from "@/lib/help";
import { itemListSchema, webPageSchema } from "@/lib/schema";

const TITLE = "Помощь по Mute: звук, демонстрация экрана, установка";
const DESCRIPTION =
  "Что делать, если в Mute не работает демонстрация экрана, нет звука или вас не слышно, как установить приложение на Windows и как пригласить друга.";

export const metadata: Metadata = {
  title: `${TITLE} — Mute`,
  description: DESCRIPTION,
  alternates: { canonical: "/help" },
  openGraph: {
    ...OG_SITE,
    title: TITLE,
    description: DESCRIPTION,
    url: "/help",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
};

const link = "text-accent hover:underline";

export default function HelpIndexPage() {
  const articles = getAllHelpArticles();
  const latest = articles
    .map((a) => a.updated ?? a.date)
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "CollectionPage",
          url: `${SITE_URL}/help`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: latest ?? "2026-09-27",
          mainEntity: itemListSchema(
            articles.map((a) => ({ url: `${SITE_URL}/help/${a.slug}`, name: a.title })),
          ),
        })}
      />
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Помощь" }]} />
          <h1 className="title-large mt-6 md:mt-8">Помощь по Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Короткие ответы на то, что чаще всего ломается у пользователей:
            звук, микрофон, показ экрана, установка и приглашения.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col gap-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${article.slug}`}
                className="group p-4 md:p-5 border border-[#1F1F1F] hover:bg-white/5 transition-colors flex items-center justify-between gap-6"
              >
                <div className="flex flex-col">
                  <span className="body-text text-accent">{article.title}</span>
                  <span className="body-text text-text-secondary mt-1">{article.description}</span>
                </div>
                <span className="font-offbit text-2xl group-hover:text-accent transition-colors">→</span>
              </Link>
            ))}
          </div>
          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Не нашли ответ? Напишите в{" "}
            <a href="https://t.me/mute_calls_bot" className={link} target="_blank" rel="noopener noreferrer">
              бот поддержки
            </a>{" "}
            или на{" "}
            <a href="mailto:hello@mute.ac" className={link}>
              hello@mute.ac
            </a>
            . Инструкции по установке с предупреждениями SmartScreen и
            Gatekeeper лежат в разделе{" "}
            <Link href="/install" className={link}>
              «Установка»
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
