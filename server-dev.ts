import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer } from "vite";

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

app.use(vite.middlewares);

app.use("*all", async (req, res, next) => {
  const url = req.originalUrl;
  // if (path.extname(url) !== "") {
  //   console.warn(`${url} is not valid router path`);
  //   res.status(404);
  //   res.end(`${url} is not valid router path`);
  //   return;
  // }
  try {
    // 1. Read index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf-8",
    );

    // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
    //    and also applies HTML transforms from Vite plugins, e.g. global
    //    preambles from @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template);
    const viteHead = template.substring(
      template.indexOf("<head>") + 6,
      template.indexOf("</head>"),
    );
    // 3. Load the server entry. ssrLoadModule automatically transforms
    //    ESM source code to be usable in Node.js! There is no bundling
    //    required, and provides efficient invalidation similar to HMR.
    const { render } = await vite.ssrLoadModule("/src/entry-server.js");

    // 4. render the app HTML. This assumes entry-server.js's exported
    //     `render` function calls appropriate framework SSR APIs,
    //    e.g. ReactDOMServer.renderToString()
    render({ req, res, head: viteHead });
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
