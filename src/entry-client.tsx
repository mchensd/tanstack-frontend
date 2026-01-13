import { hydrateRoot } from "react-dom/client";
import { App } from "./App.js";

const root = document.getElementById("app")!;

hydrateRoot(root, <App />);
