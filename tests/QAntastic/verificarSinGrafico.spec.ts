// verificarRefrescar.spec.ts
import { test, expect, type Page } from '@playwright/test';

// Al usar TypeScript, es buena práctica tipar el objeto 'page' en la función del test
// usando 'type Page' de Playwright.

test('E2E: Nuevo Usuario, Navegación y Verificación de Título Anidado', async ({ page }: { page: Page }) => {
    
    // Selectores de flujo (estables)
    // Se puede asignar un tipo 'string' explícito (aunque a menudo es inferido) para claridad.
    const loginFormButtonXPath: string = 'xpath=/html/body/div[3]/main/div/div/form/div[3]/button';
    const loggedInContainer: string = 'xpath=//header//div[3]/div/div'; 
    const graficosButtonXPath: string = 'xpath=/html/body/div[3]/main/div/div/header/div[2]/div[1]/button[1]';
    
    // **Nuevos Selectores**
    // Aunque este selector no se usa en el código, se mantiene el tipado.
    const cerrarButtonXPath: string = 'xpath=/html/body/div[3]/main/div/div/main/div[1]/div/button';
    
    // VERIFICACIÓN FINAL: Elemento que indica que la página ha cargado y es estable
    // Aunque este selector no se usa en la verificación final, se mantiene el tipado.
    const elementoDeCargaFinal: string = 'xpath=/html/body/div[3]/main/div/div[1]/h1/font/font'; 

    // 1) Ingresar al link: https://walletfront-gamma.vercel.app/Homepage
    await test.step('1) Navegar a la página de inicio', async () => {
        await page.goto('https://walletfront-gamma.vercel.app/Homepage');
    });

    // 2) Hacer click en el botón "Iniciar Sesion" (del header)
    await test.step('2) Hacer click en el botón "Iniciar Sesion" (Header)', async () => {
        await page.getByRole('button', { name: 'Iniciar Sesion' }).first().click();
        await page.waitForURL('**/login');
    });
    
    // 3) Ingresar Correo electrónico (aquariu.s@gmail.com)
    await test.step('3) Ingresar Correo electrónico (aquariu.s@gmail.com)', async () => {
        await page.getByPlaceholder('Correo electrónico').fill('aquariu.s@gmail.com');
    });

    // 4) Ingresar Contraseña (Vico123@)
    await test.step('4) Ingresar Contraseña (Vico123@)', async () => {
        await page.getByPlaceholder('Contraseña').fill('Vico123@');
    });
    
    // 5) Hacer click en "Iniciar Sesion" y verificar Login
    await test.step('5) Hacer click en "Iniciar Sesion" y verificar Login', async () => {
        await page.click(loginFormButtonXPath);
        // Usar la función 'toBeVisible' con un 'timeout' es una buena práctica
        await expect(page.locator(loggedInContainer)).toBeVisible({ timeout: 15000 });
        console.log('✅ Login exitoso con nuevo usuario.');
    });
    
    // 6 & 7) Acceder a "Mi billetera"
    await test.step('6 & 7) Acceder a "Mi billetera"', async () => {
        
        await page.locator(loggedInContainer).click(); 
        
        // El elemento 'miBilleteraButton' es de tipo Locator de Playwright, 
        // tipado automáticamente por TypeScript.
        const miBilleteraButton = page.getByRole('button', { name: 'Mi billetera' });
        await miBilleteraButton.waitFor({ state: 'visible' });

        await Promise.all([
            page.waitForURL('**/wallet**'),
            miBilleteraButton.click({ timeout: 10000 })
        ]);
    });

    // 8) Hacer click en la pestaña "Gráficos"
    await test.step('8) Hacer click en la pestaña "Gráficos" 📊', async () => {
        await page.click(graficosButtonXPath);
        await page.waitForLoadState('networkidle'); 
    });
    
    // Notar que la estructura original terminaba con un 'console.log' 
    // y no con una aserción final (expect). Se mantiene la estructura.
    console.log('✅ Grafico no cargado por falta de datos. Automatización completada.');
});