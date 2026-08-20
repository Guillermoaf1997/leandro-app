// Configuración de la hoja de cálculo y zona horaria
const TIMEZONE = "Europe/Madrid";

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsExist(ss);

  const action = e.parameter.action;
  
  if (action === "getData") {
    const sheetRegistros = ss.getSheetByName("Registros");
    const sheetDesarrollo = ss.getSheetByName("Desarrollo");

    const records = parseSheetData(sheetRegistros);
    const growth = parseSheetData(sheetDesarrollo);

    return createJsonResponse({ status: "success", records: records, growth: growth });
  }

  return createJsonResponse({ status: "running", message: "Leandro App API activa" });
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist(ss);
    
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const data = contents.data;

    if (action === "addRecord") {
      const sheet = ss.getSheetByName("Registros");
      const timestamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
      sheet.appendRow([
        timestamp,
        data.categoria,
        data.subtipo,
        data.valor,
        data.unidad,
        data.fechaInicio,
        data.fechaFin,
        data.notas || ""
      ]);
      return createJsonResponse({ status: "success", message: "Registro guardado" });
    }

    if (action === "addGrowth") {
      const sheet = ss.getSheetByName("Desarrollo");
      const timestamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
      sheet.appendRow([
        timestamp,
        data.fecha,
        data.peso,
        data.talla,
        data.perimetro
      ]);
      return createJsonResponse({ status: "success", message: "Desarrollo guardado" });
    }

    return createJsonResponse({ status: "error", message: "Acción no reconocida" });

  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function ensureSheetsExist(ss) {
  if (!ss.getSheetByName("Registros")) {
    const sheet = ss.insertSheet("Registros");
    sheet.appendRow(["Timestamp", "Categoria", "Subtipo", "Valor", "Unidad", "FechaInicio", "FechaFin", "Notas"]);
  }
  if (!ss.getSheetByName("Desarrollo")) {
    const sheet = ss.insertSheet("Desarrollo");
    sheet.appendRow(["Timestamp", "Fecha", "Peso_kg", "Talla_cm", "PerimetroCefalico_cm"]);
  }
}

function parseSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header.toLowerCase()] = row[index];
    });
    return obj;
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
