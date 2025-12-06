// tests/fixer-recarga.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('TC - Flujo completo de generar codigo QR - Fixer Wallet', () => {

  test('Flujo de login, acceso cobrar por QR', async ({ page }: { page: Page }) => {

    // Paso 1: Ingresar al dominio
    await page.goto('https://walletfront-gamma.vercel.app/Homepage', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/walletfront-gamma/);

    // Paso 2: Click en "Iniciar Sesion"
    await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
    await page.waitForTimeout(1500);

    // Paso 3: Ingresar credenciales válidas
    await page.locator('input[name="email"]').fill('abcde@gmail.com');
    await page.locator('input[name="password"]').fill('12345Aa*14');
    await page.waitForTimeout(500);

    // Paso 4: Click en botón "Iniciar sesión"
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await page.waitForTimeout(2500);

    // Paso 5: Hover sobre icono de perfil (svg.cursor-pointer / alternativas)
    let perfilIcon = page.locator('svg.cursor-pointer').first();

    if (!(await perfilIcon.isVisible().catch(() => false))) {
      // fallback 1: svg dentro de botón
      const svgEnBoton = page.locator('button svg').first();
      if (await svgEnBoton.isVisible().catch(() => false)) {
        perfilIcon = svgEnBoton;
      } else {
        // fallback 2: último svg del header
        const headerSvgs = page.locator('header svg');
        const count = await headerSvgs.count();
        perfilIcon = headerSvgs.nth(count - 1);
      }
    }

    await perfilIcon.hover();
    await page.waitForTimeout(1000);

    // Paso 6: Click en "Mi Billetera"
    await page.getByRole('button', { name: 'Mi Billetera' }).click();
    await page.waitForTimeout(2000);

    // Paso 7: Click en "Cobrar QR"
    await page.getByRole('button', { name: 'Cobrar QR' }).click();
    await page.waitForTimeout(2000);

    // Paso 8: Ingresar Monto a cobrar
    await page.locator('input[placeholder="0.00"]').fill('60');
    await page.waitForTimeout(500);

    // Paso 9: Click en "Generar Codigo QR"
    await page.getByRole('button', { name: 'GENERAR CÓDIGO QR' }).click();
    await page.waitForTimeout(2000);


  });
 
});
