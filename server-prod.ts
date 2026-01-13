import fs from "node:fs";
import path from "node:path";
import express from "express";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
  express.static(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist/client"),
    { index: false }
  )
);

app.use("*all", async (req, res, next) => {
  const url = req.originalUrl;

  const { render } = await import("./dist/server/entry-server.js");
  const template = fs.readFileSync(
    path.resolve(__dirname, "./dist/client/index.html"),
    "utf-8"
  );

  const appHtml = render(url);

  const html = template.replace(`<!--ssr-outlet-->`, () => appHtml);

  res.status(200).set({ "Content-Type": "text/html" }).end(html);
});

app.listen(PORT, () => {
  console.log(`🟢🟢 Listening on http://localhost:${PORT} 🟢🟢`);
});
