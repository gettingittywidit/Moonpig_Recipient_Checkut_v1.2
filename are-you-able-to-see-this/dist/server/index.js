export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const asset = path.replace(/^\//, "");

    if (env.ASSETS && env.ASSETS.fetch) {
      return env.ASSETS.fetch(new URL(asset, url.origin));
    }

    return new Response("Not found", { status: 404 });
  }
};
