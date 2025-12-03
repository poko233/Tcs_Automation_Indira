import { test, expect } from '@playwright/test';
  
// ------ TITULO ---------------------
// Verificar Restriccion de cancelacion sin seleccion de nuevo horario 
// QA a cargo: Villarroel Balderrama Rocio Mirtha

//----DESCRIPCION -------
// 

  test('Verificar Restriccion de cancelacion sin seleccion de nuevo horario', async ({ page }) => {
    let validationAlertDetected = false;
    let validationAlertMessage = '';
    
    // Manejar los alerts que aparecen
    page.on('dialog', async dialog => {
      const message = dialog.message();
      console.log('Alert detectado:', message);
      
      // Verificar si es el alert de validación que esperamos
      if (message === 'Selecciona fecha y horario') {
        validationAlertDetected = true;
        validationAlertMessage = message;
        console.log('Alert de validación correcto detectado:', message);
      }
      
      await dialog.accept();
    });
    
    await page.goto('https://servineo-front-liard.vercel.app/agenda');
    await page.waitForTimeout(2000);

    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Mis Citas' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Editar Cita' }).nth(2).click();
    await page.waitForTimeout(2000);

    console.log('Modal de editar cita abierto');
    
    // Cambiar el día sin seleccionar horario
    // Verificar si hay días 22 o 23 disponibles para cambiar
    const day22Button = page.locator('[data-day="22/12/2025"] button:not([disabled])');
    const day23Button = page.locator('[data-day="23/12/2025"] button:not([disabled])');
    
    const day22Exists = await day22Button.count() > 0;
    const day23Exists = await day23Button.count() > 0;
    
    if (day22Exists) {
      console.log('Cambiando al día 22 sin seleccionar horario');
      await day22Button.click();
      await page.waitForTimeout(2000);
    } else if (day23Exists) {
      console.log('Cambiando al día 23 sin seleccionar horario');
      await day23Button.click();
      await page.waitForTimeout(2000);
    } else {
      // Fallback: intentar cambiar a cualquier día disponible
      const anyAvailableDay = page.locator('[data-day] button:not([disabled])').first();
      if (await anyAvailableDay.count() > 0) {
        console.log('Cambiando a primer día disponible sin seleccionar horario');
        await anyAvailableDay.click();
        await page.waitForTimeout(2000);
      }
    }
    
    console.log('Día cambiado - Intentando guardar sin seleccionar horario');
    
    // Intentar guardar cambios sin seleccionar horario
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await page.waitForTimeout(2000);
    
    // Verificar que se detectó el alert de validación correcto
    if (validationAlertDetected) {
      console.log('Test exitoso: Alert de validación detectado correctamente');
      console.log('Mensaje del alert:', validationAlertMessage);
      console.log('El sistema valida correctamente que se debe seleccionar fecha y horario');
      
      // Usar expect para hacer una assertion formal del test
      expect(validationAlertMessage).toBe('Selecciona fecha y horario');
      
    } else {
      console.log('Test fallido: No se detectó el alert esperado "Selecciona fecha y horario"');
      
      // Verificar si el modal sigue abierto como indicador de que no se guardó
      const modalStillOpen = await page.locator('[role="dialog"]').count() > 0;
      if (modalStillOpen) {
        console.log('El modal sigue abierto - indica que no se guardaron los cambios');
      }
      
      // Fallar el test si no se detectó el alert esperado
      expect(validationAlertDetected).toBe(true);
    }
    
    // Esperar un poco más para poder observar el resultado
    await page.waitForTimeout(3000);
  });

