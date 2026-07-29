export interface BusinessCategory {
  code: string;
  label: string;
  description?: string;
}

export const KATEGORI_USAHA_LIST: BusinessCategory[] = [
  { code: "A", label: "A. Pertanian, Kehutanan, dan Perikanan" },
  { code: "B", label: "B. Pertambangan dan Penggalian" },
  { code: "C", label: "C. Industri Pengolahan / Manufaktur" },
  { code: "D", label: "D. Penyediaan Listrik, Gas, Uap/Air Panas, dan Udara Dingin" },
  { code: "E", label: "E. Penyediaan Air, Pengelolaan Air Limbah, Penanganan Limbah, dan Memediasi" },
  { code: "F", label: "F. Konstruksi" },
  { code: "G", label: "G. Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor" },
  { code: "H", label: "H. Transportasi dan Pergudangan" },
  { code: "I", label: "I. Aktivitas Penyediaan Akomodasi dan Makan Minum" },
  { code: "J", label: "J. Aktivitas Penerbitan, Penyiaran, serta Produksi dan Distribusi Konten" },
  { code: "K", label: "K. Aktivitas Telekomunikasi, Pemrograman Komputer, Konsultansi, Infrastruktur Komputasi" },
  { code: "L", label: "L. Aktivitas Keuangan dan Asuransi" },
  { code: "M", label: "M. Aktivitas Real Estate" },
  { code: "N", label: "N. Aktivitas Profesional, Ilmiah, dan Teknis" },
  { code: "O", label: "O. Aktivitas Administratif dan Penunjang Usaha" },
  { code: "P", label: "P. Administrasi Pemerintahan, Pertahanan, dan Jaminan Sosial Wajib" },
  { code: "Q", label: "Q. Aktivitas Pendidikan" },
  { code: "R", label: "R. Aktivitas Kesehatan Manusia dan Aktivitas Sosial" },
  { code: "S", label: "S. Kesenian, Olahraga, dan Rekreasi" },
  { code: "T", label: "T. Aktivitas Jasa Lainnya" },
  { code: "U", label: "U. Aktivitas Rumah Tangga sebagai Pemberi Kerja & Produksi untuk Kebutuhan Sendiri" },
  { code: "V", label: "V. Aktivitas Badan Internasional dan Badan Ekstra Internasional Lainnya" }
];
