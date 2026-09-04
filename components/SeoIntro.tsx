import Link from "next/link";

// Серверный компонент: индексируемый текст с ключевыми формулировками.
// Плотность ключевых фраз держим низкой — текст в первую очередь для людей.
export default function SeoIntro() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px]">
      <div className="container">
        <div className="max-w-[920px] mx-auto">
          <h2 className="title-large text-center">
            Аналог Discord, который работает в России
          </h2>
          <div className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
            <p className="body-text text-text-secondary">
              С тех пор как Discord перестал стабильно открываться в России,
              каждый созвон с друзьями начинается с вопроса «а у тебя VPN
              работает?». Mute избавляет от этого вопроса. Это лёгкий голосовой
              чат, которому VPN и обходные настройки не нужны вовсе.
            </p>
            <p className="body-text text-text-secondary">
              Внутри есть всё, что нужно для игр и общения: звонки один на один
              без ограничений по времени, голосовые комнаты до 8 человек,
              личные сообщения и групповые чаты. Когда голоса мало, можно
              включить камеру или показать свой экран. При этом в Mute нет
              публичных серверов с каналами, ролями и правами, в которых легко
              запутаться. Открываешь список друзей и звонишь.
            </p>
            <p className="body-text text-text-secondary">
              Mute бесплатный, подписок и платных функций в нём нет. Приложение
              есть для Windows и macOS, а ещё Mute открывается прямо в
              браузере, так что созвониться можно даже с телефона или чужого
              компьютера. Интерфейс маленький: в нём нет серверов, каналов
              и магазина, только то, что нужно для созвона.
            </p>
            <p className="body-text text-text-secondary">
              Если вы ищете, чем заменить Discord для созвонов со своей
              компанией, <Link href="/discord-alternative" className="text-accent hover:underline">посмотрите подробное сравнение Mute и Discord</Link>{" "}
              или сразу <Link href="/download" className="text-accent hover:underline">скачайте приложение</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
