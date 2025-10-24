import { test, expect } from "playwright/test";

test("add invoice successfully", async ({ page }) => {
    // Intercept API calls
    await page.route("**/api/clients", async (route) => {
        await route.fulfill({
            status: 200,
            body: JSON.stringify([
                { id: "1", name: "John Doe" },
                { id: "2", name: "Jane Smith" },
            ]),
        });
    });

    await page.route("**/api/invoices", async (route) => {
        await route.fulfill({
            status: 201,
            body: JSON.stringify({ message: "Invoice created successfully" }),
        });
    });
    const clientsResponse = page.waitForResponse("**/api/clients");
    await page.goto("/dashboard/invoices/create")
    await clientsResponse;
    await page.fill('input[name="dueDate"]', "2025-12-31");
    await page.getByTestId("client-select").click();
    await page.getByRole('option', { name: 'John Doe' }).click();
    await page.fill('input[placeholder="Name"]', "Website Design");
    await page.fill('input[placeholder="Qty"]', "2");
    await page.fill('input[placeholder="Price"]', "1500");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard\/invoices\/\w+/);
})