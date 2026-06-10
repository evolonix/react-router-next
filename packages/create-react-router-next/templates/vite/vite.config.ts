import reactRouterNext from "@evolonix/react-router-next/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `reactRouterNext()` scans `src/app/`, serves the route tree as a virtual
// module, and generates per-route types — no extra config required.
export default defineConfig({
  plugins: [reactRouterNext(), react()],
});
