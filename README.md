# 📊 Data Usaha Sensus Ekonomi 2026 - Multi-Input Web Application

Aplikasi Web modern untuk pengumpulan data usaha **Sensus Ekonomi 2026** dengan fitur **Multi-Input / Batch Entry** yang terintegrasi secara otomatis dan gratis ke **Google Spreadsheet**.

---

## ✨ Fitur Utama

- **🚀 Multi-Input / Batch Entry**: Pengguna dapat menambahkan banyak data usaha sekaligus dalam 1 kali pengiriman (menggunakan tombol `+ Tambah Data Usaha`).
- **🔒 Privasi & Keamanan Terjamin**: Desain *One-Way Submission* tanpa akses publik ke data responden lain atau file spreadsheet.
- **👤 Informasi Pengisi Lengkap**: Mengumpulkan **Nama Lengkap** dan **Email Pengisi** yang dilampirkan otomatis pada setiap baris data di Google Sheets.
- **🏢 22 Kategori Usaha (A - V)**: Mendukung pilihan lengkap kategori usaha sesuai kualifikasi Sensus Ekonomi 2026.
- **🌐 Kategori Digital**: Pilihan indikator kualifikasi digital (*Ya* / *Tidak*).
- **💾 Auto-Save Draft**: Data draft otomatis tersimpan di memori browser (LocalStorage) agar tidak hilang jika browser tertutup.
- **🎨 Desain Modern & Responsive**: UI Glassmorphism dengan animasi halus yang ramah untuk HP, Tablet, maupun Laptop.

---

## 🛠️ Integrasi Google Spreadsheet (Google Apps Script)

Aplikasi ini terhubung langsung ke Google Sheets menggunakan Google Apps Script tanpa memerlukan server/database berbayar.

### Kode Google Apps Script (`Code.gs`):

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Header Kolom Otomatis (6 Kolom)
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
```

### 📋 Cara Pemasangan di Google Spreadsheet:
1. Buka [Google Spreadsheet Anda](https://docs.google.com/spreadsheets/d/1MU0BrNoraGBrA1VOObKuXiGQit3df3S8f-utF_clncY/edit?usp=sharing).
2. Klik menu **Ekstensi (Extensions)** &rarr; **Apps Script**.
3. Hapus semua kode lama, lalu tempel (*paste*) kode di atas.
4. Klik **Terapkan (Deploy)** &rarr; **Terapkan sebagai web app (New Deployment)**.
5. Pada *Yang memiliki akses (Who has access)*, pilih **Siapa Saja (Anyone)**.
6. Klik **Terapkan**, lalu salin URL Web App yang dihasilkan.
7. Masukkan URL tersebut pada tombol ikon **Pengaturan (Admin)** di aplikasi web.

---

## 💻 Cara Menjalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/matchateens/Data-Usaha.git

# Masuk ke direktori
cd Data-Usaha

# Install dependencies
npm install

# Jalankan server lokal
npm run dev
```

Buka `http://localhost:5173/` di browser Anda.

---

## 🌐 Cara Deploy Live di Vercel

```bash
npx vercel
```
Atau hubungkan repository GitHub ini langsung ke akun [Vercel.com](https://vercel.com).

---

## 🧰 Teknologi yang Digunakan

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4** + **PostCSS**
- **Lucide React Icons**
- **Canvas Confetti**
- **Google Apps Script API**

---

Made with ❤️ for Sensus Ekonomi 2026.
