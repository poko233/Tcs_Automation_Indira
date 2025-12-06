import { test, expect } from '@playwright/test';

// ------ TITULO ---------------------
// Verificar diálogo de confirmación al salir con cambios (TC-100)
// QA a cargo: Yamil Angelo Lara Balderrama

//----DESCRIPCION -------
// El siguiente test case tiene por objeto verificar que el sistema
// detecte cambios sin guardar y muestre un diálogo de confirmación
// al intentar cancelar o salir de la pantalla.

test.use({
  launchOptions: { slowMo: 1000 },
});

test('Verificar diálogo de confirmación al salir con cambios', async ({ page }) => {
  // 1. Navegar a la URL del Worker (Sprint 2)
  await page.goto('https://servineo-front-liard.vercel.app/worker/registrarHorarios');

  // 2. Activar el día Lunes (Hacemos click en el Label para activar el Checkbox)
  await page.locator('label[for="Lunes-enabled"]').click();

  // 3. Realizar una modificación (Introducir hora de inicio) para "ensuciar" el formulario
  // Playwright espera automáticamente a que el input sea editable
  await page.locator('input[type="time"]').first().fill('07:00');

  // 4. Intentar salir presionando "Cancelar"
  await page.getByRole('button', { name: 'Cancelar' }).click();

  // 5. Verificar que aparece el Modal de Confirmación
  const modalHeader = page.getByRole('heading', { name: 'Confirmar Cancelación' });
  await expect(modalHeader).toBeVisible();

  // 6. Confirmar la acción en el modal (Descartar Cambios)
  await page.getByRole('button', { name: 'Sí, Descartar Cambios' }).click();

  // 7. Validar que el modal desapareció o que se redirigió (Opcional, pausa visual)
  await expect(modalHeader).toBeHidden();
  
  // Pausa final para verificar visualmente
  await page.waitForTimeout(2000);
});