import { test, expect } from "@playwright/test";

test("Cancelar varias citas y confirmar acción", async ({ page }) => {
  const URL = "https://servineo-front-liard.vercel.app/worker";

  // Ajustar tamaño de la ventana
  await page.setViewportSize({ width: 1366, height: 768 });

  // 1) Entrar a la URL de worker
  await page.goto(URL);

  // 2) Click en el link del header "Cancelar Varias Citas"
  await page.getByRole("link", { name: "Cancelar Varias Citas" }).click();

  // 3) Click en la pestaña/botón "Cancelar Varias Citas" (por si no está seleccionada)
  try {
    await page.getByRole("button", { name: "Cancelar Varias Citas" }).click();
  } catch {
    // Si ya está activa o no existe como botón, continuar
  }

  // 4) Seleccionar varias citas (primeros checkboxes)
  const checkboxes = page.locator("input[type='checkbox']");
  const total = await checkboxes.count();

  // Marcar hasta 2 checkboxes si existen
  for (let i = 0; i < Math.min(2, total); i++) {
    const cb = checkboxes.nth(i);
    await cb.scrollIntoViewIfNeeded();
    await cb.check();
  }

  // 5) Botón inferior "Cancelar citas"
  const btnCancelarCitas = page.locator("button:has-text('Cancelar citas')").last();
  await btnCancelarCitas.scrollIntoViewIfNeeded();
  await btnCancelarCitas.click();

  // 6) Modal de confirmación → "Sí, continuar"
  await page.getByRole("button", { name: "Sí, continuar" }).click();

  // Esperar para verificar visualmente
  await page.waitForTimeout(3000);

  // Validación opcional con toast de éxito
  // Ajusta el texto exacto si cambia el mensaje final
  // Ejemplo: "Se cancelaron X citas con éxito"
  await expect(page.locator("text=Se cancelaron")).toHaveCount(1);
});
