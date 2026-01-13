import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer } from "vite";

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

app.use(vite.middlewares);

app.use("*all", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    // 1. Read index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf-8"
    );

    // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
    //    and also applies HTML transforms from Vite plugins, e.g. global
    //    preambles from @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template);

    // 3. Load the server entry. ssrLoadModule automatically transforms
    //    ESM source code to be usable in Node.js! There is no bundling
    //    required, and provides efficient invalidation similar to HMR.
    const { render } = await vite.ssrLoadModule("/src/entry-server.js");

    // 4. render the app HTML. This assumes entry-server.js's exported
    //     `render` function calls appropriate framework SSR APIs,
    //    e.g. ReactDOMServer.renderToString()
    const appHtml = render(url);

    // 5. Inject the app-rendered HTML into the template.
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml);

    // 6. Send the rendered HTML back.
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e: any) {
    // If an error is caught, let Vite fix the stack trace so it maps back
    // to your actual source code.
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(PORT, () => {
  console.log(`🟢🟢 Listening on http://localhost:${PORT} 🟢🟢`);
});
