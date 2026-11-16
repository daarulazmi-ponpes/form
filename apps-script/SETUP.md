# Pengaturan Google Sheet dan email

Form statis ini mengirim jawaban ke Google Apps Script. Script membuat tab `Pendaftaran Form Web` dengan 80 kolom dari sheet contoh, memetakan data yang cocok, lalu menambahkan kolom `Data Form:` untuk field tambahan dari form ini. Data form juga dikirim lewat email kepada penerima yang ditentukan di Script Properties.

## Deploy Apps Script

1. Masuk ke [Google Apps Script](https://script.google.com/) memakai akun yang memiliki akses edit ke spreadsheet.
2. Buat project, lalu salin isi `Code.gs` ke editor dan simpan.
3. Buka **Project Settings → Script Properties**, lalu tambahkan:
   - `SPREADSHEET_ID`: ID spreadsheet (bagian URL di antara `/d/` dan `/edit`).
   - `NOTIFICATION_EMAIL`: alamat email penerima hasil formulir.
4. Pilih **Deploy → New deployment → Web app**. Set **Execute as me**, dan atur akses agar pengguna formulir publik dapat mengirim data. Setujui izin akses spreadsheet dan pengiriman email.
5. Salin URL deployment yang berakhiran `/exec`.
6. Di `script.js`, isi `appsScriptEndpoint` dengan URL tersebut. Publikasikan perubahan melalui GitHub Pages.

## Keamanan dan pemrosesan data

- Spreadsheet sumber berisi data identitas. Ubah akses umumnya menjadi **Restricted** dan berikan akses hanya kepada panitia; web app mengakses spreadsheet memakai akun pemilik Apps Script.
- URL web app bersifat publik agar pendaftar dapat mengirim formulir. Honeypot sederhana disediakan, tetapi pantau tab tujuan untuk kiriman spam.
- Email memuat jawaban formulir. Pastikan alamat penerima adalah akun panitia yang berwenang.
- Form tidak mengunggah berkas. Field tambahan dan data prestasi tetap dimasukkan ke kolom ekstra pada tab tujuan; beberapa kolom spreadsheet yang tidak tersedia pada form akan dibiarkan kosong.
- Untuk mengunduh hasil Excel, buka spreadsheet lalu pilih **File → Download → Microsoft Excel (.xlsx)**.
