import { routeTypegen } from "@evolonix/react-router-next/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/react-router-next/vite/" : "/",
  plugins: [routeTypegen(), react(), tailwindcss()],
}));
