import { test, expect } from '@playwright/test';

/**
 * Shopping cart E2E tests
 *
 * Covers:
 * - Adding products from the catalog updates the navbar badge
 * - Cart page shows items, updates totals, and supports removal
 */

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('octocat-cart'));
  });

  test('Add a product to the cart and remove it', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1:has-text("Products")')).toBeVisible();
    await expect(page.getByTestId('cart-badge')).toHaveCount(0);

    const firstCard = page.locator('[id^="increase-qty-"]').first();
    await firstCard.click();
    await firstCard.click();
    await page.locator('[id^="add-to-cart-"]').first().click();

    await expect(page.getByTestId('cart-badge')).toHaveText('2');

    await page.click('nav a[href="/cart"]');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
    await expect(page.getByText('Shipping')).toBeVisible();

    await page.getByRole('button', { name: /^Remove .* from cart$/ }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByTestId('cart-badge')).toHaveCount(0);
  });
});
