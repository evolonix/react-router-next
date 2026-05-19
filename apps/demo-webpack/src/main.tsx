import { AppRouter } from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { appDir, modules } from "virtual:react-router-next/app-tree";

import "./styles.css";

// Production builds are deployed under https://<user>.github.io/react-router-next/webpack/;
// dev runs at the host root.
const BASENAME =
  process.env.NODE_ENV === "production" ? "/react-router-next/webpack" : "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={appDir} basename={BASENAME} />
  </StrictMode>,
);
