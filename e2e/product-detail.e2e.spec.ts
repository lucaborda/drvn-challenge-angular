import { test, expect } from '@playwright/test';
import { mockProduct } from './helpers/constants';

test.describe('Product Detail Page - Mocked API', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/products/*', async (route) => {
      if (route.request().url().includes('dummyjson.com/products')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProduct),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/products/1', { waitUntil: 'networkidle' });

    await page.waitForSelector('mat-card');
  });

  test('should display mocked product data', async ({ page }) => {
    await expect(page.locator('mat-card-title')).toHaveText(mockProduct.title);

    await expect(page.locator('mat-card-subtitle')).toContainText(
      mockProduct.brand
    );
  });

  test('should show edit form', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    await expect(page.locator('input[formControlName="title"]')).toHaveValue(
      ''
    );
    await expect(
      page.locator('textarea[formControlName="description"]')
    ).toHaveValue('');
  });

  test('should mock save operation', async ({ page }) => {
    await page.route('**/products/*', async (route) => {
      const request = route.request();
      const postData = request.postData();

      if (request.method() === 'PUT') {
        const updatedProduct = {
          ...mockProduct,
          ...(postData ? JSON.parse(postData) : {}),
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedProduct),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProduct),
        });
      }
    });

    await page.getByRole('button', { name: /edit/i }).click();
    await page
      .locator('input[formControlName="title"]')
      .fill('Product updated');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText('Close')).toBeVisible();
  });
});
