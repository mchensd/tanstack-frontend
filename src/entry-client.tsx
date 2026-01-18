import { RouterClient } from "@tanstack/react-router/ssr/client";
import { createRouter } from "./router.js";
import { hydrateRoot } from "react-dom/client";

const router = createRouter();

console.log("hydrating");
hydrateRoot(document, <RouterClient router={router} />);
