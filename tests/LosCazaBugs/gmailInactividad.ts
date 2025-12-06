import imaps, { ImapSimple } from "imap-simple";
import { simpleParser } from "mailparser";

const IMAP_CONFIG = {
  imap: {
    user: "loscazabugs@gmail.com",
    password: "tpliecaqmzwtooeg",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

// Función que verifica el último correo y devuelve true si contiene el texto esperado
async function checkLastEmail(): Promise<boolean> {
  let connection: ImapSimple | null = null;

  try {
    connection = await imaps.connect(IMAP_CONFIG);
    await connection.openBox("[Gmail]/All Mail");

    // Buscar correos del remitente específico
    const searchCriteria: any[] = [["FROM", "teamrecode1010@gmail.com"]];
    const fetchOptions = { bodies: ["TEXT"], markSeen: false };

    const messages = await connection.search(searchCriteria, fetchOptions);

    if (messages.length === 0) {
      console.log("No se encontraron correos del remitente.");
      return false;
    }

    const lastMsg = messages[messages.length - 1];

    let raw = "";
    for (const part of lastMsg.parts) {
      if (Buffer.isBuffer(part.body)) raw += part.body.toString("utf-8");
      else if (typeof part.body === "string") raw += part.body;
      else if (Array.isArray(part.body)) raw += part.body.map((l: any) => l.line || "").join("\n");
    }

    const parsed = await simpleParser(raw);
    const text = (parsed.text || "").toLowerCase();

    console.log("CUERPO DEL MENSAJE:", text);

    // Nuevo texto esperado
    const expectedText = "nuevas promociones disponibles";
    const expectedLink = "https://alquiler-front-hot4.onrender.com";

    return text.includes(expectedText.toLowerCase()) && text.includes(expectedLink.toLowerCase());
  } finally {
    if (connection) connection.end();
  }
}

// Función auxiliar para esperar a que llegue el correo
export async function waitForEmail(retries = 12, delay = 5000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const found = await checkLastEmail();
    if (found) return true;
    console.log(`⏳ Esperando correo... intento ${i + 1}`);
    await new Promise((r) => setTimeout(r, delay));
  }
  return false;
}

// Ejecutar función si se corre directamente
if (require.main === module) {
  waitForEmail()
    .then((found) => console.log(found ? "✅ Correo de promociones recibido" : "❌ Correo de promociones NO recibido"))
    .catch((err) => console.error(err));
}

export { checkLastEmail };
