import { test, expect } from '@playwright/test';

test('Verificar mensaje cuando no hay resultados que coincidan al buscar un fixer', async ({ page }) => {
  // Paso 1: Navegar a la página de fixers
  await page.goto('https://front-fixer-stories.onrender.com/fixers');
  
  // Verificar que se visualiza la página correctamente
  await expect(page.locator('text=Busca Fixers')).toBeVisible();

  // Paso 2: Hacer clic en el botón "Ofertas de Trabajo" en el header
  await page.click('button:has-text("Ofertas de Trabajo")');
  
  // Esperar a que se cargue la página de ofertas
  await page.waitForSelector('text=Ofertas Disponibles');

  // Paso 3: Hacer clic en "Ver fixers por trabajo"
  await page.click('a[href="/fixers"]');
  
  // Esperar a que se cargue la página de fixers
  await page.waitForSelector('text=Busca Fixers');

  // Paso 4: Buscar un fixer que no existe
  const searchInput = page.locator('#search-fixer');
  await searchInput.click();
  await searchInput.fill('aQArius');
  
  // Presionar Enter para realizar la búsqueda
  await searchInput.press('Enter');

  // Esperar a que la búsqueda se complete y aparezca el mensaje
  await page.waitForTimeout(2000); // Espera breve para que se complete la búsqueda

  // Paso 5: Verificar el mensaje de "No encontramos fixers con ese criterio."
  // Usando el selector específico que proporcionaste
  const noResultsMessage = page.locator('body > div.pt-16.sm\\:pt-20 > main > div > div:nth-child(5) > div > div');
  await expect(noResultsMessage).toHaveText('No encontramos fixers con ese criterio.');

  // Verificar que el mensaje tiene los estilos correctos
  await expect(noResultsMessage).toHaveCSS('border-radius', '12px');
  await expect(noResultsMessage).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(noResultsMessage).toHaveCSS('padding', '12px 16px');
  await expect(noResultsMessage).toHaveCSS('font-size', '14px');
  await expect(noResultsMessage).toHaveCSS('color', 'rgb(100, 116, 139)');

  // Verificar que no se muestran tarjetas de fixers
  // Buscar elementos que podrían ser tarjetas de fixers
  const possibleFixerCards = page.locator('[class*="card"], .profile, .fixer-profile, .worker-card');
  await expect(possibleFixerCards).toHaveCount(0);
  
  // Verificación adicional: asegurarnos de que no hay elementos de resultados
  const resultsContainer = page.locator('div:has-text("Cargando...")');
  await expect(resultsContainer).not.toBeVisible();
});