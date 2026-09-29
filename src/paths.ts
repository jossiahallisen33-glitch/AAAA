/**
 * 项目里几个固定目录。入口和写封面都从这里取。
 * esbuild 打成 dist/app.js 后，这里仍然是项目根下的 dist，上一级就是项目根。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const publicDirectory = path.join(here, "..", "public");
export const coversDirectory = path.join(publicDirectory, "uploads", "covers");
