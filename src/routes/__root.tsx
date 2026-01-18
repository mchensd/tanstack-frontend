// Standard root route
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: "TanStack Router SSR Basic File Based Streaming",
      },
      {
        charSet: "UTF-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [
      ...(!import.meta.env.PROD
        ? [
            {
              type: "module",
              children: `import RefreshRuntime from "/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true`,
            },
            {
              type: "module",
              src: "/@vite/client",
            },
          ]
        : []),
      {
        type: "module",
        src: import.meta.env.PROD
          ? "/static/entry-client.js"
          : "/src/entry-client.tsx",
      },
    ],
  }),
  component: () => {
    const [s, ss] = useState(1);
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="p-2 flex gap-2 text-lg">
            <Link
              to="/"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{" "}
            <Link
              to="/about"
              activeProps={{
                className: "font-bold",
              }}
            >
              Posts
            </Link>{" "}
          </div>
          <hr />
          <Outlet /> {/* Start rendering router matches */}
          <Scripts />
        </body>
      </html>
    );
  },
});
