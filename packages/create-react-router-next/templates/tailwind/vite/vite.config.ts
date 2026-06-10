import reactRouterNext from "@evolonix/react-router-next/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `reactRouterNext()` scans `src/app/`, serves the route tree as a virtual
// module, and generates per-route types. `tailwindcss()` is the official
// Tailwind v4 Vite plugin — no PostCSS config needed.
export default defineConfig({
  plugins: [reactRouterNext(), react(), tailwindcss()],
});
