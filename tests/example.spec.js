// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Replace with your app's URL

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Your App Title/); // Replace with your app's expected title
});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Replace with your app's URL

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click(); // Replace with the actual link name in your app

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible(); // Replace with the actual heading name in your app
});
