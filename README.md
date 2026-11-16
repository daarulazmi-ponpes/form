# Formulir Santri Baru Daarul Azmi

Website statis HTML, CSS, dan JavaScript untuk GitHub Pages.

## Isi folder
- `index.html` — struktur formulir dan metadata Open Graph untuk pratinjau tautan
- `style.css` — tampilan responsif
- `script.js` — validasi, data prestasi dinamis, dan pengiriman ke spreadsheet/email melalui Apps Script
- `assets/logo-daarul-azmi.png` — logo pondok
- `assets/social-preview.png` — gambar Open Graph untuk pratinjau tautan

## Pengiriman ke Google Sheet dan email
Pengiriman memakai Google Apps Script. Ikuti langkah di [`apps-script/SETUP.md`](apps-script/SETUP.md) untuk mengatur spreadsheet, alamat email penerima, dan URL deployment. URL deployment sudah dipasang di `script.js`; pastikan Apps Script menerima field formulir ini sebelum situs dipublikasikan.

## Deploy ke GitHub Pages
1. Buat repository GitHub, misalnya `formulir-santri-daarul-azmi`.
2. Unggah semua isi folder ini ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu **Save**.
5. Setelah website aktif, buka **Settings → Pages → Custom domain**, masukkan `form.daarulazmi.ponpes.id`, lalu simpan.
6. Di pengelola DNS domain `daarulazmi.ponpes.id`, tambahkan record **CNAME**:
   - Host/Name: `form`
   - Target/Value: `daarulazmi-ponpes.github.io`
7. Tunggu propagasi DNS. Setelah DNS terverifikasi, aktifkan **Enforce HTTPS** di Settings → Pages.

Jika domain induk dikelola di layanan DNS tertentu, nama kolom mungkin berbeda. Pastikan record dibuat di provider DNS yang benar-benar didelegasikan dan semua nameserver authoritative memuat record yang sama. Jika nameserver dari provider lama masih terdaftar di registrar, sinkronkan zona DNS atau hapus delegasi lama setelah memastikan record lain yang diperlukan tetap tersedia. Jangan mengubah record DNS lain yang sudah digunakan website/email.

## Catatan
- Formulir menyimpan jawaban ke tab baru pada Google Sheet dan mengirim notifikasi email melalui Apps Script.
- Sheet tidak perlu dibagikan secara publik; cukup beri akses kepada akun yang men-deploy Apps Script.
- Endpoint Apps Script publik dapat menerima spam; pantau kiriman dan batasi akses spreadsheet kepada panitia.
- Kolom NIK dan data keluarga bersifat pribadi; hindari membagikan tautan pesan atau tangkapan layar secara terbuka.
- Formulir mengikuti permintaan: pilihan Program Mukim/Non Mukim dihapus, poin g (Nomor Seri SKHUN) dan h (No. Ujian Nasional) dihapus.
- Tinjau kembali istilah dan kewajiban setiap kolom bersama pihak pondok sebelum digunakan resmi.
