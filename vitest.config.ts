/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dsv from "@rollup/plugin-dsv";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), dsv()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.ts?(x)"],
    setupFiles: "./test/setup.ts",
  },
});
