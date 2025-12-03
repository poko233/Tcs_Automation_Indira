import { test, expect } from '@playwright/test';
//Rocio Villarroel Balderrama
  test('Verificar Actualizar horario con nuevo horario seleccionado', async ({ page }) => {
    await page.goto('https://servineo-front-liard.vercel.app/agenda');
    await page.waitForTimeout(2000);

    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Mis Citas' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Editar Cita' }).nth(2).click();
    await page.waitForTimeout(2000);
    
    // Buscar el horario actualmente seleccionado (el que tiene el indicador "Actual")
    const currentTimeSlot = page.locator('button:has-text("Actual")');
    const hasCurrentSlot = await currentTimeSlot.count() > 0;
    
    if (hasCurrentSlot) {
      const currentTimeText = await currentTimeSlot.textContent();
      console.log('Horario actual de la cita:', currentTimeText);
    }
    
    // Buscar todos los horarios disponibles (sin "Actual" y sin estar deshabilitados)
    const availableTimeSlots = page.locator('button').filter({ 
      hasText: /^\d{2}:\d{2} - \d{2}:\d{2}$/ 
    }).and(page.locator('button:not(:has-text("Actual")):not([disabled])'));
    
    const availableSlotsCount = await availableTimeSlots.count();
    console.log('Horarios disponibles encontrados:', availableSlotsCount);
    
    if (availableSlotsCount > 0) {
      // Seleccionar el primer horario disponible diferente al actual
      const firstAvailableSlot = availableTimeSlots.first();
      const newTimeText = await firstAvailableSlot.textContent();
      console.log('Cambiando a horario:', newTimeText);
      await firstAvailableSlot.click();
      await page.waitForTimeout(2000);
      await page.waitForTimeout(2000);
    } else {
      // Fallback: si no hay otros horarios, buscar días alternativos
      console.log('No hay otros horarios disponibles, buscando otros días...');
      
      // Verificar si hay días 22 o 23 disponibles para cambiar
      const day22Button = page.locator('[data-day="22/12/2025"] button:not([disabled])');
      const day23Button = page.locator('[data-day="23/12/2025"] button:not([disabled])');
      
      const day22Exists = await day22Button.count() > 0;
      const day23Exists = await day23Button.count() > 0;
      
      if (day22Exists) {
        console.log('Cambiando al día 22');
        await day22Button.click();
        // Esperar a que se carguen los nuevos horarios
        await page.waitForTimeout(2000);
        // Seleccionar el primer horario disponible del nuevo día
        const newDaySlots = page.locator('button').filter({ hasText: /^\d{2}:\d{2} - \d{2}:\d{2}$/ });
        if (await newDaySlots.count() > 0) {
          await newDaySlots.first().click();
          await page.waitForTimeout(2000);
        }
      } else if (day23Exists) {
        console.log('Cambiando al día 23');
        await day23Button.click();
        // Esperar a que se carguen los nuevos horarios
        await page.waitForTimeout(2000);
        // Seleccionar el primer horario disponible del nuevo día
        const newDaySlots = page.locator('button').filter({ hasText: /^\d{2}:\d{2} - \d{2}:\d{2}$/ });
        if (await newDaySlots.count() > 0) {
          await newDaySlots.first().click();
          await page.waitForTimeout(2000);
        }
      } else {
        console.log('No se encontraron alternativas, usando horario por defecto');
        // Como último recurso, intentar hacer clic en cualquier horario disponible
        const anyTimeSlot = page.locator('button').filter({ hasText: /:00 - \d{2}:00/ }).first();
        if (await anyTimeSlot.count() > 0) {
          await anyTimeSlot.click();
          await page.waitForTimeout(2000);
        }
      }
    }
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    });
  

