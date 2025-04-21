import { test, expect } from '@playwright/test';

test.describe('Product List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display products list', async ({ page }) => {
    await expect(page.locator('mat-card-title')).toHaveText('Product List');

    await expect(page.locator('tbody tr')).toHaveCount(10);
  });

  test('should filter products by category', async ({ page }) => {
    await page.getByLabel('Beauty').check();

    await expect(page.locator('tbody tr')).toHaveCount(5);
  });

  test('should paginate products', async ({ page }) => {
    await page.getByLabel('Next page').click();

    await expect(
      page.locator('div .mat-mdc-paginator-range-label')
    ).toContainText('11');
  });

  test('should redirect to product detail page when clicking on a product', async ({
    page,
  }) => {
    await page.click('text=Essence Mascara Lash Princess');

    await expect(page).toHaveURL('http://localhost:4200/products/1');
  });
});
