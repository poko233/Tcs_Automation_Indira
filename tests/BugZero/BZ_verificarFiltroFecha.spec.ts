import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://servineo-front-liard.vercel.app/worker');
  await page.getByRole('link', { name: 'Cancelar citas' }).click();
  await page.getByRole('button', { name: 'Cancelar Varias Citas' }).click();
  await expect(page.getByText('Filtrar por fecha')).toBeVisible();

  await expect(page.locator('input[type="date"]')).toBeVisible();
  await page.locator('input[type="date"]').fill('2026-02-12');
  await expect(page.locator('input[type="date"]')).toHaveValue('2026-02-12');
  await page.pause();
});