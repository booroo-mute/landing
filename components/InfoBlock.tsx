export default function InfoBlock() {
  return (
    <section className="w-full pt-16 md:pt-24 lg:!pt-[132px]">
      <div className="container">
        <p className="title-large text-left w-full md:w-[85%] lg:w-[70%]">
          Мы убрали всё, что мешает. Никаких серверов, каналов и бесконечных настроек. Остался только голос и друзья.
        </p>
      </div>
      <div className="mt-16 md:mt-24 lg:mt-[160px] overflow-hidden relative h-[64px] md:h-[80px] lg:h-[96px] flex items-center">
        <div className="marquee flex whitespace-nowrap">
          <div className="flex shrink-0">
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> минимум интерфейса</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> максимум игры</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> стабильный голос</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> приватные звонки</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> минимум интерфейса</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> максимум игры</span>
          </div>
          <div className="flex shrink-0">
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> стабильный голос</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> приватные звонки</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> минимум интерфейса</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> максимум игры</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> стабильный голос</span>
            <span className="title-accent text-text-primary mx-3 md:mx-4 lg:mx-[16px]"><span className="text-[#EF7777]">☼</span> приватные звонки</span>
          </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-[60px] md:w-[100px] lg:w-[160px] bg-gradient-to-r from-background-primary to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-[60px] md:w-[100px] lg:w-[160px] bg-gradient-to-l from-background-primary to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
