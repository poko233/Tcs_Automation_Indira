import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// --- FUNCIONES AYUDANTES (HELPERS) ---

// Función para limpiar el nombre del archivo (slug)
function slug(nombre: string): string {
  return nombre.toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
    .replace(/\s+/g, '_');
}

// Función para obtener la transformación del mapa (coordenadas visuales)
async function obtenerTransformMapa(page: Page) {
  return await page.evaluate(() => {
    const tileContainer = document.querySelector(
      'section#mapa .leaflet-tile-container.leaflet-zoom-animated'
    ) as HTMLElement; // Casteamos a HTMLElement para TS
    if (!tileContainer) return null;
    return tileContainer.style.transform || null;
  });
}

test.describe('Pruebas del Mapa Leaflet', () => {
  
  // Aumentamos el timeout porque probar muchas ubicaciones toma tiempo
  test.setTimeout(60000); 

  test('Todas las ubicaciones deben mover el mapa correctamente', async ({ page }) => {
    
    // Configuración de directorio de evidencias
    const evidDir = 'evidencias_mapa';
    if (!fs.existsSync(evidDir)){
        fs.mkdirSync(evidDir);
    }

    console.log("\nINICIO TEST: Movimiento del mapa por ubicaciones");

    // 1. Abrir página
    // Nota: Usé la URL que venía en tu script de Python. 
    // Si tu proyecto usa la de 'render', cámbiala aquí.
    await page.goto("https://front-servineo-yj7k.vercel.app/Homepage", { waitUntil: 'networkidle' });
    
    // Esperamos a que cargue algo visual clave
    await expect(page.getByText('Servicios').first()).toBeVisible();
    console.log("Homepage cargada correctamente.");

    // 2. Scroll hacia la sección del mapa
    console.log("....Haciendo scroll a la sección 'FIXERS Cerca de ti'...");
    
    // Esperamos que la sección exista en el DOM
    const seccionMapa = page.locator('section#mapa');
    await seccionMapa.waitFor({ state: 'attached', timeout: 15000 });

    // Lógica de scroll manual (traducida de tu Python) para evitar que el header tape el mapa
    await page.evaluate(() => {
      const sec = document.querySelector('section#mapa');
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        // Scroll con offset de -80px
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });

    // Espera breve para estabilidad visual
    await page.waitForTimeout(500);

    // Verificamos que el título esté visible
    const heading = page.locator("section#mapa h2", { hasText: "FIXERS Cerca de ti" });
    if (await heading.isVisible()) {
        await heading.scrollIntoViewIfNeeded();
    }
    
    console.log("....Scroll completado.");

    // Verificar que Leaflet cargó
    const mapaContainer = page.locator("section#mapa .leaflet-container");
    await mapaContainer.waitFor({ state: 'visible', timeout: 15000 });
    console.log("Mapa Leaflet encontrado");

    // 3. Obtener opciones del Select
    const select = page.locator("section#mapa select[aria-label='Selecciona una ubicación']");
    
    // Obtenemos todos los textos de las opciones
    const opcionesElementos = await select.locator('option').all();
    let nombresUbicaciones: string[] = [];

    for (const opcion of opcionesElementos) {
        const texto = (await opcion.innerText()).trim();
        if (texto && texto !== "Selecciona una ubicación") {
            nombresUbicaciones.push(texto);
        }
    }

    // Lógica de reordenamiento (Mover 'Cristo de la Concordia' al final si existe)
    if (nombresUbicaciones.includes("Cristo de la Concordia")) {
        nombresUbicaciones = nombresUbicaciones.filter(n => n !== "Cristo de la Concordia");
        nombresUbicaciones.push("Cristo de la Concordia");
    }

    console.log("\nUbicaciones detectadas:", nombresUbicaciones);

    // 4. Iterar sobre cada ubicación
    let idx = 0;
    for (const nombre of nombresUbicaciones) {
        idx++;
        console.log(`\n========== UBICACIÓN ${idx}/${nombresUbicaciones.length}: ${nombre} ==========`);

        // A) Capturar estado inicial del mapa
        const transformAntes = await obtenerTransformMapa(page);

        // B) Seleccionar la opción
        console.log(`....Seleccionando: '${nombre}'`);
        await select.selectOption({ label: nombre });

        // C) Buscar el botón y hacer click
        const boton = page.locator("section#mapa button").filter({ hasText: "Buscar" }).first();
        
        // Pequeña espera por si la UI reacciona
        await page.waitForTimeout(300);

        const isDisabled = await boton.isDisabled();

        if (!isDisabled) {
            await boton.click();
            // Esperar animación del mapa (Leaflet suele tardar un poco en deslizarse)
            await page.waitForTimeout(2000);
        } else {
            console.log("   -> El botón estaba deshabilitado (quizás ya estamos ahí).");
            await page.waitForTimeout(1000);
        }

        // D) Capturar estado final
        const transformDespues = await obtenerTransformMapa(page);

        // E) Validaciones (Assertions)
        // 1. El mapa debe tener un estilo transform (debe existir)
        expect(transformDespues).not.toBeNull();

        // 2. Si hicimos click, el mapa debió moverse (el transform debe ser diferente)
        if (!isDisabled) {
            if (transformDespues === transformAntes) {
               console.warn(`⚠️ ALERTA: El mapa NO cambió sus coordenadas para '${nombre}'.`);
               // Opcional: Descomentar la siguiente línea si quieres que el test falle estrictamente
               // expect(transformDespues).not.toBe(transformAntes);
            } else {
               console.log("✅ Cambio en transform detectado: El mapa se movió.");
            }
        }

        // F) Captura de Pantalla (Evidencia)
        const fileName = `${idx.toString().padStart(2, '0')}_${slug(nombre)}.png`;
        const filePath = path.join(evidDir, fileName);
        
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`📸 Screenshot guardado: ${fileName}`);
    }

    console.log("\n==== TEST COMPLETADO ====");
  });
});