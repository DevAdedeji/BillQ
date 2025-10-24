import { defineConfig } from "playwright/test";

export default defineConfig({
    globalSetup: "./tests/e2e/global-setup",
    globalTeardown: "./tests/e2e/global-teardown",
    testDir: "./tests/e2e",
    use: {
        baseURL: "http://localhost:3000",
        headless: true,
    },
    projects: [
        {
            name: "setup",
            testMatch: /.*\.setup\.ts/,
        },
        {
            name: "e2e",
            dependencies: ["setup"],
            use: {
                storageState: "tests/e2e/.auth/user.json",
            },
        }
    ]
});
