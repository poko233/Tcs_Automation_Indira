import { test, expect } from '@playwright/test';

test('Verificar que la lista de trabajos tiene conteo de coincidencias de los fixers', async ({ page }) => {
  await page.goto('https://front-fixer-stories.onrender.com/fixers');
  await expect(page.locator('text=Busca Fixers')).toBeVisible();
  await page.waitForTimeout(5000);
  
  const aislamientoCategory = page.locator('button:has-text("Aislamiento")');
  const categoryCountElement = aislamientoCategory.locator('span:nth-child(2)');
  const categoryCountText = await categoryCountElement.textContent();
  const numbers = categoryCountText?.match(/\d+/g);
  const categoryCount = numbers ? parseInt(numbers[0]) : 0;
  console.log(`Fixers registrados en categoría Aislamiento: ${categoryCount} fixers`);

  // Contar tarjetas en la sección de Aislamiento
  const aislamientoSection = page.locator('section:has(h3:has-text("Aislamiento"))');
  const fixerCards = aislamientoSection.locator('div.flex.flex-col.gap-3.rounded-2xl.border.border-slate-200');
  const fixerCardsCount = await fixerCards.count();
  console.log(`Fixers mostrados en sección Aislamiento: ${fixerCardsCount}`);

  // Verificar que coinciden
  expect(categoryCount).toBe(fixerCardsCount);
  console.log('TEST PASÓ: Los números de la categoría Aislamiento coinciden');
});