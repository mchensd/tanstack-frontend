import { renderToString } from "react-dom/server";
import { App } from "./App.js";
import express from "express";
import {
  createRequestHandler,
  defaultRenderHandler,
  renderRouterToString,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router.js";
import { pipeline } from "node:stream/promises";

export const render = async ({
  req,
  res,
  head,
}: {
  head: string;
  req: express.Request;
  res: express.Response;
}) => {
  const url = new URL(req.originalUrl || req.url, "http://localhost:3000").href;
  console.log(req.originalUrl);
  const request = new Request(url, {
    method: req.method,
    headers: (() => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        headers.set(key, value as any);
      }
      return headers;
    })(),
  });
  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter();

      // Update each router instance with the head info from vite
      router.update({
        context: {
          ...router.options.context,
          head,
        },
      });
      return router;
    },
  });

  const response = await handler(({ responseHeaders, router }) =>
    renderRouterToString({
      responseHeaders,
      router,
      children: <RouterServer router={router} />,
    })
  );

  // Convert the fetch response back to an express response
  res.statusMessage = response.statusText;
  res.status(response.status);

  response.headers.forEach((value, name) => {
    res.setHeader(name, value);
  });

  // Stream the response body
  console.log("return");
  return pipeline(response.body as any, res);
};
