// COPIA ESTE CÓDIGO EN EL EDITOR DE APPS SCRIPT DE TU GOOGLE SHEET
// ID Hoja: 1qS22VHBywCSd7N3sYYfbScWW_WRb81YGFxKm6WcbCVk

const SPREADSHEET_ID = '1qS22VHBywCSd7N3sYYfbScWW_WRb81YGFxKm6WcbCVk';

/**
 * FUNCIÓN 1: CONSTRUIR ESTRUCTURA
 * Ejecuta esta función una vez manualmente desde el editor para crear las hojas.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const structure = {
    'Estudiantes': ['id', 'name', 'level', 'grade', 'section'], // Added section
    'Materias': ['id', 'name', 'level', 'grade'],
    'Notas': ['id', 'studentId', 'subjectId', 'score', 'period', 'isPublished', 'comment'],
    'Usuarios': ['id', 'username', 'name', 'role'] 
  };

  Object.keys(structure).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Eliminar columnas y filas extra para optimizar
      if (sheet.getMaxColumns() > structure[sheetName].length) {
        sheet.deleteColumns(structure[sheetName].length + 1, sheet.getMaxColumns() - structure[sheetName].length);
      }
    }
    
    // Establecer cabeceras siempre
    sheet.getRange(1, 1, 1, structure[sheetName].length).setValues([structure[sheetName]])
         .setFontWeight('bold')
         .setBackground('#e0e0e0');
  });
  
  Logger.log('Base de datos inicializada correctamente.');
}

/**
 * FUNCIÓN 2: API GET (LEER DATOS)
 * Devuelve todos los datos en formato JSON.
 */
function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const data = {
    students: getSheetData(ss, 'Estudiantes'),
    subjects: getSheetData(ss, 'Materias'),
    grades: getSheetData(ss, 'Notas')
  };

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * FUNCIÓN 3: API POST (GUARDAR DATOS)
 * Recibe el JSON completo y sobrescribe las hojas.
 */
function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.students) saveSheetData(ss, 'Estudiantes', data.students, ['id', 'name', 'level', 'grade', 'section']);
    if (data.subjects) saveSheetData(ss, 'Materias', data.subjects, ['id', 'name', 'level', 'grade']);
    if (data.grades) saveSheetData(ss, 'Notas', data.grades, ['id', 'studentId', 'subjectId', 'score', 'period', 'isPublished', 'comment']);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Datos guardados' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helpers
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      // Convertir tipos si es necesario
      let value = row[index];
      if (header === 'isPublished') value = (value === true || value === 'TRUE');
      obj[header] = value;
    });
    return obj;
  });
}

function saveSheetData(ss, sheetName, dataArray, headers) {
  const sheet = ss.getSheetByName(sheetName);
  // Limpiar datos antiguos (manteniendo cabecera)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  
  if (dataArray.length === 0) return;

  const rows = dataArray.map(item => {
    return headers.map(header => item[header] || '');
  });

  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}