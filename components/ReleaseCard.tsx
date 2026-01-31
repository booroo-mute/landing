export default function ReleaseCard() {
  return (
    <div className="w-1/3 border border-[#1F1F1F] p-6 transition-colors hover:bg-white/5 cursor-pointer">
      <p className="body-text text-text-secondary">31 января 2026</p>
      <div className="mt-4">
        <h3 className="title-medium">Обновление 1.2.0</h3>
        <p className="body-text text-text-secondary mt-2">
          Добавлены голосовые сообщения<br />
          Исправлены ошибки авторизации<br />
          Улучшена производительность звонков
        </p>
      </div>
    </div>
  );
}
