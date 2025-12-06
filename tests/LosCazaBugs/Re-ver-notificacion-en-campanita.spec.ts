// tests/LosCazaBugs/J-ver-notificacion-en-campanita.spec.js
//Verificar que al agendar cita la notificación en la campanita muestre el detalle.
import { test, expect } from '@playwright/test';

test.setTimeout(300000);

test('TC-HU3-01 - El requester recibe notificación al registrar nueva cita', async ({ page }) => {
  console.log('INICIANDO TEST');

  // --- 1. Abrir app ---
  console.log('Paso 1: Abriendo la aplicación...');
  await page.goto('https://alquiler-front-hot4.onrender.com/');
  await page.waitForLoadState('networkidle');

  const bellExists = await page.locator('#notification-bell-container').isVisible().catch(() => false);
  console.log('¿Existe campanita al inicio? ', bellExists ? 'Sí (error inesperado)' : 'No (esperado en invitado)');

  // --- 2. Ir a agenda ---
  console.log('Paso 2: Haciendo clic en "Ir Agenda"...');
  const btnAgenda = page.locator('#btn-ir-agenda');
  await btnAgenda.click();
  await page.waitForLoadState('networkidle');

  // --- 3. Abrir configuración ---
  console.log('Esperando botón de configuración...');
  const btnConfig = page.getByRole('button', { name: '⚙️' }).first();
  await btnConfig.waitFor({ state: 'visible', timeout: 25000 });
  await btnConfig.click({ force: true });

  // --- 4. Llenar datos del requester ---
  console.log('Esperando formulario del requester...');
  await page.fill('#input-request-nombre', 'Juan Requester');
  await page.fill('#input-request-correo', 'yosoyunclap@gmail.com');
  await page.fill('#input-request-numero', '59163891338');

  await page.click('#btn-guardar-requester');
  await page.waitForTimeout(1500);
  console.log('Requester guardado correctamente');

  // Cerrar modal
  const btnCerrar = page.locator('button[data-slot="dialog-close"]').first();
  await btnCerrar.waitFor({ state: 'visible' });
  await btnCerrar.click();
  await page.waitForTimeout(2000);
  console.log('Modal cerrado correctamente');

  // --- 5. Agendar cita ---
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
  const maxIntentos = 3;

  while (!citaAgendada && intentos < maxIntentos) {
    const diasDisponibles = page.locator('button[data-day]:not([disabled])');
    const countDias = await diasDisponibles.count();

    for (let i = 0; i < countDias; i++) {
      const diaBtn = diasDisponibles.nth(i);
      await diaBtn.waitFor({ state: 'visible', timeout: 5000 });

      try {
        await diaBtn.click({ force: true });
      } catch (err) {
        console.log(`⚠️ Botón del día ${i + 1} cambió en el DOM, reintentando...`);
        continue;
      }

      const fecha = await diaBtn.getAttribute('data-day');
      console.log(`Fecha seleccionada: ${fecha}`);

      for (const hora of horarios) {
        const horaBtn = page.locator(`button:has-text("${hora}")`).filter({ hasNot: page.locator(':disabled') });
        if ((await horaBtn.count()) > 0) {
          await horaBtn.first().click({ force: true });
          console.log(`Hora seleccionada: ${hora}`);
          citaAgendada = true;
          break;
        }
      }
      if (citaAgendada) break;
    }

    if (!citaAgendada) {
      const nextMonthBtn = page.getByRole('button', { name: /Next month/i });
      if (await nextMonthBtn.isVisible()) {
        await nextMonthBtn.click();
        await page.waitForTimeout(1000);
        intentos++;
      } else break;
    }
  }

  if (!citaAgendada) throw new Error('No hay fechas ni horarios disponibles en los próximos meses');

  // Llenar ubicación y notas
  await page.fill('input[placeholder="Ej: Av. Blanco Galindo 123, Cochabamba"]', 'Av. 6 de agosto');
  await page.fill('input[placeholder="Ej: Edificio azul, piso 2, oficina 3B"]', 'Puerta verde frente a la ferretería Rosales');

  // --- 6. Continuar ---
  const continuarBtn = page.getByRole('button', { name: 'Continuar' });
  await continuarBtn.click({ force: true });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(4000);

  // --- 7. Confirmar cita ---
  const confirmarBtn = page.getByRole('button', { name: 'Confirmar Cita' });
  await confirmarBtn.waitFor({ state: 'visible', timeout: 20000 });
  await confirmarBtn.click({ force: true });

  // --- 8. Volver al inicio ---
  const volverBtn = page.getByRole('button', { name: 'Volver al inicio' });
  await volverBtn.waitFor({ state: 'visible', timeout: 15000 });
  await volverBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000);

  // --- 9. Verificación de la campanita ---
  const bellButton = page.locator('button:has(svg.lucide-bell)');
  await bellButton.waitFor({ state: 'visible', timeout: 120000 });
  console.log('Campanita visible');

  const badge = page.locator('div.absolute, span.absolute').filter({ hasText: /^[0-9]+$/ });
  await badge.waitFor({ state: 'visible', timeout: 60000 });
  const numero = await badge.textContent();
  console.log(`¡NOTIFICACIÓN RECIBIDA! Badge muestra: ${(numero ?? '').trim()}`);

  // --- 10. Abrir campanita y capturar la notificación completa ---
  await bellButton.click();
  await page.waitForTimeout(1000);

  let notificacionTexto = null;
  const textoEsperado = 'Nueva cita registrada';
  const maxTime = 20000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxTime) {
    const items = await page.locator('div.relative >> div div').allTextContents();
    const encontrado = items.find(t => t.includes(textoEsperado));
    if (encontrado) {
      notificacionTexto = encontrado;
      break;
    }
    await page.waitForTimeout(500);
  }

  if (!notificacionTexto) {
    throw new Error(`No se encontró la notificación con texto "${textoEsperado}"`);
  }

  console.log('Notificación encontrada:');
  console.log(notificacionTexto);

  console.log('¡TEST COMPLETADO CON ÉXITO!');
});
