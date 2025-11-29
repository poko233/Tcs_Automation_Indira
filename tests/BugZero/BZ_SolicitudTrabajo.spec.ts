import { test, expect } from '@playwright/test';

// ------ TITULO ---------------------
// Verificar envio solicitud de trabajo 
// QA a cargo: .....

//----DESCRIPCION -------
// El siguiente test case tiene por objeto verificar que se permita
// solicitar un trabajo a un FIXER.

test.use({
  launchOptions: { slowMo: 1000 },
});

test('Verificar envio solicitud de trabajo', async ({ page }) => {
  // 1. Navegar a la aplicación (Sprint 2)
  await page.goto('https://front-segundo-sprint.vercel.app/');

  // 2. Ingresar a la sección de agendar servicio
  await page.getByRole('link', { name: 'Agendar tu servicio' }).click();

  // 3. Seleccionar una fecha (Día 29)
  await page.getByText('29').click();

  // 4. Avanzar al siguiente paso del wizard
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();

  // 5. Abrir el formulario de solicitud
  await page.getByRole('button', { name: 'Solicitar Trabajo' }).click();

  // 6. Llenar el formulario de horas
  // Llenar hora de inicio (18:00)
  await page.getByPlaceholder('--:--').first().click();
  await page.getByPlaceholder('--:--').first().fill('18:00');

  // Llenar hora de fin (19:00) - Usamos .nth(1) para el segundo input
  await page.getByPlaceholder('--:--').nth(1).click();
  await page.getByPlaceholder('--:--').nth(1).fill('19:00');

  // 7. Enviar la solicitud
  await page.getByRole('button', { name: 'Enviar Solicitud' }).click();

  // 8. Pausa final para observar que la solicitud se envió (ej. mensaje de éxito)
  await page.waitForTimeout(2000);
});