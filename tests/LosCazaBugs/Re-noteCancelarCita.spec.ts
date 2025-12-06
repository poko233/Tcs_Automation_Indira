import { test, expect } from '@playwright/test';

test('Verificar la notificación al crear nueva cita', async ({ page }) => {
 
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
    
    
  await page.getByRole('link', { name: 'Ir Agenda (Fixer)' }).click();
  await page.getByRole('link', { name: '⚠️ Cancelar citas Gestiona' }).click();
  await page.getByRole('button', { name: 'Cancelar Varias Citas' }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Cancelar citas' }).click();
  await page.getByRole('button', { name: 'Sí, continuar' }).click();
  await page.getByRole('button', { name: 'Aceptar' }).click();
});