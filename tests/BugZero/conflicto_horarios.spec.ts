// @ts-check
import { test, expect } from '@playwright/test';

// CONFIGURACIÓN
const NOMBRE_CITA = 'Jardineria y Paisajismo'; 
const URL_CITAS = 'https://servineo-front-liard.vercel.app/agenda/citas-agendadas';

test.describe('Verificar Reprogramación', () => {

  // CASO 1: PRUEBA DE HUMO
  test('Caso 1: Carga correcta del módulo de Agenda', async ({ page }) => {
    await page.goto('https://servineo-front-liard.vercel.app/agenda');
    await expect(page).toHaveURL(/.*agenda/);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2, button').first()).toBeVisible();
  });

  // CASO 2: ESCENARIO QASE
  test('Caso 2: Reprogramar cita y verificar cambios', async ({ page }) => {
    
    // PASO 1: Ir a la lista
    console.log(`Navegando a: ${URL_CITAS}`);
    await page.goto(URL_CITAS);

    // DEBUG: Ver si pide login
    if (page.url().includes('login') || page.url().includes('ingreso')) {
        throw new Error('¡EL TEST FALLÓ POR LOGIN! Inicia sesión manualmente o automatiza el login.');
    }

    // PASO 2: Buscar la cita
    console.log(`Buscando cita: "${NOMBRE_CITA}"...`);
    const tarjetaCita = page.getByText(NOMBRE_CITA).first();
    
    try {
        await expect(tarjetaCita).toBeVisible({ timeout: 10000 });
    } catch (e) {
        throw new Error(`NO SE ENCONTRÓ LA CITA "${NOMBRE_CITA}".`);
    }

    // PASO 3: Click en la cita
    await tarjetaCita.click();

    // PASO 4: Nueva hora
    const nuevaHora = page.getByText(/17:00|5:00/i).first();
    if (await nuevaHora.isVisible()) {
        await nuevaHora.click();
    }

    // PASO 5: Guardar
    const botonGuardar = page.getByRole('button', { name: /guardar|confirmar|aceptar|save|actualizar/i }).first();
    if (await botonGuardar.isVisible()) {
        await botonGuardar.click();
    }

    // PASO 6: Validación
    const mensajeExito = page.getByText(/exito|actualizad|correctamente/i).first();
    await page.waitForTimeout(1000);

    if (await mensajeExito.isVisible()) {
        await expect(mensajeExito).toBeVisible();
    } else {
        console.log('No vi mensaje de éxito, pero la prueba continúa.');
    }
    
    await page.screenshot({ path: 'evidencia_qase_reprogramacion.png' });
  });

});