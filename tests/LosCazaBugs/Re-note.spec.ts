import { test, expect } from '@playwright/test';

test('Verificar la notificación al crear nueva cita', async ({ page }) => {
    // Definición de horarios disponibles (puede ser necesario si el selector de hora falla)
    const horarios = [
        '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
        '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
    ];

    // --- 1. Navegación Inicial ---
    console.log('Paso 1: Navegación y acceso a Agenda...');
    await page.goto('https://alquiler-front-hot4.onrender.com/');
    await page.getByRole('link', { name: 'Ir Agenda', exact: true }).click();

    // --- 2. Configuración de Request y Fixer ---
    console.log('Paso 2: Configurando Request y Fixer...');
    await page.getByRole('button', { name: '⚙️' }).nth(1).click();
    
    // Rellenar datos de Request
    await page.locator('#input-request-nombre').fill('Fernando');
    await page.locator('#input-request-correo').fill('softcorp.mttp@gmail.com');
    await page.locator('#input-request-numero').fill('59168547805');
    
    // Rellenar datos de Fixer
    await page.locator('#input-fixer-nombre').fill('Fernando');
    await page.locator('#input-fixer-correo').fill('veraf8096@gmail.com');
    await page.locator('#input-fixer-numero').fill('59168547805');
    
    // Función para manejar diálogos (Alerts/Prompts/Confirms)
    const handleDialog = (messageType: string) => page.once('dialog', dialog => {
        console.log(`Dialog message (${messageType}): ${dialog.message()}`);
        // Asumiendo que quieres descartar los diálogos de éxito o advertencia
        dialog.dismiss().catch(() => {}); 
    });

    // Guardar Request
    handleDialog('Guardar Request');
    await page.getByRole('button', { name: 'Guardar Request' }).click();
    
    // Guardar Fixer
    handleDialog('Guardar Fixer');
    await page.getByRole('button', { name: 'Guardar Fixer' }).click();
    
    await page.getByRole('button', { name: 'Close' }).click();
    
    // --- 3. Agendar Cita y Búsqueda Dinámica de Fecha/Hora ---
    console.log('Paso 3: Seleccionando el primer servicio disponible y Agendando...');
    const agendarBtn = page.getByRole('button', { name: 'Agendar Cita' }).first();
    await agendarBtn.click();
    
    console.log('Paso 4: Buscando la primera fecha y hora disponible (Lógica Dinámica)...');
    
    let citaAgendada = false;
    let intentos = 0;
    const maxIntentos = 3; // Límite para avanzar 3 meses

    while (!citaAgendada && intentos < maxIntentos) {
        // Selecciona todos los botones de día que NO están deshabilitados
        const diasDisponibles = page.locator('button[data-day]:not([disabled])');
        const countDias = await diasDisponibles.count();

        for (let i = 0; i < countDias; i++) {
            const diaBtn = diasDisponibles.nth(i);
            
            // Esperar a que el botón sea visible (robustez)
            await diaBtn.waitFor({ state: 'visible', timeout: 5000 });

            try {
                // Click en el día
                await diaBtn.click({ force: true });
            } catch (err) {
                console.log(`⚠️ Botón del día ${i + 1} cambió en el DOM, reintentando el bucle del día...`);
                // Si el click falla, salta al siguiente día o reintenta
                continue; 
            }

            const fecha = await diaBtn.getAttribute('data-day');
            console.log(`  -> Día seleccionado: ${fecha}`);

            // Búsqueda de la primera hora disponible para ese día
            for (const hora of horarios) {
                // Selector que busca el texto de la hora y asegura que NO esté deshabilitado
                const horaBtn = page.locator(`button:has-text("${hora}")`).filter({ hasNot: page.locator(':disabled') });
                
                if ((await horaBtn.count()) > 0) {
                    await horaBtn.first().click({ force: true });
                    console.log(`  -> Hora seleccionada: ${hora}`);
                    citaAgendada = true;
                    break; // Sale del bucle de horas
                }
            }
            if (citaAgendada) break; // Sale del bucle de días
        }

        // Si no se agendó la cita en este mes, intentar ir al siguiente mes
        if (!citaAgendada) {
            const nextMonthBtn = page.getByRole('button', { name: /Next month/i });
            if (await nextMonthBtn.isVisible()) {
                console.log('Avanzando al siguiente mes...');
                await nextMonthBtn.click();
                await page.waitForTimeout(1000); // Esperar que el calendario se recargue
                intentos++;
            } else {
                break; // No hay más meses para avanzar
            }
        }
    }

    if (!citaAgendada) {
        throw new Error('No hay fechas ni horarios disponibles en los próximos meses');
    }

    // Llenar ubicación y notas (Asumiendo que esta parte viene justo después de la selección de hora)
    await page.fill('input[placeholder="Ej: Av. Blanco Galindo 123, Cochabamba"]', 'Av. 6 de agosto');
    await page.fill('input[placeholder="Ej: Edificio azul, piso 2, oficina 3B"]', 'Puerta verde frente a la ferretería Rosales');

    // --- 5. Continuar ---
    console.log('Paso 5: Continuar y Buscar ubicación...');
    
    // Manejar el diálogo que aparece al "Buscar" la dirección
    handleDialog('Buscar Dirección'); 
    await page.locator('form').getByRole('button', { name: 'Buscar' }).click();

    const continuarBtn = page.getByRole('button', { name: 'Continuar' });
    await continuarBtn.click({ force: true });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Espera para asegurar la carga

    // --- 6. Confirmar cita ---
    console.log('Paso 6: Confirmar cita...');
    const confirmarBtn = page.getByRole('button', { name: 'Confirmar Cita' });
    await confirmarBtn.waitFor({ state: 'visible', timeout: 20000 });
    await confirmarBtn.click({ force: true });

    // --- 7. Volver al inicio ---
    console.log('Paso 7: Volver al inicio...');
    const volverBtn = page.getByRole('button', { name: 'Volver al inicio' });
    await volverBtn.waitFor({ state: 'visible', timeout: 15000 });
    await volverBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(6000);
});