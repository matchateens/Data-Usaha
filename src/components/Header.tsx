import React from 'react';
import { Building2, User, Sparkles, Settings, Database } from 'lucide-react';

interface HeaderProps {
  namaPengisi: string;
  setNamaPengisi: (nama: string) => void;
  isDbConnected: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  namaPengisi,
  setNamaPengisi,
  isDbConnected,
  onOpenSettings,
}) => {
  return (
    <header className="glass-panel rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Formulir Resmi Sensus Ekonomi 2026
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-400" />
            Data Usaha Sensus Ekonomi 2026
          </h1>
          <p className="text-slate-400 mt-1 text-sm max-w-2xl">
            Mohon isi formulir ini untuk melengkapi data usaha Anda. Anda dapat menginput <span className="text-indigo-300 font-semibold">banyak data usaha sekaligus</span> dalam satu kali kirim.
          </p>
        </div>

        {/* Database Status + Settings Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-medium transition-all group"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors group-hover:rotate-90 duration-300" />
            <span>Pengaturan Database</span>
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium ${
            isDbConnected
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            <Database className="w-3 h-3" />
            <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {isDbConnected ? 'Supabase Terhubung' : 'Belum Terkonfigurasi'}
          </div>
        </div>
      </div>

      {/* Respondent Info Section: Nama Lengkap */}
      <div className="mt-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nama Lengkap Pengisi <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={namaPengisi}
              onChange={(e) => setNamaPengisi(e.target.value)}
              placeholder="Masukkan Nama Lengkap Anda..."
              required
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Nama Lengkap ini akan dilampirkan otomatis pada setiap baris data usaha yang dikirimkan.
      </p>
    </header>
  );
};
