import { DOWNLOAD_CONFIG } from "./downloads";

// Единый источник фактов о продукте для видимых страниц, JSON-LD и llms.txt.
// Правило: здесь только то, что правда для текущей версии приложения.
// Когда факт меняется (вышел push-to-talk, появилась платформа), правится
// одна строка здесь, а не 25 мест по сайту, как было 10.11.2026.
// Проверка scripts/tests/facts.test.mjs ловит противоречащие формулировки
// и захардкоженные номера версий вне lib/.

export const FACTS = {
  /** Дата последней ручной сверки фактов с приложением (ISO). */
  lastReviewed: "2026-11-17",
  price: "бесплатно, без подписок и платных функций",
  roomLimit: 8,
  callTimeLimit: false,
  platforms: {
    windows: true,
    macos: true,
    web: true,
    /** Отдельных приложений в App Store / Google Play / RuStore нет. */
    mobileApps: false,
  },
  /** Где открывается веб-версия на телефоне. */
  webOnPhone: "Safari на iPhone и Chrome на Android",
  registration: {
    fields: "ник, e-mail и пароль",
    phoneRequired: false,
    guestAccess: false,
  },
  pushToTalk: {
    windows: true,
    macos: true,
    web: false,
    /** Как режим называется в настройках звука приложений. */
    label: "Режим рации",
  },
  screenShare: {
    desktop: true,
    web: true,
    systemAudio: true,
    maxQuality: "1080p при 60 кадрах",
  },
  videoCalls: true,
  noiseSuppression: true,
  publicServers: false,
  /** Сквозное шифрование звонков не заявляется. */
  e2eClaimed: false,
  worksInRussiaWithoutVpn: true,
  versions: DOWNLOAD_CONFIG.versions,
  released: DOWNLOAD_CONFIG.released,
} as const;

/** Короткое перечисление возможностей для SoftwareApplication.featureList и llms. */
export const FEATURE_LIST: string[] = [
  "Голосовые звонки 1:1 без лимита времени",
  `Голосовые комнаты до ${FACTS.roomLimit} участников`,
  "Видеозвонки со стилизацией под пиксельный ретро-телефон (отключается)",
  "Демонстрация экрана со звуком, в приложении и в браузере",
  `${FACTS.pushToTalk.label} (push-to-talk) в приложениях для Windows и macOS`,
  "Личные и групповые текстовые чаты",
  "Работает в России без VPN",
  "Веб-версия в браузере без установки, в том числе на телефоне",
];

/** Блок «Факты» для llms.txt и llms-full.txt: одна строка на факт. */
export const FACT_LINES: string[] = [
  `Цена: ${FACTS.price}`,
  "Платформы: Windows, macOS, веб-браузер (WebRTC)",
  `Актуальные версии: Windows ${FACTS.versions.windows}, macOS ${FACTS.versions.macos} (релиз ${FACTS.released}), обе обновляются сами`,
  `Лимит голосовой комнаты: ${FACTS.roomLimit} участников; звонки 1:1 без ограничения по времени`,
  "Видеозвонки: есть; фирменная стилизация под пиксельный ретро-телефон, отключается",
  `Демонстрация экрана: есть, в приложении и в браузере, со звуком системы, до ${FACTS.screenShare.maxQuality}`,
  `Веб-версия на телефоне: работает в ${FACTS.webOnPhone}, отдельных мобильных приложений нет`,
  `Регистрация: ${FACTS.registration.fields}; номер телефона не нужен; гостевого входа без аккаунта нет`,
  `Push-to-talk: есть в приложениях для Windows и macOS («${FACTS.pushToTalk.label}», клавиша или кнопка мыши); в веб-версии нет, там микрофон включается и выключается кнопкой`,
  "Шумоподавление: включено сразу, настраивать не нужно",
  "Работает в России: да, VPN не требуется",
  "Публичных серверов и каналов нет: общение только в своём круге",
  "Сквозное шифрование (E2E) звонков не заявляется",
  `Факты сверены с приложением: ${FACTS.lastReviewed}`,
];

/** Чего в продукте нет: чтобы ответные системы не додумывали. */
export const MISSING_LINES: string[] = [
  "Мобильных приложений в App Store / Google Play / RuStore: на телефоне используется веб-версия в браузере",
  "Гостевого входа: чтобы принять звонок, другу тоже нужен аккаунт (ник, e-mail, пароль; телефон не нужен)",
  "Публичных серверов, каналов, ролей, ботов и случайных собеседников",
  "Push-to-talk в веб-версии: он есть только в приложениях для Windows и macOS",
  "Опубликованных замеров памяти и процессора: заявлять числовое превосходство над другими сервисами нельзя",
];
