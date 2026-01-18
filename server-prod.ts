import path from "node:path";
import express from "express";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 8080;

app.use(
  express.static(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist/client"),
    { index: false },
  ),
);

app.use("*all", async (req, res, next) => {
  const { render } = await import("./dist/server/entry-server.js");
  const viteHead = "";

  render({ req, res, head: viteHead });
});

app.listen(PORT, () => {
  console.log(`🟢🟢 Listening on http://localhost:${PORT} 🟢🟢`);
});
