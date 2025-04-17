import { test, expect } from '@playwright/test';

test('should redirect to product detail page when clicking on a product', async ({
  page,
}) => {
  await page.route('**/products*', async (route) => {
    route.fulfill({
      status: 200,
    });
  });
  await page.goto('http://localhost:4200/');
  await page.click('text=Essence Mascara Lash Princess');

  await expect(page).toHaveURL('http://localhost:4200/products/1');
});
