import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(root, "src/app.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: path.join(root, "dist/app.js"),
  alias: {
    "@": path.join(root, "src"),
  },
});
