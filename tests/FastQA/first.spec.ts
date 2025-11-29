import { test, expect } from '@playwright/test';

test('Validar que la barra de búsqueda permite ingresar texto', async ({ page }) => {
  // Navegar a la página Home
  await page.goto('https://alquilerfront-two.vercel.app/Homepage');
  await page.waitForTimeout(3000);

  // Localizar la barra de búsqueda
  const searchInput = page.locator('input[placeholder="Buscar..."]'); // ajusta el selector si es otro

  // Verificar que la barra sea visible
  await expect(searchInput).toBeVisible();

  // Ingresar texto de prueba
  const textoPrueba = "Departamento";
  await searchInput.fill(textoPrueba);

  // Verificar que el texto se ingresó correctamente
  await expect(searchInput).toHaveValue(textoPrueba);

  console.log('Se puede ingresar texto en la barra de búsqueda.');
});
