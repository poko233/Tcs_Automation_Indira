test('Verificar funcionamiento de la barra de búsqueda', async ({ page }) => {
  await page.goto('https://alquilerfront-two.vercel.app/Homepage');
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[placeholder="Buscar..."]'); // ajusta si es necesario
  const textoPrueba = "Departamento";

  // Ingresar texto
  await searchInput.fill(textoPrueba);

  // Simular presionar Enter si es necesario para filtrar
  await searchInput.press('Enter');

  // Localizar los resultados filtrados
  const resultados = page.locator('.resultado'); // ajusta el selector según tu HTML

  // Verificar que al menos un resultado se muestra
  await expect(resultados.first()).toBeVisible();

  // Opcional: verificar que todos los resultados contienen el texto buscado
  const count = await resultados.count();
  for (let i = 0; i < count; i++) {
    await expect(resultados.nth(i)).toContainText(textoPrueba);
  }

  console.log('La barra de búsqueda filtra los resultados correctamente.');
});
