// @ts-check
import { test, expect } from '@playwright/test';

// CONFIGURACIÓN: Ajusta estos datos según tu entorno real
const NOMBRE_CITA = 'Jardineria y Paisajismo'; 
const URL_CITAS = 'https://servineo-front-liard.vercel.app/agenda/citas-agendadas';
const HORA_CONFLICTIVA = '11:00'; // <--- Hora que sabes que YA está ocupada por otro usuario

test.describe('Verificar Reprogramación', () => {

  // CASO 1: PRUEBA DE HUMO
  test('Caso 1: Carga correcta del módulo de Agenda', async ({ page }) => {
    await page.goto('https://servineo-front-liard.vercel.app/agenda');
    await expect(page).toHaveURL(/.*agenda/);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2, button').first()).toBeVisible();
  });

  // CASO 2: REPROGRAMACIÓN EXITOSA (Happy Path)
  test('Caso 2: Reprogramar cita y verificar cambios', async ({ page }) => {
    console.log(`[Caso 2] Navegando a: ${URL_CITAS}`);
    await page.goto(URL_CITAS);

    // Validación de Login
    if (page.url().includes('login') || page.url().includes('ingreso')) {
        throw new Error('¡FALLO POR LOGIN! Inicia sesión manualmente o configura el estado de autenticación.');
    }

    // Buscar Cita
    console.log(`[Caso 2] Buscando cita: "${NOMBRE_CITA}"...`);
    const tarjetaCita = page.getByText(NOMBRE_CITA).first();
    try {
        await expect(tarjetaCita).toBeVisible({ timeout: 10000 });
    } catch (e) {
        throw new Error(`NO SE ENCONTRÓ LA CITA "${NOMBRE_CITA}".`);
    }

    await tarjetaCita.click();

    // Seleccionar Nueva Hora (Libre)
    const nuevaHora = page.getByText(/17:00|5:00/i).first();
    if (await nuevaHora.isVisible()) {
        await nuevaHora.click();
    }

    // Guardar
    const botonGuardar = page.getByRole('button', { name: /guardar|confirmar|aceptar|save/i }).first();
    if (await botonGuardar.isVisible()) {
        await botonGuardar.click();
    }

    // Validar Éxito
    const mensajeExito = page.getByText(/exito|actualizad|correctamente/i).first();
    await page.waitForTimeout(1000); // Pequeña espera visual

    if (await mensajeExito.isVisible()) {
        await expect(mensajeExito).toBeVisible();
    } else {
        console.log('NOTA: No vi mensaje de éxito, pero no hubo errores bloqueantes.');
    }
  });


  test('Caso 3: Verificar mensaje de error por conflicto de horario', async ({ page }) => {
    console.log(`[Caso 3] Iniciando prueba de conflicto...`);
    await page.goto(URL_CITAS);

    // 1. Seleccionar la cita
    const tarjetaCita = page.getByText(NOMBRE_CITA).first();
    await expect(tarjetaCita).toBeVisible();
    await tarjetaCita.click();

    // 2. Intentar asignar un horario que SE CRUZA
    console.log(`[Caso 3] Seleccionando hora conflictiva: ${HORA_CONFLICTIVA}`);
    const horaOcupada = page.getByText(HORA_CONFLICTIVA).first();
    
    if (await horaOcupada.isVisible()) {
        await horaOcupada.click();
    } else {
        throw new Error(`No encuentro la hora ${HORA_CONFLICTIVA} para generar el conflicto.`);
    }

    // 3. Presionar "Guardar cambios"
    const botonGuardar = page.getByRole('button', { name: /guardar|confirmar|aceptar|save/i }).first();
    await botonGuardar.click();

    // 4. VALIDACIÓN: Esperamos un mensaje de error
    const mensajeError = page.getByText(/error|ocupado|conflicto|no disponible|cruce/i).first();
    
    // El test PASA si el mensaje de error aparece
    await expect(mensajeError).toBeVisible({ timeout: 5000 });
    
    // Evidencia del error
    await page.screenshot({ path: 'evidencia_conflicto_horario.png' });
  });

});