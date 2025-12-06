import { test, expect } from '@playwright/test';

const ANIOS_A_PROBAR = [
  { year: 2023, date: new Date('2023-06-15').getTime() },
  { year: 2025, date: new Date('2025-11-27').getTime() },
  { year: 2027, date: new Date('2027-02-01').getTime() }
];

const URL_SITIO = 'https://front-servineo-yj7k.vercel.app/Homepage';
const TEXTO_BASE_FOOTER = 'Servineo. Todos los derechos reservados.';

test.describe('Verificación Dinámica del Año en Footer', () => {

  for (const caso of ANIOS_A_PROBAR) {
    
    test(`Debe mostrar el año ${caso.year}`, async ({ page }) => {
      
      console.log(`🕒 Viajando en el tiempo al año: ${caso.year}`);

      await page.clock.install({ time: caso.date });

      await page.addInitScript((mockTime) => {
         window.localStorage.setItem('cypressMockTime', mockTime.toString());
      }, caso.date);

      await page.goto(URL_SITIO);

      const footerParagraph = page.locator('footer p').filter({ hasText: TEXTO_BASE_FOOTER });
      await expect(footerParagraph).toBeVisible();
      await expect(footerParagraph).toContainText(caso.year.toString());
      
      console.log(`Éxito: El footer muestra el año ${caso.year}`);
    });
  }
});