import React from 'react';
import { Building2, Mail, User, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  namaPengisi: string;
  setNamaPengisi: (nama: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onOpenScriptModal: () => void;
  isConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  namaPengisi,
  setNamaPengisi,
  email,
  setEmail,
  onOpenScriptModal,
  isConfigured,
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenScriptModal}
            title="Pengaturan Integrasi (Admin)"
            className={`p-2.5 rounded-xl text-xs font-medium transition-all shadow-sm ${
              isConfigured
                ? 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Respondent Info Section: Nama Lengkap + Email */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Pengisi <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat email valid (contoh: user@gmail.com)"
              required
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Nama Lengkap dan Email ini akan dilampirkan otomatis pada setiap baris data usaha yang dikirimkan.
      </p>
    </header>
  );
};
