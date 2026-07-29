import React from 'react';
import type { FormRow } from '../types';
import { KATEGORI_USAHA_LIST } from '../data/categories';
import { Trash2, Copy, Building, Globe2, Briefcase } from 'lucide-react';

interface RowItemProps {
  row: FormRow;
  index: number;
  totalRows: number;
  onChange: (id: string, field: keyof FormRow, value: string) => void;
  onDuplicate: (row: FormRow) => void;
  onDelete: (id: string) => void;
}

export const RowItem: React.FC<RowItemProps> = ({
  row,
  index,
  totalRows,
  onChange,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-indigo-500/30 group relative">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs border border-indigo-500/30">
            #{index + 1}
          </span>
          <h3 className="font-semibold text-slate-200 text-sm md:text-base">
            {row.namaUsaha || `Entry Data Usaha #${index + 1}`}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDuplicate(row)}
            title="Duplikasi Baris Ini"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>

          {totalRows > 1 && (
            <button
              type="button"
              onClick={() => onDelete(row.id)}
              title="Hapus Baris Ini"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            Nama Usaha <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={row.namaUsaha}
            onChange={(e) => onChange(row.id, 'namaUsaha', e.target.value)}
            placeholder="Masukkan Nama Usaha / PT / CV / Toko..."
            required
            className="glass-input w-full px-3.5 py-2 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            Kategori Digital <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-2 pt-0.5">
            {['Ya', 'Tidak'].map((val) => (
              <label
                key={val}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  row.kategoriDigital === val
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name={`digital-${row.id}`}
                  value={val}
                  checked={row.kategoriDigital === val}
                  onChange={(e) => onChange(row.id, 'kategoriDigital', e.target.value as 'Ya' | 'Tidak')}
                  className="sr-only"
                />
                <span className={`w-2 h-2 rounded-full ${row.kategoriDigital === val ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                {val}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Kategori Usaha <span className="text-rose-400">*</span>
          </label>
          <select
            value={row.kategoriUsaha}
            onChange={(e) => onChange(row.id, 'kategoriUsaha', e.target.value)}
            required
            className="glass-input w-full px-3.5 py-2 rounded-xl text-white text-xs md:text-sm focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">
              -- Pilih Kategori (A - V) --
            </option>
            {KATEGORI_USAHA_LIST.map((cat) => (
              <option key={cat.code} value={cat.label} className="bg-slate-900 text-slate-200">
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
