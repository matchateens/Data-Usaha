import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Key,
  Globe,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SQL_SCRIPT = `-- TABEL DATA USAHA - SENSUS EKONOMI 2026
-- Copy-paste SELURUH kode ini, lalu klik "Run"

CREATE TABLE IF NOT EXISTS data_usaha (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  nama_pengisi  TEXT NOT NULL,
  email         TEXT NOT NULL,
  nama_usaha    TEXT NOT NULL,
  kategori_digital TEXT NOT NULL,
  kategori_usaha   TEXT NOT NULL
);

ALTER TABLE data_usaha ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON data_usaha FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON data_usaha FOR SELECT TO authenticated
  USING (true);

GRANT INSERT ON data_usaha TO anon;`;

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists: boolean;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setTestResult(null);
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleTest = async () => {
    saveSupabaseConfig({ url, anonKey });
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch {
      setTestResult({
        success: false,
        message: 'Terjadi kesalahan tidak terduga saat testing.',
        tableExists: false,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveSupabaseConfig({ url, anonKey });
    setIsSaved(true);
    onSaved();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCRIPT);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = SQL_SCRIPT;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const canSave = url.trim() && anonKey.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-700/80 max-h-[90vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pengaturan Database</h2>
            <p className="text-xs text-slate-400">
              Hubungkan ke Supabase agar data otomatis tersimpan aman
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Supabase Project URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              Supabase Project URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setTestResult(null);
                setIsSaved(false);
              }}
              placeholder="https://abcdefghij.supabase.co"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Ditemukan di: Project Settings → API → Project URL
            </p>
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-400" />
              Anon (Public) API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => {
                setAnonKey(e.target.value);
                setTestResult(null);
                setIsSaved(false);
              }}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="glass-input w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Ditemukan di: Project Settings → API → anon public key
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                testResult.success && testResult.tableExists
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : testResult.success && !testResult.tableExists
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              {testResult.success && testResult.tableExists ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* SQL Section — Show when table not found */}
          {(showSql || (testResult && testResult.success && !testResult.tableExists)) && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-700/80 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/60">
                <span className="text-xs font-semibold text-slate-300">
                  📋 SQL untuk Membuat Tabel (jalankan di Supabase SQL Editor)
                </span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[11px] font-medium transition-colors border border-indigo-500/30"
                >
                  {sqlCopied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy SQL
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-[11px] leading-relaxed text-emerald-300 overflow-x-auto font-mono max-h-48">
                {SQL_SCRIPT}
              </pre>
            </div>
          )}

          {/* Quick Links */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Supabase Dashboard
            </a>
            <button
              onClick={() => setShowSql(!showSql)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              {showSql ? 'Sembunyikan SQL' : 'Lihat SQL Tabel'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-700/60 flex items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={handleTest}
            disabled={!canSave || isTesting}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 text-sm font-medium flex items-center gap-2 transition-colors border border-slate-700"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>🔍 Test Koneksi</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-indigo-500/25'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>💾 Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
