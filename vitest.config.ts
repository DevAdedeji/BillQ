import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "./tests/setupTests",
        globals: true,
        typecheck: {
            tsconfig: "./tsconfig.test.json",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
    },
});
