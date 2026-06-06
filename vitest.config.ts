import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      reporter: ["text"],
      thresholds: { statements: 80, branches: 60, functions: 80, lines: 80 }
    }
  }
});

