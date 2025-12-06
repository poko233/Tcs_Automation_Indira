import { test, expect } from '@playwright/test';

// Define el delay constante para ser usado por AMBAS pruebas
const DELAY_MS = 1000; // 1 segundo de pausa


// =================================================================
// TEST CASE 2: ENVIAR SOLICITUD Y CREAR SERVICIO (Test 2)
// (Usa selectores ID para mayor estabilidad, incluyendo el fix de WebKit)
// =================================================================
test('HU02 - Verificar notificacion de un nuevo servicio (Test 2)', async ({ page }) => {
    
    // --- NAVEGACIÓN ---
    await page.goto('https://alquiler-front-hot4.onrender.com/');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    await page.getByRole('link', { name: 'Ir Agenda', exact: true }).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA

    await page.getByRole('button', { name: '⚙️' }).nth(1).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // --- LLENADO DATOS REQUESTER ---

    // Nombre (Asumo IDs: #input-request-nombre)
    await page.locator('#input-request-nombre').click(); 
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.locator('#input-request-nombre').fill('jose');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.locator('#input-request-nombre').press('Tab');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Email (Asumo IDs: #input-request-correo)
    await page.locator('#input-request-correo').fill('jose.papuso@gmail.com');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.locator('#input-request-correo').press('Tab');
    await page.waitForTimeout(DELAY_MS); // PAUSA
    
    // Teléfono (Asumo IDs: #input-request-numero)
    await page.locator('#input-request-numero').fill('59160701266');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Guardar Request
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Guardar Request' }).click();
    await page.waitForTimeout(DELAY_MS * 2); // PAUSA MÁS LARGA por el envío

    // --- CREAR SERVICIO ---
    
    // Campo de nombre del servicio (Asumo IDs: #input-nombre-servicio)
    await page.locator('#input-nombre-servicio').click(); 
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.locator('#input-nombre-servicio').fill('serv1');
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Crear Servicio
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Crear Servicio' }).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // --- CONFIGURACIÓN DÍAS INACTIVIDAD ---
    
    // Rellenar días (FIX WEBKIT: Usando #input-dias en lugar de getByRole)
    await page.locator('#input-dias').click(); // CAMBIO CLAVE
    await page.waitForTimeout(DELAY_MS); // PAUSA
    await page.locator('#input-dias').fill('2'); // CAMBIO CLAVE
    await page.waitForTimeout(DELAY_MS); // PAUSA

    // Guardar Días
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Guardar días' }).click();
    await page.waitForTimeout(DELAY_MS); // PAUSA final
});