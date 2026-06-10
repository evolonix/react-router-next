import { AppRouter } from "@evolonix/react-router-next/vite-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

// The Vite plugin wires the route tree for you — `<AppRouter />` reads it from a
// virtual module. No `modules`/`appDir` props needed.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
