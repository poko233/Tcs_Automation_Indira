import { test, expect } from "@playwright/test";

/*
test("Verificar que la lista de certificados se adapta si el usuario esta en una pantalla movil", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("https://front-fixer-stories.onrender.com/Homepage");
  const loginBtn = page.locator('header >> a[href="/login"]');
  await loginBtn.click();
  await page.getByRole("textbox", { name: "Correo electrónico" }).click();
  await page
    .getByRole("textbox", { name: "Correo electrónico" })
    .fill("aquariu.s@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).click();
  await page.getByRole("textbox", { name: "Contraseña" }).fill("Vico123@");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page
    .getByRole("button", { name: "Mi perfil Fixer" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole("button", { name: "Mi perfil Fixer" }).click();
  await page.getByRole("button", { name: "Mi perfil Fixer" }).click();
  await page
    .getByRole("button", { name: "+ Añadir posición" })
    .waitFor({ state: "visible", timeout: 60000 });
  //const classDiv= await page.locator('div').filter({ hasText: 'Certificaciones y' }).nth(4).getAttribute('class');
  const classList= await page.locator('div').filter({ hasText: 'Certificaciones y' }).nth(5).getAttribute('class');
  console.log(classList);
  //await page.pause()
  expect(classList).toContain('flex items-center'); // luego aplicar lógica según tu CSS

  //expect(classDiv).toContain('flex items-center justify-between');
});
*/

test("Verificar que no deja registrar un certificado con un ID de un digito", async ({
  page,
}) => {
  test.setTimeout(150000);
  await page.goto('https://front-fixer-stories.onrender.com/Homepage');
  await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
  await page
    .getByRole("textbox", { name: "Correo electrónico" })
    .fill("aquariu.s@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).click();
  await page.getByRole("textbox", { name: "Contraseña" }).fill("Vico123@");
  await page
    .getByRole("button", { name: "Iniciar sesión" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page
    .getByRole("button", { name: "Mi perfil Fixer" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole("button", { name: "Mi perfil Fixer" }).click();
  await page.getByRole("button", { name: "Mi perfil Fixer" }).click();
  await page
    .getByRole("button", { name: "+ Añadir posición" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole('button', { name: '+ Añadir certificación' }).click();
  await page.getByRole('textbox', { name: 'Ej: Certificación en' }).fill('Certificacion 1');
  await page.getByRole('textbox', { name: 'Institución o entidad' }).click();
  await page.getByRole('textbox', { name: 'Institución o entidad' }).fill('Intitucion 1');
  await page.getByRole('textbox').nth(3).fill('2005-10-02');
  await page.getByRole('textbox').nth(4).fill('2027-10-05');
  await page.getByRole('textbox').nth(5).fill('1');
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles(`${__dirname}/ejemplo-certificado.png`);
  await page.getByRole('button', { name: 'Guardar certificación' }).click();
  
  const errorIdMsg = await page.getByText('El campo ID de la credencial').innerText();
  expect(errorIdMsg).toContain('El campo ID de la credencial debe tener al menos 2 caracteres')
});


test('Verificar que el boton de Cancelar edicion limpia el formulario de edicion de certificados', async ({ page }) => {
  test.setTimeout(150000);
  await page.goto('https://front-fixer-stories.onrender.com/Homepage');
  await page
    .getByRole("button", { name: "Iniciar sesion" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole('button', { name: 'Iniciar Sesion' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('aquariu.s@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Vico123@');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page
    .getByRole('button', { name: 'Mi perfil Fixer' })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole('button', { name: 'Mi perfil Fixer' }).click();
  await page.getByRole('button', { name: 'Mi perfil Fixer' }).click();
  await page.getByRole('button', { name: '+ Añadir certificación' }).click();
  const nameCerVoid=await page.getByRole('textbox', { name: 'Ej: Certificación en' });
  const nameInstVoid=await page.getByRole('textbox', { name: 'Institución o entidad' });
  await expect(nameCerVoid).toHaveValue('')
  await expect(nameInstVoid).toHaveValue('')
  await page.getByRole('article').filter({ hasText: 'Certificacion 1' }).getByLabel('Editar certificación').click();
  const nameCer=await page.getByRole('textbox', { name: 'Ej: Certificación en' });
  const nameInst=await page.getByRole('textbox', { name: 'Institución o entidad' });
  await expect(nameCer).not.toHaveValue('')
  await expect(nameInst).not.toHaveValue('')
  await page.getByRole('button', { name: 'Cancelar edición' }).click();
  const nameCerVoid1=await page.getByRole('textbox', { name: 'Ej: Certificación en' });
  const nameInstVoid2=await page.getByRole('textbox', { name: 'Institución o entidad' });
  await expect(nameCerVoid1).toHaveValue('')
  await expect(nameInstVoid2).toHaveValue('')
});