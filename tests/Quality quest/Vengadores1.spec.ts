import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://front-segundo-sprint.vercel.app/');
  await page.getByRole('link', { name: 'Mis Trabajos (Vista-Cliente)' }).click();
  await page.getByRole('button', { name: 'Ver Detalles' }).first().click();
  await page.getByRole('button', { name: 'Calificar Proveedor' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Enviar' }).click();
});