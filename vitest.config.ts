/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dsv from "@rollup/plugin-dsv";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dsv({
      // @ts-expect-error -- need this to parse number values into numbers to reflect the webpack csv-loader behaviour
      processRow: (row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, value && /^\d+$/.test(value) ? Number(value) : value]),
        ),
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.ts?(x)"],
    setupFiles: "./test/setup.ts",
  },
});
