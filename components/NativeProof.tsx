import Link from "next/link";

export default function NativeProof() {
  return (
    <section aria-label="Как устроен Mute" className="grid md:grid-cols-3 gap-6 py-8 md:py-12 border-b border-[#1F1F1F]">
      <div>
        <h2 className="title-medium-semibold">Нативный клиент</h2>
        <p className="body-text text-text-secondary mt-3">Приложения для Windows и macOS без Electron и встроенного браузера.</p>
      </div>
      <div>
        <h2 className="title-medium-semibold">Всё для своей компании</h2>
        <p className="body-text text-text-secondary mt-3">Друзья, звонки, чаты и комнаты до 8 человек. Видео и показ экрана — внутри звонка.</p>
      </div>
      <div>
        <h2 className="title-medium-semibold">Позови друга</h2>
        <p className="body-text text-text-secondary mt-3">Зарегистрируйся, отправь другу приглашение и начни звонок. Аккаунт нужен каждому.</p>
        <Link href="/help" className="body-text text-accent hover:underline inline-block mt-3">Помощь с первым звонком →</Link>
      </div>
    </section>
  );
}
