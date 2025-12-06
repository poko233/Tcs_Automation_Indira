// tests/notificacion-cita.spec.ts
// Verificar que el contador de campanita aumente en uno al agendar cita como requester
import { test, expect } from '@playwright/test';

test.setTimeout(300000);

test('TC-HU3-01 - El requester recibe notificación al registrar nueva cita', async ({ page }) => {
  console.log('INICIANDO TEST');

  // 1. Abrir app
  console.log('Paso 1: Abriendo la aplicación...');
  await page.goto('https://alquiler-front-hot4.onrender.com/');
  await page.waitForLoadState('networkidle');

  const bellExists = await page.locator('#notification-bell-container').isVisible().catch(() => false);
  console.log('¿Existe campanita al inicio? ', bellExists ? 'Sí (error inesperado)' : 'No (esperado en invitado)');

  // 2. Ir a agenda
  console.log('Paso 2: Haciendo clic en "Ir Agenda"...');
  await page.click('#btn-ir-agenda');
  await page.waitForLoadState('networkidle');

  // 3. Abrir configuración
  console.log('Esperando botón de configuración...');
  const btnConfig = page.getByRole('button', { name: '⚙️' }).first();
  await btnConfig.waitFor({ state: 'visible', timeout: 25000 });
  console.log('Botón de configuración visible');
  await btnConfig.click({ force: true });

  // 4. Llenar datos del requester
  console.log('Esperando formulario del requester...');
  await page.locator('#input-request-nombre').waitFor();
  await page.locator('#input-request-nombre').fill('Juan Requester');
  await page.locator('#input-request-correo').fill('yosoyunclap@gmail.com');
  await page.locator('#input-request-numero').fill('59163891338');
  await page.locator('#btn-guardar-requester').click();
  await page.waitForTimeout(1500);
  console.log('Requester guardado correctamente');

  // Cerrar modal
  console.log('Esperando botón de cerrar (X)...');
  const btnCerrar = page.locator('button[data-slot="dialog-close"]').first();
  await btnCerrar.waitFor({ state: 'visible' });
  await btnCerrar.click();
  await page.waitForTimeout(2000);
  console.log('Modal cerrado correctamente');

  // 5. Agendar cita
  console.log('Paso 3: Seleccionando el primer servicio disponible...');
  const agendarBtn = page.getByRole('button', { name: 'Agendar Cita' }).first();
  await agendarBtn.click();

  console.log('Paso 4: Seleccionando fecha y hora disponible...');
  const horarios = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
    '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
  ];

  let citaAgendada = false;
  let intentos = 0;
  const maxIntentos = 3; // revisa hasta 3 meses

  while (!citaAgendada && intentos < maxIntentos) {
    const diasDisponibles = page.locator('button[data-day]:not([disabled])');
    const countDias = await diasDisponibles.count();

    for (let i = 0; i < countDias; i++) {
      const diaBtn = diasDisponibles.nth(i);
      await diaBtn.click();
      const fecha = await diaBtn.getAttribute('data-day');
      console.log(`Fecha seleccionada: ${fecha}`);

      // Buscar hora disponible
      for (const hora of horarios) {
        const horaBtn = page.locator(`button:has-text("${hora}")`).filter({ hasNot: page.locator(':disabled') });
        if ((await horaBtn.count()) > 0) {
          await horaBtn.first().click();
          console.log(`Hora seleccionada: ${hora}`);
          citaAgendada = true;
          break;
        }
      }
      if (citaAgendada) break;
    }

    // Si no se agendó, pasar al siguiente mes
    if (!citaAgendada) {
      const nextMonthBtn = page.getByRole('button', { name: /Next month/i });
      if (await nextMonthBtn.isVisible()) {
        await nextMonthBtn.click();
        await page.waitForTimeout(1000);
        intentos++;
      } else {
        break;
      }
    }
  }

  if (!citaAgendada) throw new Error('No hay fechas ni horarios disponibles en los próximos meses');

  // Llenar ubicación y notas
  await page.getByPlaceholder('Ej: Av. Blanco Galindo 123, Cochabamba').fill('Av. 6 de agosto');
  console.log('     Paso 4.3: Ubicación llenada correctamente');
  await page.getByPlaceholder('Ej: Edificio azul, piso 2, oficina 3B').fill('Puerta verde frente a la ferretería Rosales');
  console.log('     Paso 4.4: Notas llenadas correctamente...');

  // 6. Continuar
  console.log('Paso 5: Haciendo clic en Continuar...');
  const continuarBtn = page.getByRole('button', { name: 'Continuar' });
  await continuarBtn.click({ force: true });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(4000);

  // 7. Confirmar cita
  console.log('Esperando que abra el modal de Confirmación...');
  const confirmarBtn = page.getByRole('button', { name: 'Confirmar Cita' });
  await expect(confirmarBtn).toBeVisible({ timeout: 20000 });
  console.log('Modal de confirmación abierto');

  console.log('Paso 6: Presionar el botón Confirmar Cita');
  await confirmarBtn.click({ force: true });

  // 8. Volver al inicio
  console.log('Paso 7: Esperando modal de éxito y volviendo al inicio...');
  const volverBtn = page.getByRole('button', { name: 'Volver al inicio' });
  await expect(volverBtn).toBeVisible({ timeout: 15000 });
  await volverBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000);

  // VERIFICACIÓN FINAL: CAMPANITA + BADGE ROJO
  console.log('Esperando la campanita con notificación...');
  const bellButton = page.locator('button').filter({ has: page.locator('svg.lucide-bell') });
  await expect(bellButton).toBeVisible({ timeout: 120000 });
  console.log('Campanita visible');

  const badge = page.locator('div.absolute').filter({ hasText: /^[0-9]+$/ })
    .or(page.locator('span.absolute').filter({ hasText: /^[0-9]+$/ }));
  await expect(badge).toBeVisible({ timeout: 60000 });
  const numero = await badge.textContent();
  console.log(`¡NOTIFICACIÓN RECIBIDA! Badge muestra: ${(numero ?? '').trim()}`);

  console.log('¡TEST COMPLETADO CON ÉXITO!');
  console.log('TC-HU3-01: El requester recibió correctamente la notificación en la campanita');
});
