import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://servineo-delta.vercel.app/Homepage');
  await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('hector@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345Hc@');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('link', { name: 'Trabajos Agendados (Vista-' }).click();
  await page.getByRole('button', { name: 'Terminados (8)' }).click();
  await page.getByRole('button', { name: 'Ver Detalles' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Ver mi calificación' }).click();
});