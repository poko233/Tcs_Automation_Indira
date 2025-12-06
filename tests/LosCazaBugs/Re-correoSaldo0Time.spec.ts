import { test, expect } from "@playwright/test";
import Imap from "imap";
import { simpleParser } from "mailparser";

const TEST_EMAIL_PASSWORD="ksqz hynm fahh xskw";
const TEST_EMAIL="loscazabugs@gmail.com";

//Leer correos con timestamp
async function waitForEmailWithTiming(
  email: string,
  password: string,
  subject: string,
  startTimestamp: number,
  maxWaitMs: number = 10000
): Promise<{ 
  subject: string; 
  body: string; 
  receivedAt: number;
  elapsedMs: number;
}> {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: email,
      password: password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    let emailFound = false;

    const timeout = setTimeout(() => {
      if (!emailFound) {
        imap.end();
        const elapsed = Date.now() - startTimestamp;
        reject(new Error(
          `Timeout: No se recibió correo en ${maxWaitMs}ms. ` +
          `Tiempo transcurrido: ${elapsed}ms`
        ));
      }
    }, maxWaitMs);

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
          return;
        }

        // Buscar correos muy recientes
        const searchCriteria = [
          ["SINCE", new Date(startTimestamp - 5000)], // 5 segundos antes
          ["SUBJECT", subject],
        ];

        const checkForEmail = () => {
          imap.search(searchCriteria, (err, results) => {
            if (err) {
              clearTimeout(timeout);
              reject(err);
              return;
            }

            if (results.length > 0) {
              emailFound = true;
              clearTimeout(timeout);

              const fetch = imap.fetch(results[results.length - 1], {
                bodies: "",
                struct: true,
              });

              fetch.on("message", (msg) => {
                msg.on("body", (stream) => {
                  simpleParser(stream as any, (err: any, parsed: any) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    const receivedAt = Date.now();
                    const elapsedMs = receivedAt - startTimestamp;

                    imap.end();
                    resolve({
                      subject: parsed.subject || "",
                      body: parsed.text || parsed.html || "",
                      receivedAt,
                      elapsedMs,
                    });
                  });
                });
              });

              fetch.once("error", reject);
            } else if (Date.now() - startTimestamp < maxWaitMs) {
              // Revisar cada 200ms para mayor precisión
              setTimeout(checkForEmail, 200);
            }
          });
        };

        checkForEmail();
      });
    });

    imap.once("error", (err: Error) => {
      clearTimeout(timeout);
      reject(err);
    });

    imap.connect();
  });
}

//Esperar selector visible
async function waitForVisible(page: any, selector: string, timeout = 50000) {
  try {
    await page.waitForSelector(selector, {
      state: "visible",
      timeout,
    });
    return page.locator(selector);
  } catch (error) {
    console.error(`❌ No se encontró: ${selector}`);
    await page.screenshot({ path: `debug-${Date.now()}.png`, fullPage: true });
    throw new Error(
      `Timeout: El selector "${selector}" no se hizo visible en ${timeout}ms`
    );
  }
}

//TEST 
test.describe("Performance: Tiempo de entrega del correo", () => {
  test.setTimeout(60000); // 60 segundos máximo (aumentado para el test de consistencia)

  test("El correo debe llegar en 5 segundos o menos", async ({ page }) => {
    // 1. Configuración
    const emailPrueba = TEST_EMAIL!;
    const emailPassword = TEST_EMAIL_PASSWORD!;

    if (!emailPrueba || !emailPassword) {
      throw new Error("Faltan TEST_EMAIL y TEST_EMAIL_PASSWORD");
    }

    console.log("📧 Email de prueba:", emailPrueba);
    console.log("⏱️  Requisito: Correo debe llegar en ≤ 5000ms\n");

    // 2. Navegar a la aplicación
    console.log("🌐 Navegando a la aplicación...");
    await page.goto("https://alquiler-front-hot4.onrender.com/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForLoadState("networkidle");

    // 3. Ir a Comisión
    console.log("🔘 Navegando a Comisión...");
    await page.click("#btn-ir-comision", { timeout: 10000 });
    await page.waitForTimeout(1000);

    // 4. Ingresar usuario
    console.log("⌨️  Ingresando usuario...");
    const inputUsuario = await waitForVisible(page, "#usuario", 20000);
    await inputUsuario.fill("RecodeFixer");
    await inputUsuario.press("Enter");
    await page.waitForTimeout(2500);

    // 5. Ir a Mi Billetera
    console.log("💼 Accediendo a billetera...");
    const walletLink = await page.waitForSelector(
      'a[href*="/bitcrew/wallet?usuario="], a:has-text("Mi Billetera")',
      { state: "visible", timeout: 20000 }
    );
    await walletLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // 6. Abrir configuración
    console.log("⚙️  Abriendo configuración...");
    const btnConfig = await waitForVisible(page, "#btn-open-config", 20000);
    await btnConfig.click();
    await page.waitForTimeout(1500);

    // 7. Configurar fixer
    console.log("📝 Configurando fixer...");
    await page.waitForSelector("#input-monto", { state: "visible" });
    await page.fill("#input-monto", "0");
    await page.waitForTimeout(300);
    await page.fill("#input-fixer-nombre", "jafet");
    await page.waitForTimeout(300);
    await page.fill("#input-fixer-correo", emailPrueba);
    await page.waitForTimeout(300);
    await page.fill("#input-fixer-numero", "59164844552");
    await page.waitForTimeout(300);

    console.log("💾 Guardando configuración...");
    await page.click("#btn-guardar-fixer");
    await page.waitForTimeout(2000);

    // 8. ⏱️ INICIAR MEDICIÓN - Recargar wallet
    console.log("\n⏱️  ========== INICIANDO MEDICIÓN ==========");
    console.log("💳 Recargando wallet...");
    
    const startTime = Date.now();
    console.log(`🕐 Timestamp inicio: ${startTime}`);
    
    await page.click("#btn-recargar-wallet");
    
    console.log("📩 Esperando correo (máx 10 segundos)...\n");

    // Esperar sin bloquear para que el correo llegue mientras cerramos modales
    await page.waitForTimeout(1000);

    // 9. Cerrar modal
    const btnCerrarModal = page.locator('[data-slot="dialog-close"]');
    if ((await btnCerrarModal.count()) > 0) {
      await btnCerrarModal.click();
      await page.waitForTimeout(500);
    }

    // 10. Actualizar billetera
    const btnRefresh = page.locator('svg path[d*="M16.023"]');
    if ((await btnRefresh.count()) > 0) {
      await btnRefresh.click();
    }

    // 11. Esperar correo con medición de tiempo
    let email;
    try {
      email = await waitForEmailWithTiming(
        emailPrueba,
        emailPassword,
        "Actualizacion de saldo",
        startTime,
        10000 // Máx 10 segundos de espera
      );
    } catch (error: any) {
      console.error("❌ ERROR:", error.message);
      await page.screenshot({
        path: `error-timeout-${Date.now()}.png`,
        fullPage: true,
      });
      throw error;
    }

    // 12. ⏱️ RESULTADOS DE PERFORMANCE
    const endTime = Date.now();
    const totalTime = email.elapsedMs;

    console.log("\n⏱️  ========== RESULTADOS ==========");
    console.log(`🕐 Timestamp inicio:  ${startTime}`);
    console.log(`🕐 Timestamp llegada: ${email.receivedAt}`);
    console.log(`⏱️  Tiempo total:      ${totalTime}ms`);
    console.log(`✅ Correo recibido en: ${(totalTime / 1000).toFixed(2)}s`);
    console.log("=====================================\n");

    // 13. VALIDACIÓN DE PERFORMANCE
    const maxTimeMs = 5000; // 5 segundos
    
    if (totalTime <= maxTimeMs) {
      console.log(`✅ PERFORMANCE PASS: ${totalTime}ms ≤ ${maxTimeMs}ms`);
    } else {
      console.log(`❌ PERFORMANCE FAIL: ${totalTime}ms > ${maxTimeMs}ms`);
    }

    // Assertion principal de performance
    expect(totalTime).toBeLessThanOrEqual(maxTimeMs);

    // 14. Validaciones del contenido (secundarias)
    const body = email.body;

    console.log("\n📧 Validando contenido del correo...");
    
    expect(body).toMatch(/Hola \*?(kevin|jafet)\*?/i);
    expect(body).toContain("AVISO ACERCA DEL SALDO");
    expect(body).toMatch(/💵\s*\*?Saldo:\*?\s*Bs\.?\s*0\.0?0?/i);
    expect(body).toMatch(/📌\s*\*?Estado:\*?\s*Restringido/i);
    expect(body).toContain("Sistema de Pagos");

    console.log("✅ Contenido validado correctamente");
    console.log("\n🎉 TEST COMPLETADO EXITOSAMENTE");
    console.log(`📊 Resultado: Correo entregado en ${totalTime}ms (Límite: ${maxTimeMs}ms)`);
  });
});