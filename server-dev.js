import express from "express";
import { createServer } from "vite";

const app = express();
const PORT = 3000;

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
    let template = `<html><head></head><body></body></html>`;

    template = await vite.transformIndexHtml(url, template);
    const viteHead = template.substring(
      template.indexOf("<head>") + 6,
      template.indexOf("</head>"),
    );
    const { render } = await vite.ssrLoadModule("/src/entry-server.js");

    render({ req, res, head: viteHead });
  } catch (e) {
    // If an error is caught, let Vite fix the stack trace so it maps back
    // to your actual source code.
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(PORT, () => {
  console.log(`🟢🟢 Listening on http://localhost:${PORT} 🟢🟢`);
});
