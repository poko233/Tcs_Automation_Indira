import { test, expect } from "@playwright/test";

test("Cancelar varias citas y cerrar modal sin confirmar", async ({ page }) => {
  const URL = "https://servineo-front-liard.vercel.app/worker";

  // 1) Entrar a la URL de worker
  await page.goto(URL);
  await page.setViewportSize({ width: 1366, height: 768 });

  // 2) Click en el link del header "Cancelar Varias Citas"
  await page.getByRole("link", { name: "Cancelar Varias Citas" }).click();

  // 3) Intentar hacer click en la pestaña/botón "Cancelar Varias Citas" (si existe)
  try {
    await page.getByRole("button", { name: "Cancelar Varias Citas" }).click();
  } catch {
    // Si no existe como botón o ya está seleccionada, continuamos
  }

  // 4) Seleccionar varias citas (primeros checkboxes)
  const checkboxes = page.locator("input[type='checkbox']");
  const count = await checkboxes.count();

  // Marcar hasta 2 checkboxes si existen
  const limit = Math.min(2, count);
  for (let i = 0; i < limit; i++) {
    const cb = checkboxes.nth(i);
    await cb.scrollIntoViewIfNeeded();
    await cb.check();
  }

  // 5) Botón inferior "Cancelar citas"
  const btnCancelarCitas = page.locator("button:has-text('Cancelar citas')").last();
  await btnCancelarCitas.scrollIntoViewIfNeeded();
  await btnCancelarCitas.click();

  // 6) En el modal, hacer click en el botón de CANCELAR acción (NO aceptar)
  let cancelClicked = false;

  // Opción 1: botón "No, cancelar"
  try {
    await page.getByRole("button", { name: "No, cancelar" }).click();
    cancelClicked = true;
  } catch {}

  // Opción 2: botón "Cancelar"
  if (!cancelClicked) {
    try {
      await page.getByRole("button", { name: "Cancelar" }).click();
      cancelClicked = true;
    } catch {}
  }

  // Opción 3: botón "No"
  if (!cancelClicked) {
    try {
      await page.getByRole("button", { name: "No" }).click();
      cancelClicked = true;
    } catch {}
  }

  // Esperar unos segundos para verificar visualmente
  await page.waitForTimeout(3000);

  // Validación opcional: verificar que NO se muestre el mensaje de éxito
  // (ajusta el texto exacto si cambia)
  await expect(page.locator("text=Se cancelaron")).toHaveCount(0);

});
