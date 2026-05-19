/// <reference types="webpack-env" />
import {
  AppRouter,
  buildModulesFromContext,
} from "@evolonix/react-router-next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

// Webpack's `require.context` analyzer requires a regex *literal* at the call
// site — an imported identifier produces an empty context and the runtime
// would mount with zero routes. So the regex is inlined here. The package's
// `ROUTE_FILE_RE` is the source of truth; keep this regex in sync if a new
// special filename ever lands in `runtime/route-files.ts`.
const APP_DIR = "/src/app";
const modules = buildModulesFromContext(
  require.context(
    "./app",
    true,
    /\/(page|layout|loading|error|default|template|not-found)\.(tsx|jsx|ts|js)$/,
  ),
  APP_DIR,
);

// Production builds are deployed under https://<user>.github.io/react-router-next/webpack/;
// dev runs at the host root.
const BASENAME =
  process.env.NODE_ENV === "production" ? "/react-router-next/webpack" : "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter modules={modules} appDir={APP_DIR} basename={BASENAME} />
  </StrictMode>,
);
