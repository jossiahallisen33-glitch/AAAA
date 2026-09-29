/**
 * 保存课程封面。浏览器把图片读成 data URL，这里拆成 Buffer 写到磁盘。
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { HttpError } from "@/http-error";
import { coversDirectory } from "@/paths";

const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
} as const;

type ImageMime = keyof typeof extensions;

function isImageMime(value: string): value is ImageMime {
  return value in extensions;
}

const maxBytes = 2 * 1024 * 1024;

export async function saveCover(coverData: unknown): Promise<string> {
  if (!coverData) return "";

  if (typeof coverData !== "string") {
    throw new HttpError("封面格式不正确");
  }

  const matched = /^data:(image\/[\w+.-]+);base64,(.+)$/.exec(coverData);
  if (!matched) {
    throw new HttpError("封面必须是图片");
  }

  const mime = matched[1];
  if (!isImageMime(mime)) {
    throw new HttpError("封面只支持 jpg、png、webp、gif、svg");
  }

  const buffer = Buffer.from(matched[2], "base64");
  if (buffer.byteLength > maxBytes) {
    throw new HttpError("封面不能超过 2MB");
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}${extensions[mime]}`;
  await mkdir(coversDirectory, { recursive: true });
  await writeFile(path.join(coversDirectory, filename), buffer);
  return `/uploads/covers/${filename}`;
}
