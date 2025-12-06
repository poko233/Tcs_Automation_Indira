import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://servineo-delta.vercel.app/Homepage');
  await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('scardavila@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345Sd@');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('link', { name: 'Agendar tu servicio' }).click();
  await page.getByText('28').click();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page.getByRole('button', { name: 'Solicitar Trabajo' }).click();
  await page.getByPlaceholder('--:--').first().click();
  await page.getByPlaceholder('--:--').first().fill('19:00');
  await page.getByPlaceholder('--:--').nth(1).click();
  await page.getByPlaceholder('--:--').nth(1).fill('18:00');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('as');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('5');
  await page.locator('form input[type="text"]').click();
  await page.locator('form input[type="text"]').fill('asd');
  await page.getByRole('button', { name: 'Enviar Solicitud' }).click();
});