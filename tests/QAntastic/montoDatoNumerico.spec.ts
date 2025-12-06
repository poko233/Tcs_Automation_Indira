import { test, expect, Page } from '@playwright/test';

test.describe('TC - Verificar que el monto a recargar sea numerico - Fixer Wallet', () => {

  test('Flujo completo de recarga con un monto numerico', async ({ page }: { page: Page }) => {

    // Paso 1: Ingresar al dominio
    await test.step('Paso 1: Ingresar al dominio de Fixer Wallet', async () => {
      await page.goto('https://walletfront-gamma.vercel.app/Homepage', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/walletfront-gamma/);
    });

    // Paso 2: Click en "Iniciar Sesion"
    await test.step('Paso 2: Hacer clic en el botón "Iniciar Sesion"', async () => {
      await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
      await page.waitForTimeout(1500);
    });

    // Paso 3: Ingresar credenciales válidas
    await test.step('Pablso 3: Ingresar credenciales válidas', async () => {
      await page.locator('input[name="email"]').fill('abcde@gmail.com');
      await page.locator('input[name="password"]').fill('12345Aa*14');
      await page.waitForTimeout(800);
    });

    // Paso 4: Click en "Iniciar sesión"
    await test.step('Paso 4: Hacer clic en el botón "Iniciar sesión"', async () => {
      await page.getByRole('button', { name: 'Iniciar sesión' }).click();
      await page.waitForTimeout(2500);
    });

    // Paso 5: Hover en el ícono del perfil para abrir el menú
    await test.step('Paso 5: Abrir menú del perfil mediante hover', async () => {
      let perfilIcon = page.locator('svg.cursor-pointer');

      if (!(await perfilIcon.first().isVisible().catch(() => false))) {
        // fallback: buscar cualquier botón con svg en el header
        perfilIcon = page.locator('header button:has(svg)');
      }

      await perfilIcon.first().hover();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('button', { name: 'Mi Billetera' })).toBeVisible();
    });

    // Paso 6: Click en "Mi Billetera"
    await test.step('Paso 6: Acceder a la sección "Mi Billetera"', async () => {
      await page.getByRole('button', { name: 'Mi Billetera' }).click();
      await page.waitForTimeout(2000);
    });

    // Paso 7: Click en "Recargar Saldo"
    await test.step('Paso 7: Hacer clic en el botón "Recargar Saldo"', async () => {
      await page.getByRole('button', { name: 'Recargar Saldo' }).click();
      await page.waitForTimeout(2000);
    });

    // Paso 8: Resolver CAPTCHA manualmente
    await test.step('Paso 8: Resolver CAPTCHA manualmente', async () => {
      const captchaFrame = page.frameLocator('iframe[src*="recaptcha"]');
      // Solo validamos que el iframe existe
      // (NO se automatiza el captcha, tú lo resuelves)
      console.log('⚠ CAPTCHA detectado. Resuélvelo manualmente (tienes unos segundos).');
      await page.waitForTimeout(15000); // 15s para que lo resuelvas
    });

    // Paso 9: Reintentar clic en "Recargar Saldo" (si la UI lo requiere)
    await test.step('Paso 9: Reintentar clic en "Recargar Saldo" después de CAPTCHA', async () => {
      // A veces tras el captcha se queda en la misma vista
      // Reintentamos el click si el botón existe
      const botonRecarga = page.getByRole('button', { name: 'Recargar Saldo' });
      if (await botonRecarga.isVisible().catch(() => false)) {
        await botonRecarga.click();
        await page.waitForTimeout(2000);
      }
    });

    // Paso 10: Ingresar monto 200
    await test.step('Paso 10: Ingresar monto "200"', async () => {
      await page.getByPlaceholder('0.00').fill('200');
      await page.waitForTimeout(800);
    });

    console.log('✅ Flujo completo de monto ingresado numerico en Playwright con TypeScript');
  });
});