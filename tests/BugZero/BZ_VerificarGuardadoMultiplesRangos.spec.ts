import { test, expect } from '@playwright/test';

// ------ TITULO ---------------------
// Verificar guardado de múltiples rangos no solapados (TC-94)
// QA a cargo: Yamil Angelo Lara Balderrama

//----DESCRIPCION -------
// El siguiente test case tiene por objeto verificar que un Worker
// pueda agregar múltiples rangos de horarios en un mismo día (ej. mañana y tarde)
// y que el sistema los guarde exitosamente.

test.use({
  launchOptions: { slowMo: 1000 },
});

test('Verificar guardado de múltiples rangos no solapados', async ({ page }) => {
  // 1. Navegar a la URL del Worker
  await page.goto('https://servineo-front-liard.vercel.app/worker/registrarHorarios');

  // 2. Activar el día Lunes
  await page.locator('label[for="Lunes-enabled"]').click();

  // 3. Llenar el Primer Rango (08:00 - 12:00)
  // Usamos .nth(0) para el primer input y .nth(1) para el segundo
  const inputs = page.locator('input[type="time"]');
  await inputs.nth(0).fill('08:00');
  await inputs.nth(1).fill('12:00');

  // 4. Agregar un Segundo Rango
  await page.getByRole('button', { name: '+ Añadir Rango' }).click();

  // 5. Llenar el Segundo Rango (14:00 - 18:00)
  // Playwright espera automáticamente a que los nuevos inputs (índices 2 y 3) aparezcan
  await inputs.nth(2).fill('14:00');
  await inputs.nth(3).fill('18:00');

  // 6. Guardar los Horarios
  await page.getByRole('button', { name: 'Guardar Horarios' }).click();

  // 7. Verificar el Mensaje de Éxito
  // Buscamos el encabezado del modal de éxito
  const successModal = page.getByRole('heading', { name: '¡Horario Guardado Exitosamente!' });
  await expect(successModal).toBeVisible();

  // 8. Pausa final para verificar visualmente que se guardó
  await page.waitForTimeout(2000);
});