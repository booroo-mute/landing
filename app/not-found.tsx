import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-16 md:pt-24 lg:pt-[120px] pb-16 md:pb-24 lg:pb-[120px] text-center">
          <p className="font-offbit text-6xl md:text-7xl lg:text-8xl text-accent">404</p>
          <h1 className="title-large mt-4">Такой страницы нет</h1>
          <p className="title-medium text-text-secondary mt-4">
            Возможно, ссылка устарела или в адресе опечатка.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link href="/" className="body-text text-accent hover:underline">
              На главную
            </Link>
            <Link href="/download" className="body-text text-accent hover:underline">
              Скачать Mute
            </Link>
            <Link href="/discord-alternative" className="body-text text-accent hover:underline">
              Аналог Discord
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
