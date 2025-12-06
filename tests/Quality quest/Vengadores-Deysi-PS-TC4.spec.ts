import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://servineo-delta.vercel.app/Homepage');
  await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('scardavila@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345Sd@');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('link', { name: 'Agendar tu servicio' }).click();
  await page.getByText('28').click();
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page.getByRole('button', { name: 'Solicitar Trabajo' }).click();
  await page.getByRole('button', { name: 'Enviar Solicitud' }).click();
});