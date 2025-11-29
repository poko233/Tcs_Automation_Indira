import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://front-segundo-sprint.vercel.app/');
  await page.getByRole('link', { name: 'Agregar Disponibilidad' }).click();
  await page.getByText('29').click();
  await page.getByRole('button', { name: 'Atrás' }).click();
});