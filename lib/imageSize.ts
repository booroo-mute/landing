import fs from "fs";
import path from "path";

export interface ImageSize {
  width: number;
  height: number;
}

const cache = new Map<string, ImageSize | null>();

/**
 * Размер картинки из public/ по заголовку файла (WebP, PNG, JPEG) — без
 * зависимостей и синхронно, чтобы отдавать width/height в <img> из markdown
 * и не ловить сдвиг вёрстки (CLS) при загрузке гайдов.
 */
export function getPublicImageSize(src: string): ImageSize | null {
  if (!src.startsWith("/")) return null;
  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  let size: ImageSize | null = null;
  try {
    const file = path.join(process.cwd(), "public", src.split("?")[0]);
    const buf = fs.readFileSync(file);
    size = parsePng(buf) ?? parseWebp(buf) ?? parseJpeg(buf);
  } catch {
    size = null;
  }
  cache.set(src, size);
  return size;
}

function parsePng(buf: Buffer): ImageSize | null {
  if (buf.length < 24 || buf.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseWebp(buf: Buffer): ImageSize | null {
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    };
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) };
  }
  if (chunk === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  return null;
}

function parseJpeg(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    // SOF0..SOF15, кроме DHT/JPG/DAC
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}
