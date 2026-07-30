import React from 'react';
import type { FormRow } from '../types';
import { X, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  namaPengisi: string;
  rows: FormRow[];
  onConfirmSend: () => void;
  isSubmitting: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  namaPengisi,
  rows,
  onConfirmSend,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const invalidRows = rows.filter(
    (r) => !r.namaUsaha.trim() || !r.kategoriDigital || !r.kategoriUsaha
  );
  const isValid = invalidRows.length === 0 && !!namaPengisi.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-700/80 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Ringkasan Data Sebelum Dikirim</h2>
            <p className="text-xs text-slate-400">
              Periksa kembali {rows.length} data usaha di bawah ini sebelum dikirim ke database.
            </p>
          </div>
        </div>

        {/* Respondent Info Badge */}
        <div className="mb-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Nama Lengkap Pengisi:</span>
            <span className="font-semibold text-white">{namaPengisi || <span className="text-rose-400 italic">Belum diisi</span>}</span>
          </div>
        </div>

        {!isValid && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {!namaPengisi.trim()
                ? 'Nama Lengkap Wajib diisi!'
                : `Terdapat ${invalidRows.length} baris data yang belum lengkap (Nama, Kategori Digital, atau Kategori Usaha).`}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1 my-2">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/80 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Nama Usaha</th>
                <th className="py-2.5 px-3">Digital</th>
                <th className="py-2.5 px-3">Kategori Usaha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows.map((row, idx) => {
                const rowComplete = row.namaUsaha.trim() && row.kategoriDigital && row.kategoriUsaha;
                return (
                  <tr key={row.id} className={rowComplete ? 'hover:bg-slate-800/40' : 'bg-rose-500/5'}>
                    <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-white">
                      {row.namaUsaha || <span className="text-rose-400 italic">Belum diisi</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      {row.kategoriDigital ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.kategoriDigital === 'Ya' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                          {row.kategoriDigital}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {row.kategoriUsaha || <span className="text-rose-400 italic">Belum dipilih</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs md:text-sm font-medium transition-colors"
          >
            Kembali ke Form
          </button>

          <button
            type="button"
            onClick={onConfirmSend}
            disabled={!isValid || isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim {rows.length} Data...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya, Kirim {rows.length} Data Sekaligus</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
