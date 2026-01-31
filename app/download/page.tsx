import Image from "next/image";
import Link from "next/link";
import LinkText from "@/components/LinkText";

export default function DownloadPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-16 lg:py-0 gap-12 lg:gap-24">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[500px]">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Mute"
            width={92}
            height={24}
            className="w-[72px] md:w-[82px] lg:w-[92px] h-auto mb-6 md:mb-8"
          />
        </Link>
        <h1 className="title-large">
          Скачивание начнётся автоматически
        </h1>
        <p className="body-text text-text-secondary mt-4 md:mt-6">
          Если загрузка не началась,{" "}
          <LinkText href="/mute-installer.exe">нажмите сюда</LinkText>
        </p>
      </div>
      <div className="w-full max-w-[600px] lg:max-w-[500px] xl:max-w-[600px]">
        <Image
          src="/hero-image.png"
          alt="Mute app"
          width={600}
          height={400}
          className="w-full h-auto"
        />
      </div>
    </main>
  );
}
