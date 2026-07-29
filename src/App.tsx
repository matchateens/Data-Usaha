import { useState, useEffect } from 'react';
import type { FormRow, ToastState } from './types';
import { Header } from './components/Header';
import { RowItem } from './components/RowItem';
import { GoogleScriptModal } from './components/GoogleScriptModal';
import { PreviewModal } from './components/PreviewModal';
import confetti from 'canvas-confetti';
import {
  Plus,
  Send,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

const STORAGE_KEY_ROWS = 'sensus_ekonomi_rows_draft_v1';
const STORAGE_KEY_NAMA = 'sensus_ekonomi_nama_v1';
const STORAGE_KEY_EMAIL = 'sensus_ekonomi_email_v1';
const STORAGE_KEY_SCRIPT_URL = 'sensus_ekonomi_script_url_v1';

const DEFAULT_SCRIPT_URL = '';

export function App() {
  const [namaPengisi, setNamaPengisi] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NAMA) || '';
  });

  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_EMAIL) || '';
  });

  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_SCRIPT_URL) || DEFAULT_SCRIPT_URL;
  });

  const [rows, setRows] = useState<FormRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROWS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [createEmptyRow()];
  });

  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Auto-save drafts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NAMA, namaPengisi);
  }, [namaPengisi]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMAIL, email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCRIPT_URL, scriptUrl);
  }, [scriptUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROWS, JSON.stringify(rows));
  }, [rows]);

  function createEmptyRow(): FormRow {
    return {
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      namaUsaha: '',
      kategoriDigital: '',
      kategoriUsaha: '',
    };
  }

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
    showToast('info', 'Baris data usaha baru berhasil ditambahkan!');
  };

  const handleDuplicateRow = (targetRow: FormRow) => {
    const newRow: FormRow = {
      ...targetRow,
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      namaUsaha: targetRow.namaUsaha ? `${targetRow.namaUsaha} (Salinan)` : '',
    };
    setRows((prev) => [...prev, newRow]);
    showToast('info', 'Baris berhasil diduplikasi!');
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Baris data berhasil dihapus.');
  };

  const handleRowChange = (id: string, field: keyof FormRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin meriset semua baris data ke semula?')) {
      setRows([createEmptyRow()]);
      showToast('info', 'Formulir berhasil diriset.');
    }
  };

  const handleSendToSheets = async () => {
    if (!scriptUrl) {
      showToast('error', 'Silakan atur Web App URL Google Apps Script terlebih dahulu!');
      setIsScriptModalOpen(true);
      return;
    }

    if (!namaPengisi.trim()) {
      showToast('error', 'Silakan isi Nama Lengkap Pengisi terlebih dahulu!');
      return;
    }

    if (!email.trim()) {
      showToast('error', 'Silakan isi Alamat Email Pengisi terlebih dahulu!');
      return;
    }

    const uncompleted = rows.filter((r) => !r.namaUsaha.trim() || !r.kategoriDigital || !r.kategoriUsaha);
    if (uncompleted.length > 0) {
      showToast('error', `Terdapat ${uncompleted.length} baris data yang belum lengkap. Harap lengkapi semua kolom!`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = rows.map((r) => ({
        timestamp: new Date().toLocaleString('id-ID'),
        namaPengisi: namaPengisi.trim(),
        email: email.trim(),
        namaUsaha: r.namaUsaha.trim(),
        kategoriDigital: r.kategoriDigital,
        kategoriUsaha: r.kategoriUsaha,
      }));

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast('success', `🎉 Berhasil mengirim ${rows.length} data usaha ke Google Spreadsheet!`);
      setRows([createEmptyRow()]);
      setIsPreviewModalOpen(false);

    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal mengirim data. Silakan periksa kembali URL Apps Script Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-medium animate-slide-up backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Setup Alert Banner if scriptUrl not set */}
      {!scriptUrl && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold">Web App URL Google Sheets Belum Dikonfigurasi</p>
              <p className="text-xs text-amber-300/80">
                Klik tombol di sebelah kanan untuk memasang script Google Apps Script gratis pada spreadsheet Anda.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScriptModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shrink-0 self-start md:self-auto"
          >
            Setup Sekarang
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        namaPengisi={namaPengisi}
        setNamaPengisi={setNamaPengisi}
        email={email}
        setEmail={setEmail}
        onOpenScriptModal={() => setIsScriptModalOpen(true)}
        isConfigured={!!scriptUrl}
      />

      {/* Main Dynamic Multi-Row Form */}
      <main className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Daftar Data Usaha</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs">
                {rows.length} Baris
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Riset Form</span>
            </button>
          </div>
        </div>

        {/* Rows Card List */}
        <div className="space-y-4">
          {rows.map((row, index) => (
            <RowItem
              key={row.id}
              row={row}
              index={index}
              totalRows={rows.length}
              onChange={handleRowChange}
              onDuplicate={handleDuplicateRow}
              onDelete={handleDeleteRow}
            />
          ))}
        </div>

        {/* Action Controls Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 text-indigo-400" />
            <span>+ Tambah Data Usaha Lainnya</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleSendToSheets}
              disabled={isSubmitting}
              className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Kirim {rows.length} Data Usaha</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <GoogleScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        scriptUrl={scriptUrl}
        onSaveScriptUrl={(url) => {
          setScriptUrl(url);
          setIsScriptModalOpen(false);
          showToast('success', 'URL Apps Script berhasil disimpan!');
        }}
        showToast={showToast}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        namaPengisi={namaPengisi}
        email={email}
        rows={rows}
        onConfirmSend={handleSendToSheets}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default App;
