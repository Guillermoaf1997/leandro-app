// Configuración de la hoja de cálculo
const TIMEZONE = "Europe/Madrid";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsExist(ss);

  const action = e.parameter.action;
  if (action === "getData") {
    return createJsonResponse({
      status: "success",
      records: parseSheetData(ss.getSheetByName("Registros")),
      growth: parseSheetData(ss.getSheetByName("Desarrollo")),
      teeth: parseSheetData(ss.getSheetByName("Dientes"))
    });
  }
  return createJsonResponse({ status: "running", message: "API activa" });
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist(ss);
    
    // Al usar text/plain en fetch, evitamos el OPTIONS preflight.
    // Parseamos el JSON desde el body en texto crudo.
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const data = contents.data;

    if (action === "sync") {
      const sheetReg = ss.getSheetByName("Registros");
      const sheetGrow = ss.getSheetByName("Desarrollo");
      const sheetTeeth = ss.getSheetByName("Dientes");
      
      // Sincronización de registros (Deduplicación por UUID 'id')
      if(data.records && data.records.length > 0) {
        const existingIds = new Set(parseSheetData(sheetReg).map(r => r.id));
        data.records.forEach(r => {
          if(!existingIds.has(r.id)) {
            sheetReg.appendRow([r.id, r.timestamp, r.categoria, r.subtipo, r.valor, r.unidad, r.fechaInicio, r.fechaFin, r.notas || ""]);
          }
        });
      }
      
      // Sincronización de desarrollo
      if(data.growth && data.growth.length > 0) {
         const existingGrowthIds = new Set(parseSheetData(sheetGrow).map(g => g.id));
         data.growth.forEach(g => {
           if(!existingGrowthIds.has(g.id)) {
             sheetGrow.appendRow([g.id, g.timestamp, g.fecha, g.peso, g.talla, g.perimetro]);
           }
         });
      }
      
      // Sincronización de dentición
      if(data.teeth && data.teeth.length > 0) {
         const existingTeethIds = new Set(parseSheetData(sheetTeeth).map(t => t.id));
         data.teeth.forEach(t => {
           if(!existingTeethIds.has(t.id)) {
             sheetTeeth.appendRow([t.id, t.timestamp, t.tooth, t.erupted, t.fecha]);
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

function ensureSheetsExist(ss) {
  if (!ss.getSheetByName("Registros")) {
    const sheet = ss.insertSheet("Registros");
    sheet.appendRow(["ID", "Timestamp", "Categoria", "Subtipo", "Valor", "Unidad", "FechaInicio", "FechaFin", "Notas"]);
    sheet.getRange("A:I").setNumberFormat("@"); // FORMATO TEXTO: Evita corrupciones de huso horario
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
      obj[header.toLowerCase()] = row[index] !== undefined ? row[index] : "";
    });
    return obj;
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
