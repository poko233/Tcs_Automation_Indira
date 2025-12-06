import { test, expect } from "@playwright/test";
import { checkLastEmail } from "./imapTest";

//Esperar selector visible
async function waitForVisible(page: any, selector: string, timeout = 30000) {
  try {
    await page.waitForSelector(selector, {
      state: "visible",
      timeout,
    });
    return page.locator(selector);
  } catch (error) {
    console.error(`❌ No se encontró: ${selector}`);
    await page.screenshot({ path: `debug-${Date.now()}.png`, fullPage: true });
    throw new Error(
      `Timeout: El selector "${selector}" no se hizo visible en ${timeout}ms`
    );
  }
}
 
test("Forzar saldo negativo y verificar correo", async ({ page }) => {
  // ---------------------------------------------------------------------------
  // 1.- Ir a la página principal
  await page.goto("https://alquiler-front-hot4.onrender.com/", { waitUntil: "networkidle" });

   // 3. Ir a Comisión
    console.log("🔘 Haciendo click en 'Ir a Comisión'...");
    await page.click("#btn-ir-comision", { timeout: 10000 });
    await page.waitForTimeout(1000);

    // 4. Esperar input de usuario y rellenarlo
    console.log("⌨️ Rellenando campo de usuario...");
    const inputUsuario = await waitForVisible(page, "#usuario", 20000);
    await inputUsuario.fill("RecodeFixer");
    await inputUsuario.press("Enter");
    console.log("✅ Usuario ingresado: RecodeFixer");

    // 5. Esperar y hacer click en "Mi Billetera"
    console.log("💼 Esperando enlace 'Mi Billetera'...");
    await page.waitForTimeout(2000);

    const walletLink = await page.waitForSelector(
      'a[href*="/bitcrew/wallet?usuario="], a:has-text("Mi Billetera")',
      { state: "visible", timeout: 20000 }
    );

    console.log("✅ Enlace 'Mi Billetera' encontrado, haciendo click...");
    await walletLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

  // 6.- Abrir botón de configuración ⚙️
  const btnConfig = page.getByRole("button", { name: "⚙️" });
  await btnConfig.waitFor({ state: "visible", timeout: 15000 });
  await btnConfig.click();

  // 7.- Llenar datos del fixer
  await page.locator("#input-fixer-nombre").fill("kevin");
  await page.locator("#input-fixer-correo").fill("loscazabugs@gmail.com");
  await page.locator("#input-fixer-numero").fill("59169430107");

  // Guardar Fixer y aceptar diálogo
  page.once("dialog", (dialog) => dialog.dismiss().catch(() => {}));
  await page.getByRole("button", { name: "Guardar Fixer" }).click();

  // 8.- Forzar saldo negativo
  await page.locator("#input-monto").fill("-10");
  page.once("dialog", (dialog) => dialog.dismiss().catch(() => {}));
  await page.getByRole("button", { name: "Recargar" }).click();

  // 9.- Cerrar configuración
  await page.getByRole("button", { name: "Close" }).click();

  // 10.- Espera breve para procesar backend y recibir correo
  console.log("⏳ Esperando correo de saldo negativo...");
  await page.waitForTimeout(5000);

  // ---------------------------------------------------------------------------
  // VERIFICAR CORREO GMAIL VIA IMAP
  await checkLastEmail();
});
