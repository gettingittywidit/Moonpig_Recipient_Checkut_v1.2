import { mkdir, copyFile, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");

await mkdir(join(dist, "server", "public"), { recursive: true });
await mkdir(join(dist, ".openai"), { recursive: true });

await copyFile(
  join(root, "outputs", "recipient-checkout-recreation", "index.html"),
  join(dist, "server", "public", "index.html")
);
await cp(
  join(root, "outputs", "recipient-checkout-recreation", "assets"),
  join(dist, "server", "public", "assets"),
  { recursive: true }
);
await copyFile(join(root, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));

await writeFile(
  join(dist, "server", "index.js"),
  `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const asset = path.replace(/^\\//, "");

    if (env.ASSETS && env.ASSETS.fetch) {
      return env.ASSETS.fetch(new URL(asset, url.origin));
    }

    return new Response("Not found", { status: 404 });
  }
};
`
);
