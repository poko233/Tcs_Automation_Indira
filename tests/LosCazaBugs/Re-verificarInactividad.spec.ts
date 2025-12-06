import { test, expect } from '@playwright/test';
import { checkLastEmail } from "./gmailInactividad";

test('Verificar la recepcion de la notificacion con promociones en gmail', async ({ page }) => {
  // Aumentamos el timeout del test a 2 minutos
  test.setTimeout(120_000);

  // Manejo global de todos los diálogos
  page.on('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });

  // ------------------------------------------------------------
  // NAVEGACIÓN E INTERACCIONES
  await page.goto('https://alquiler-front-hot4.onrender.com/');

  await page.getByRole('link', { name: 'Ir a Comisión' }).click();

  const usuarioInput = page.getByRole('textbox', { name: 'Usuario del Fixer' });

await usuarioInput.click();

// escribir letra por letra con delay
await usuarioInput.type('fixerRecode', { delay: 150 }); 
// delay = milisegundos entre teclas (100–200 es humano real)

await page.getByRole('button', { name: 'Buscar' }).click();

const miBilletera = page.getByText('Mi Billetera', { exact: true });
await expect(miBilletera).toBeVisible({ timeout: 120000 });
await miBilletera.click();
  await page.waitForNavigation();
  await page.getByRole('button', { name: '⚙️' }).click({ timeout: 30000 });

  await page.locator('#select-horario').selectOption('mañana');
  await page.getByRole('button', { name: 'Guardar Horario' }).click();

  await page.locator('#input-request-nombre').fill('kevin');
  await page.locator('#input-request-correo').fill('loscazabugs@gmail.com');
  await page.locator('#input-request-numero').fill('59169430107');
  await page.getByRole('button', { name: 'Guardar Request' }).click();

  await page.locator('#input-dias').fill('4');
  await page.getByRole('button', { name: 'Guardar días' }).click();

  await page.getByRole('button', { name: 'Close' }).click();

  // ------------------------------------------------------------
  // VERIFICAR CORREO GMAIL VIA IMAP
  await checkLastEmail();
});
