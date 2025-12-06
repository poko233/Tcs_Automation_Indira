import { test, expect } from '@playwright/test';

// Define el delay constante para ser usado por AMBAS pruebas
const DELAY_MS = 1000; // 1 segundo de pausa

test('HU02 - Verificar notificacion de promocines nuevas (Test 1)', async ({ page }) => {

    await page.goto('https://alquiler-front-hot4.onrender.com/booking/agenda');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    await page.getByRole('button', { name: '⚙️' }).nth(1).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // --- Rellenar Datos del Requester ---
    
    // Nombre
    await page.getByRole('textbox').first().click();
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.getByRole('textbox').first().fill('JOSE');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.getByRole('textbox').first().press('Tab');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    
    // Email
    await page.getByRole('textbox').nth(1).fill('jose.papuso@gmail.com');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.getByRole('textbox').nth(1).press('Tab');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Teléfono
    await page.getByRole('textbox').nth(2).fill('59160701266');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Guardar Request
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Guardar Request' }).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // --- Configuración de Días ---
    
    // Se mantiene getByRole aquí, ya que el test 1 navega diferente.
    // Si este test también falla en WebKit, deberás usar el ID #input-dias si lo tienes disponible en esta ruta.
    await page.getByRole('spinbutton').first().click();
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.getByRole('spinbutton').first().fill('2');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Guardar días
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Guardar días' }).click();
    await page.waitForTimeout(DELAY_MS * 2); // PAUSA extendida al final
});

// -----------------------------------------------------------------