import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://front-segundo-sprint.vercel.app/');
  await page.getByRole('link', { name: 'Perfil del proveedor' }).click();
  await page.getByRole('button', { name: 'Ir a Calificaciones del' }).click();
  await page.getByRole('button', { name: 'Comentarios Positivos' }).click();
  await page.getByRole('button', { name: 'Comentarios Negativos' }).click();
  await page.getByRole('button', { name: 'Ordenados por fecha' }).click();
  await page.getByRole('button', { name: 'Ordenados por calificación' }).click();
  await page.getByRole('button', { name: 'Todos' }).click();
});