import { test, expect } from "playwright/test";

test("authenticate and save storage state", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('input[name="email"]', "kudiraise@gmail.com");
    await page.fill('input[name="password"]', "KudiRaise@");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard\/overview/);

    await page.context().storageState({ path: "tests/e2e/.auth/user.json" });

    await expect(page.getByText("Welcome back!")).toBeVisible();
});
