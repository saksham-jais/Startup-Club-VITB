import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import lineClamp from "@tailwindcss/line-clamp"; // ✅ ESM import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss({
      config: {
        content: ["./index.html", "./src/**/*.{js,jsx,tsx}"],
        theme: {
          extend: {},
        },
        plugins: [lineClamp], // ✅ use imported plugin
      },
    }),
    react(),
  ],
});
