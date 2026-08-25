// Configuración de la hoja de cálculo y API Key
const TIMEZONE = "Europe/Madrid";
const GEMINI_API_KEY = "PESTA_AQUI_TU_NUEVA_CLAVE_GEMINI";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsExist(ss);

  const action = e.parameter.action;
  if (action === "getData") {
    return createJsonResponse({
      status: "success",
      records: parseSheetData(ss.getSheetByName("Registros")),
      growth: parseSheetData(ss.getSheetByName("Desarrollo")),
      teeth: parseSheetData(ss.getSheetByName("Dientes")),
      allergens: parseSheetData(ss.getSheetByName("Alergenos"))
    });
  }
  return createJsonResponse({ status: "running", message: "API Leandro App v7.0 Activa" });
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist(ss);
    
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const data = contents.data;

    // CONSULTA A IA PEDIÁTRICA (GEMINI API)
    if (action === "askGemini") {
      const replyText = callGeminiAPI(data.prompt, data.babyContext);
      return createJsonResponse({ status: "success", reply: replyText });
    }

    // SINCRONIZACIÓN GENERAL
    if (action === "sync") {
      const sheetReg = ss.getSheetByName("Registros");
      const sheetGrow = ss.getSheetByName("Desarrollo");
      const sheetTeeth = ss.getSheetByName("Dientes");
      const sheetAllergens = ss.getSheetByName("Alergenos");
      
      // 1. PROCESAR BORRADOS
      if (data.deletedIds && data.deletedIds.length > 0) {
        const delSet = new Set(data.deletedIds);
        [sheetReg, sheetGrow, sheetTeeth, sheetAllergens].forEach(sheet => {
          if (!sheet) return;
          const rows = sheet.getDataRange().getValues();
          for (let i = rows.length - 1; i >= 1; i--) {
            if (delSet.has(String(rows[i][0]))) {
              sheet.deleteRow(i + 1);
            }
          }
        });
      }

      // 2. REGISTROS (Deduplicación por UUID)
      if(data.records && data.records.length > 0) {
        const existingIds = new Set(parseSheetData(sheetReg).map(r => String(r.id)));
        data.records.forEach(r => {
          if(!existingIds.has(String(r.id))) {
            sheetReg.appendRow([r.id, r.timestamp, r.categoria, r.subtipo, r.valor, r.unidad, r.fechaInicio, r.fechaFin, r.notas || ""]);
            existingIds.add(String(r.id));
          }
        });
      }
      
      // 3. DESARROLLO
      if(data.growth && data.growth.length > 0) {
         const existingGrowthIds = new Set(parseSheetData(sheetGrow).map(g => String(g.id)));
         data.growth.forEach(g => {
           if(!existingGrowthIds.has(String(g.id))) {
             sheetGrow.appendRow([g.id, g.timestamp, g.fecha, g.peso, g.talla, g.perimetro]);
             existingGrowthIds.add(String(g.id));
           }
         });
      }
      
      // 4. DENTICIÓN
      if(data.teeth && data.teeth.length > 0) {
         const existingTeethIds = new Set(parseSheetData(sheetTeeth).map(t => String(t.id)));
         data.teeth.forEach(t => {
           if(!existingTeethIds.has(String(t.id))) {
             sheetTeeth.appendRow([t.id, t.timestamp, t.tooth, t.erupted, t.fecha]);
             existingTeethIds.add(String(t.id));
           }
         });
      }

      // 5. ALÉRGENOS
      if(data.allergens && data.allergens.length > 0) {
         const existingAllergenIds = new Set(parseSheetData(sheetAllergens).map(a => String(a.id)));
         data.allergens.forEach(a => {
           if(!existingAllergenIds.has(String(a.id))) {
             sheetAllergens.appendRow([a.id, a.timestamp, a.allergenKey, a.status, a.dayCount, a.notes || "", a.fecha]);
             existingAllergenIds.add(String(a.id));
           }
         });
      }
      
      return createJsonResponse({ status: "success" });
    }
    
    return createJsonResponse({ status: "error", message: "Acción no reconocida" });

  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function callGeminiAPI(promptText, babyContext) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("PESTA_AQUI")) {
    return "⚠️ Configura tu API Key de Gemini en Code.gs para activar el Asistente Pediátrico.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = `Eres "Pediatra-IA", consultor de alto nivel en salud infantil, BLW y sueño de Leandro App. Tu conocimiento se basa en OMS, AEP y ESPGHAN.

CONTEXTO ACTUAL DE LEANDRO:
- Edad: ${babyContext.ageMonths || 0} meses
- Alérgenos introducidos: ${babyContext.allergensOk || "Ninguno aún"}
- Alérgenos con reacción: ${babyContext.allergensNok || "Ninguno"}

PROTOCOLOS ESTRICTOS:
1. BANDERAS ROJAS (Urgencia): Si hay síntomas graves (dificultad respiratoria, convulsiones, anafilaxia, letargia, fiebre en <3m), responde INMEDIATAMENTE: "🚨 AVISO DE EMERGENCIA: Llama al 112 o acude a Urgencias de inmediato." y da pautas de triaje.
2. ALIMENTACIÓN SEGURA: Prohibidos Miel (<12m), frutos secos enteros, uvas/cherrys enteros, manzana/zanahoria crudas. Sin sal/azúcar.
3. ESTILO: Conciso, empático, en viñetas y directo al grano. Máximo 3 párrafos breves.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nConsulta del padre/madre: ${promptText}` }]
      }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const res = UrlFetchApp.fetch(endpoint, options);
    const json = JSON.parse(res.getContentText());
    if (json.candidates && json.candidates[0].content.parts[0].text) {
      return json.candidates[0].content.parts[0].text;
    }
    return "No se pudo obtener respuesta del Asistente Pediátrico.";
  } catch (e) {
    return "Error de conexión con Gemini API: " + e.toString();
  }
}

function ensureSheetsExist(ss) {
  if (!ss.getSheetByName("Registros")) {
    const sheet = ss.insertSheet("Registros");
    sheet.appendRow(["ID", "Timestamp", "Categoria", "Subtipo", "Valor", "Unidad", "FechaInicio", "FechaFin", "Notas"]);
    sheet.getRange("A:I").setNumberFormat("@");
  }
  if (!ss.getSheetByName("Desarrollo")) {
    const sheet = ss.insertSheet("Desarrollo");
    sheet.appendRow(["ID", "Timestamp", "Fecha", "Peso_kg", "Talla_cm", "PerimetroCefalico_cm"]);
    sheet.getRange("A:F").setNumberFormat("@");
  }
  if (!ss.getSheetByName("Dientes")) {
    const sheet = ss.insertSheet("Dientes");
    sheet.appendRow(["ID", "Timestamp", "Tooth", "Erupted", "Fecha"]);
    sheet.getRange("A:E").setNumberFormat("@");
  }
  if (!ss.getSheetByName("Alergenos")) {
    const sheet = ss.insertSheet("Alergenos");
    sheet.appendRow(["ID", "Timestamp", "AllergenKey", "Status", "DayCount", "Notes", "Fecha"]);
    sheet.getRange("A:G").setNumberFormat("@");
  }
}

function parseSheetData(sheet) {
  if(!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      let key = header;
      if (header === "ID") key = "id";
      if (header === "Timestamp") key = "timestamp";
      if (header === "Categoria") key = "categoria";
      if (header === "Subtipo") key = "subtipo";
      if (header === "Valor") key = "valor";
      if (header === "Unidad") key = "unidad";
      if (header === "FechaInicio") key = "fechaInicio";
      if (header === "FechaFin") key = "fechaFin";
      if (header === "Notas") key = "notas";
      
      if (header === "Fecha") key = "fecha";
      if (header === "Peso_kg") key = "peso";
      if (header === "Talla_cm") key = "talla";
      if (header === "PerimetroCefalico_cm") key = "perimetro";
      
      if (header === "Tooth") key = "tooth";
      if (header === "Erupted") key = "erupted";

      if (header === "AllergenKey") key = "allergenKey";
      if (header === "Status") key = "status";
      if (header === "DayCount") key = "dayCount";
      if (header === "Notes") key = "notes";

      obj[key] = row[index] !== undefined ? row[index] : "";
    });
    return obj;
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
