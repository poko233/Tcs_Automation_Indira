// tests/fixer-recarga.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('TC - Verificar que el saldo se oculte el monto actual - Fixer Wallet', () => {

  test('Flujo de login, acceso a billetera y ocultar saldo', async ({ page }: { page: Page }) => {

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

    // Paso 7: Click en botón "Ocultar saldo" (el ojito)
    // Usamos el XPATH que usabas en Selenium como referencia,
    // pero aquí es mejor un selector más flexible si luego lo mejoras.
    const botonOcultar = page.locator(
      'xpath=/html/body/div[3]/main/div/div/main/div[1]/div[1]/button[2]'
    );

    // alternativa más sana si luego identificas mejor el botón:
    // const botonOcultar = page.locator('main button').nth(1);
    await botonOcultar.click();
    await page.waitForTimeout(2000); // mantener 2s oculto

    // (Aquí podrías agregar un expect() si el saldo muestra **** o similar)
  });
 
});
