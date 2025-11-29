import { test, expect } from '@playwright/test';

// ------ TITULO ---------------------
// Verificar edición de horarios FIXER
// QA a cargo: .....

//----DESCRIPCION -------
// El siguiente test case tiene por objeto verificar que se guarden
// los horarios editados en los que trabaja un FIXER.

test.use({
  launchOptions: { slowMo: 1000 },
});

test('Verificar edición de horarios FIXER', async ({ page }) => {
  // 1. Navegar a la aplicación (Sprint 2)
  await page.goto('https://front-segundo-sprint.vercel.app/');

  // 2. Ingresar a la sección de disponibilidad
  await page.getByRole('link', { name: 'Agregar Disponibilidad' }).click();

  // 3. Seleccionar una fecha específica (Día 29)
  // Nota: Si el mes cambia y no tiene día 29, o es una fecha pasada deshabilitada, esto podría fallar.
  await page.getByText('29').click();

  // 4. Hacer clic en el botón de editar (el lápiz)
  // Usamos .first() porque podría haber varios lápices en la pantalla.
  await page.getByRole('button', { name: '✏️' }).first().click();

  // 5. Modificar las horas en los desplegables (combobox)
  // Selecciona las 12:00 en el primer selector
  await page.getByRole('combobox').first().selectOption('12');
  // Selecciona las 13:00 en el tercer selector (índice 2)
  await page.getByRole('combobox').nth(2).selectOption('13');

  // 6. Guardar los cambios
  await page.getByRole('button', { name: 'Aceptar' }).click();

  // 7. Pausa final para verificar visualmente que se guardó
  await page.waitForTimeout(2000);
});