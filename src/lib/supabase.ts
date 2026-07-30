import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'sensus_ekonomi_supabase_url_v1';
const STORAGE_KEY_KEY = 'sensus_ekonomi_supabase_key_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface DataUsahaRow {
  nama_pengisi: string;
  nama_usaha: string;
  kategori_digital: string;
  kategori_usaha: string;
}

// Ambil config dari localStorage atau hardcode
export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: localStorage.getItem(STORAGE_KEY_URL) || 'https://xxwnvyzfpphxodajcmkm.supabase.co',
    anonKey: localStorage.getItem(STORAGE_KEY_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4d252eXpmcHBoeG9kYWpjbWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MjIxMjgsImV4cCI6MjEwMDk5ODEyOH0.zUJDjri9n2yvidpXv_FMzO5ICcz6b1ERB8t_MDR5yXw',
  };
}

// Simpan config ke localStorage
export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY_URL, config.url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, config.anonKey.trim());
}

// Cek apakah config sudah diatur
export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return !!config.url && !!config.anonKey;
}

// Buat Supabase client instance
export function createSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  return createClient(config.url, config.anonKey);
}

// Test koneksi ke Supabase
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableExists: boolean;
}> {
  const client = createSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'URL atau API Key belum diatur.',
      tableExists: false,
    };
  }

  try {
    // Coba query tabel data_usaha
    const { error } = await client
      .from('data_usaha')
      .select('id')
      .limit(1);

    if (error) {
      // Tabel belum ada atau error lain
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Koneksi berhasil, tapi tabel "data_usaha" belum dibuat. Silakan jalankan SQL di Supabase SQL Editor.',
          tableExists: false,
        };
      }
      // Error autentikasi
      if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        return {
          success: false,
          message: 'API Key tidak valid. Pastikan Anda menggunakan anon (public) key yang benar.',
          tableExists: false,
        };
      }
      return {
        success: false,
        message: `Error: ${error.message}`,
        tableExists: false,
      };
    }

    return {
      success: true,
      message: '✅ Koneksi berhasil! Tabel "data_usaha" ditemukan dan siap digunakan.',
      tableExists: true,
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal terhubung. Periksa URL Supabase Anda. (${err instanceof Error ? err.message : 'Unknown error'})`,
      tableExists: false,
    };
  }
}

// Kirim data usaha ke Supabase dengan retry
export async function insertDataUsaha(
  rows: DataUsahaRow[],
  maxRetries = 2
): Promise<{ success: boolean; message: string; insertedCount: number }> {
  const client = createSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Database belum dikonfigurasi. Buka Pengaturan Database terlebih dahulu.',
      insertedCount: 0,
    };
  }

  let lastError = '';
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await client
        .from('data_usaha')
        .insert(rows);

      if (error) {
        lastError = error.message;
        if (attempt < maxRetries) {
          // Tunggu sebentar sebelum retry
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        return {
          success: false,
          message: `Gagal menyimpan data: ${error.message}`,
          insertedCount: 0,
        };
      }

      return {
        success: true,
        message: `🎉 Berhasil menyimpan ${rows.length} data usaha ke database!`,
        insertedCount: rows.length,
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error';
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  return {
    success: false,
    message: `Gagal setelah ${maxRetries + 1} percobaan: ${lastError}`,
    insertedCount: 0,
  };
}
