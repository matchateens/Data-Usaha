export interface FormRow {
  id: string;
  namaUsaha: string;
  kategoriDigital: 'Ya' | 'Tidak' | '';
  kategoriUsaha: string;
}

export interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}
