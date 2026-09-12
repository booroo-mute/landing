import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

interface OgImageOptions {
  title: string;
  /** Подпись раздела над заголовком: «Блог», «Что нового», … */
  kicker: string;
  /** Дата в человекочитаемом виде, необязательна. */
  date?: string;
}

// Satori не читает woff2, поэтому для OG-картинок лежит отдельный TTF
// (Golos Text, OFL) в assets/fonts. OffBit намеренно не используем: у него
// нет статического TTF в репозитории.
function loadFont(file: string): ArrayBuffer {
  const buf = fs.readFileSync(path.join(process.cwd(), "assets/fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/**
 * Единая OG-картинка для статей без собственной графики: тёмный фон бренда,
 * раздел, заголовок, логотип-подпись. Раньше все посты делили одну общую
 * картинку главной, и в Telegram/VK превью были неотличимы друг от друга.
 */
export function renderOgImage({ title, kicker, date }: OgImageOptions) {
  const fontSize = title.length > 90 ? 44 : title.length > 60 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#121212",
          color: "#F3F3F3",
          fontFamily: "Golos Text",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#B5EF77", fontSize: 28, fontWeight: 600 }}>
          <div style={{ width: 16, height: 16, background: "#B5EF77" }} />
          <span>{kicker}</span>
          {date && <span style={{ color: "#848484", fontWeight: 400 }}>· {date}</span>}
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 600, lineHeight: 1.15, letterSpacing: -1 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28, color: "#848484" }}>
          <span style={{ color: "#F3F3F3", fontWeight: 600, fontSize: 36 }}>Mute</span>
          <span>голосовой чат для игр · без VPN · mute.ac</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Golos Text", data: loadFont("GolosText-400.ttf"), weight: 400, style: "normal" },
        { name: "Golos Text", data: loadFont("GolosText-600.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
}
