/**
 * GOOGLE APPS SCRIPT FOR SENSUS EKONOMI 2026 MULTI-INPUT FORM (UPDATED WITH NAMA PENGISI)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Header check (6 Columns now: Timestamp, Nama Pengisi, Email, Nama Usaha, Kategori Digital, Kategori Usaha)
    var headers = sheet.getRange(1, 1, 1, 6).getValues()[0];
    if (!headers[0]) {
      sheet.getRange(1, 1, 1, 6).setValues([["Timestamp", "Nama Pengisi", "Email", "Nama Usaha", "Kategori Digital", "Kategori Usaha"]]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
    }
    
    var data = JSON.parse(e.postData.contents);
    var rowsToAppend = [];
    var timestamp = new Date();
    
    if (Array.isArray(data)) {
      data.forEach(function(item) {
        rowsToAppend.push([
          item.timestamp || timestamp,
          item.namaPengisi || '',
          item.email || '',
          item.namaUsaha || '',
          item.kategoriDigital || '',
          item.kategoriUsaha || ''
        ]);
      });
    } else {
      rowsToAppend.push([
        data.timestamp || timestamp,
        data.namaPengisi || '',
        data.email || '',
        data.namaUsaha || '',
        data.kategoriDigital || '',
        data.kategoriUsaha || ''
      ]);
    }
    
    if (rowsToAppend.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, 6).setValues(rowsToAppend);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "inserted": rowsToAppend.length }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
