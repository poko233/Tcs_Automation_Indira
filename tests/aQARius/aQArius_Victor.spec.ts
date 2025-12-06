import { test, expect } from "@playwright/test";

test("Verificar que no deja registrar un certificado con un ID de un digito", async ({
  page,
}) => {
  test.setTimeout(70000);
  await page.goto('https://front-fixer-stories.onrender.com/Homepage');
  await page
    .getByRole("button", { name: "Saltar Tutorial" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole("button", { name: "Saltar Tutorial" }).click();
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
  try {
    await page
      .getByRole("button", { name: "+ Añadir posición" })
      .waitFor({ state: "visible", timeout: 5000 });
  }catch{
    await page.goto('https://front-fixer-stories.onrender.com/fixers/69168e16ba3ccc5772c252e2')
  }
  await page
      .getByRole("button", { name: "+ Añadir posición" })
      .waitFor({ state: "visible", timeout: 5000 });
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

test('Verificar que no deja registrar un certificado con un ID de un digito-R', async ({ page }) => {
  test.setTimeout(70000);
  await page.goto('https://servineo.app/en');
  await page.getByRole('button', { name: 'Close Tour' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('202108297@est.umss.edu');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('pruebaqa123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Kevin Calderon Kevin Calderon' }).click();
  await page.getByRole('button', { name: 'Perfil de Fixer' }).click();
  await page.getByRole('button', { name: 'Certificaciones' }).click();
  await page.getByRole('button', { name: 'Add Certification' }).click();
  await page.getByRole('textbox', { name: 'Ex: Electrical Technician' }).fill('Certificacion 1');
  await page.getByRole('textbox', { name: 'Ex: INFOCAL' }).fill('umss');
  await page.locator('input[name="issueDate"]').click();
  await page.locator('input[name="issueDate"]').fill('2025-12-06');
  //await page.locator('input[name="issueDate"]').fill('06/12/2025');
  await page.getByRole('textbox', { name: 'Optional' }).click();
  await page.getByRole('textbox', { name: 'Optional' }).fill('1');
  await page.getByRole('button', { name: 'Save' }).click();
});

/*
test('Verificar que el boton de Cancelar edicion limpia el formulario de edicion de certificados', async ({ page }) => {
  test.setTimeout(70000);
  await page.goto('https://front-fixer-stories.onrender.com/Homepage');
  await page
    .getByRole("button", { name: "Saltar Tutorial" })
    .waitFor({ state: "visible", timeout: 60000 });
  await page.getByRole("button", { name: "Saltar Tutorial" }).click();
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
  try {
    await page
      .getByRole("button", { name: "+ Añadir posición" })
      .waitFor({ state: "visible", timeout: 5000 });
  }catch{
    await page.goto('https://front-fixer-stories.onrender.com/fixers/69168e16ba3ccc5772c252e2')
  }
  await page
      .getByRole("button", { name: "+ Añadir posición" })
      .waitFor({ state: "visible", timeout: 5000 });
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

import { test, expect } from "@playwright/test";

test("Verificar que el sistema rechace una posición laboral cuya fecha fin es anterior a la fecha de inicio en Work Experience.", async ({ page }) => {
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
  await page.getByRole("button", { name: "+ Añadir posición" }).click();
  await page.getByRole("textbox", { name: "Ej: Carpintero senior," }).click();
  await page
    .getByRole("textbox", { name: "Ej: Carpintero senior," })
    .fill("Desarrollador TypeScript Senior");
  await page.getByRole("combobox").selectOption("Freelance");
  await page.getByRole("textbox", { name: "Empresa o proyecto" }).click();
  await page
    .getByRole("textbox", { name: "Empresa o proyecto" })
    .fill("Jalasoft");
  await page.getByRole("textbox").nth(3).fill("2009-12-25");
  await page.getByRole("textbox").nth(4).fill("2009-12-24");
  await page.getByRole("button", { name: "Guardar posición" }).click();

  const errorMsg = page.getByText("La fecha de fin no puede ser", {
    exact: false,
  }).first();
  await expect(errorMsg).toBeVisible({ timeout: 10000 });

  const fullText = await errorMsg.innerText(); // string

  const errorMsgExtraido = fullText.split("\n")[0].trim(); // si hay saltos de línea
  expect(errorMsgExtraido).toContain("La fecha de fin no puede ser");
});
*/