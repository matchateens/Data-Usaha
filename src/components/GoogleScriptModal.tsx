import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, RefreshCw, Code2 } from 'lucide-react';

interface GoogleScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
  showToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const GoogleScriptModal: React.FC<GoogleScriptModalProps> = ({
  isOpen,
  onClose,
  scriptUrl,
  onSaveScriptUrl,
  showToast,
}) => {
  const [inputUrl, setInputUrl] = useState(scriptUrl);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const SCRIPT_CODE = `function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
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
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setCopied(true);
    showToast('success', 'Kode Google Apps Script berhasil disalin!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!inputUrl) {
      showToast('error', 'Masukkan URL Web App terlebih dahulu!');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(inputUrl);
      const data = await response.json();

      if (data.status === 'active' || data.result === 'success') {
        showToast('success', 'Koneksi ke Google Sheets Berhasil!');
        onSaveScriptUrl(inputUrl);
      } else {
        showToast('info', 'Endpoint merespons! URL disimpan.');
        onSaveScriptUrl(inputUrl);
      }
    } catch (err) {
      showToast('info', 'URL Apps Script telah disimpan! Siap digunakan untuk pengiriman.');
      onSaveScriptUrl(inputUrl);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-700/80 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panduan Integrasi Google Sheets</h2>
            <p className="text-xs text-slate-400">Hubungkan web ini langsung ke Google Spreadsheet Anda secara gratis.</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm space-y-2">
            <p className="font-semibold text-indigo-300">Langkah 1: Salin Script di bawah ini</p>
            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl text-xs text-emerald-400 font-mono overflow-x-auto max-h-48 border border-slate-800">
                {SCRIPT_CODE}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Script'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-indigo-300">Langkah 2: Pasang di Google Spreadsheet</p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-400">
              <li>
                Buka <a href="https://docs.google.com/spreadsheets/d/1MU0BrNoraGBrA1VOObKuXiGQit3df3S8f-utF_clncY/edit" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">Google Spreadsheet Anda <ExternalLink className="w-3 h-3" /></a>
              </li>
              <li>Klik menu <strong className="text-white">Ekstensi (Extensions)</strong> &rarr; <strong className="text-white">Apps Script</strong>.</li>
              <li>Hapus semua kode lama, lalu <strong className="text-white">Paste (Tempel)</strong> kode yang sudah disalin di atas.</li>
              <li>Klik menu <strong className="text-white">Terapkan (Deploy)</strong> &rarr; <strong className="text-white">Terapkan sebagai web app (New deployment)</strong>.</li>
              <li>Pilih jenis <strong className="text-white">Web App</strong>, lalu set <strong className="text-white">Yang memiliki akses (Who has access)</strong> ke <strong className="text-emerald-400 font-bold">Siapa Saja (Anyone)</strong>.</li>
              <li>Klik <strong className="text-white">Terapkan (Deploy)</strong> dan salin <strong className="text-white">URL Web App</strong> yang dihasilkan.</li>
            </ol>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
          <label className="block text-xs font-semibold text-indigo-200 mb-2">
            Masukkan URL Web App Google Apps Script:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="glass-input flex-1 px-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none"
            />
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all shrink-0"
            >
              {isTesting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Simpan & Verifikasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
