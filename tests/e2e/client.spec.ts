import { test, expect } from "playwright/test";

test("Add client successfully", async ({ page }) => {
    await page.goto("/dashboard/clients");
    await page.click('button:text("New Client")')
    await page.fill('input[name="name"]', "Adesare Adegbagi");
    await page.fill('input[name="email"]', "adegbagi@gmail.com");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Adesare Adegbagi")).toBeVisible({ timeout: 10000 });
})

test("should edit a client successfully", async ({ page }) => {
    await page.goto("/dashboard/clients");

    await page.click("table tr:first-child button");

    await page.click("text=Edit");

    await page.waitForSelector("text=Edit Client", { timeout: 10000 });

    await page.fill('input[name="name"]', "Updated Client Name");

    await page.click('button[type="submit"]');

    await expect(page.getByText("Updated Client Name")).toBeVisible();
});