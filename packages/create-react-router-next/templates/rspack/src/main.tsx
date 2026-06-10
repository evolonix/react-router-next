/// <reference types="webpack-env" />
import {
  AppRouter,
  buildModulesFromContext,
} from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

// Rspack's `require.context` analyzer needs a regex *literal* at the call site,
// so it's inlined here. The package's `ROUTE_FILE_RE` is the source of truth —
// keep this in sync if a new special filename is ever added.
const APP_DIR = "/src/app";
const modules = buildModulesFromContext(
  require.context(
    "./app",
    true,
    /\/(page|layout|loading|error|default|template|not-found)\.(tsx|jsx|ts|js)$/,
  ),
  APP_DIR,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={APP_DIR} />
  </StrictMode>,
);
