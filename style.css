/**
 * Code.gs - Formulir Santri Baru Daarul Azmi (versi perbaikan)
 *
 * Perubahan dari versi sebelumnya:
 * 1. getSheetById() diganti pencarian lewat getSheets() (method itu tidak ada di Apps Script).
 * 2. doGet() ditambahkan supaya URL /exec bisa dites lewat browser.
 * 3. doPost() juga bisa membaca body JSON, tidak hanya form biasa.
 * 4. Semua error ditangkap, dicatat di Executions, dan pendaftar melihat halaman hasil, bukan halaman error Google.
 * 5. Fungsi izinkanAkses() dan cekStruktur() untuk setup dan diagnosa dari editor.
 */

const SOURCE_SHEET_ID = 426293471;           // angka gid di URL spreadsheet (#gid=...)
const TARGET_SHEET_NAME = "Pendaftaran Form Web";
const EXPECTED_COLUMN_COUNT = 80;

const FIELD_COLUMNS = {
  nama_kk: [1],
  jenis_kelamin: [15],
  nik: [11],
  no_kk: [30, 51],
  sekolah_asal: [8],
  tempat_lahir: [16],
  tanggal_lahir: [17],
  agama: [18],
  anak_ke: [19],
  jumlah_saudara: [20],
  hp_santri: [21],
  email: [22],
  kebutuhan_khusus: [26],
  no_kip: [28],
  no_kks: [73],
  transportasi: [76],
  nama_ayah: [32],
  tahun_lahir_ayah: [36],
  pendidikan_ayah: [37],
  pekerjaan_ayah: [38],
  penghasilan_ayah: [39],
  hp_ayah: [40],
  nama_ibu: [53],
  tahun_lahir_ibu: [57],
  pendidikan_ibu: [58],
  pekerjaan_ibu: [59],
  penghasilan_ibu: [60],
  hp_ibu: [61],
  rt: [47, 68],
  rw: [48, 69],
  desa: [46, 67],
  kode_pos: [50, 71],
  kecamatan: [45, 66],
  kabupaten_kota: [44, 65],
  provinsi: [43, 64]
};

const EXTRA_FIELDS = [
  ["nama_akta", "Nama sesuai Akta Kelahiran"],
  ["nama_ijazah", "Nama sesuai Ijazah Terakhir"],
  ["nisn", "NISN"],
  ["nis", "NIS"],
  ["nomor_ijazah", "Nomor Seri Ijazah"],
  ["npsn", "NPSN Sekolah Asal"],
  ["registrasi_akta", "No. Registrasi Akta Kelahiran"],
  ["jenis_tinggal", "Jenis Tinggal"],
  ["telepon_rumah", "No. Telepon Rumah"],
  ["penerima_kps_pkh", "Penerima KPS / PKH?"],
  ["no_kps", "No. KPS"],
  ["usulan_pip", "Usulan sekolah layak PIP"],
  ["alasan_pip", "Alasan layak PIP"],
  ["penerima_kip", "Penerima KIP?"],
  ["nama_kip", "Nama tertera di KIP"],
  ["alasan_menolak_kip", "Alasan menolak KIP"],
  ["nama_wali", "Nama Wali"],
  ["tahun_lahir_wali", "Tahun Lahir Wali"],
  ["nik_ayah", "NIK Ayah"],
  ["nik_ibu", "NIK Ibu"],
  ["nik_wali", "NIK Wali"],
  ["alamat_wali", "Alamat Wali"],
  ["pekerjaan_wali", "Pekerjaan Wali"],
  ["pendidikan_wali", "Pendidikan Wali"],
  ["penghasilan_wali", "Penghasilan Bulanan Wali"],
  ["hp_wali", "No. Telepon / HP Wali"],
  ["tinggi_badan", "Tinggi Badan (cm)"],
  ["berat_badan", "Berat Badan (kg)"],
  ["lingkar_kepala", "Lingkar Kepala (cm)"],
  ["jarak_sekolah", "Jarak Rumah ke Sekolah (km)"],
  ["waktu_tempuh", "Waktu Tempuh ke Sekolah (menit)"],
  ["lintang", "Lintang"],
  ["bujur", "Bujur"],
  ["prestasi_jenis[]", "Jenis Prestasi"],
  ["prestasi_tingkat[]", "Tingkat Prestasi"],
  ["prestasi_nama[]", "Nama Prestasi"],
  ["prestasi_tahun[]", "Tahun Prestasi"],
  ["prestasi_penyelenggaraan[]", "Penyelenggaraan Prestasi"]
];

/* ------------------------------------------------------------------ */
/* Endpoint                                                            */
/* ------------------------------------------------------------------ */

// Tes cepat: buka URL /exec di browser. Jika muncul "Endpoint formulir aktif", deployment sudah benar.
function doGet() {
  return ContentService
    .createTextOutput("Endpoint formulir aktif.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(event) {
  try {
    return handleSubmission_(event);
  } catch (error) {
    console.error("doPost gagal: " + error.message + "\n" + (error.stack || ""));
    return renderResult_(false, "Terjadi kesalahan pada server. Silakan coba lagi atau hubungi panitia.");
  }
}

function handleSubmission_(event) {
  const parameters = readParameters_(event);

  // Honeypot anti-spam
  if (firstValue_(parameters.website)) {
    return renderResult_(false, "Pengiriman tidak dapat diproses.");
  }

  const values = {};
  Object.keys(parameters).forEach(function (name) {
    values[name] = Array.isArray(parameters[name])
      ? parameters[name].map(cleanValue_).filter(Boolean).join(" | ")
      : cleanValue_(parameters[name]);
  });

  if (!values.nama_kk || !values.jenis_kelamin || !values.nama_ayah ||
      !values.nama_ibu || !values.persetujuan) {
    return renderResult_(false, "Data wajib belum lengkap. Kembali ke formulir dan periksa kolom bertanda *.");
  }

  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Script Property SPREADSHEET_ID belum diatur.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sourceSheet = findSheetById_(spreadsheet, SOURCE_SHEET_ID);
  if (!sourceSheet) {
    throw new Error("Sheet sumber dengan gid " + SOURCE_SHEET_ID + " tidak ditemukan.");
  }
  if (sourceSheet.getLastColumn() < EXPECTED_COLUMN_COUNT) {
    throw new Error("Sheet sumber hanya punya " + sourceSheet.getLastColumn() +
      " kolom terisi, diharapkan minimal " + EXPECTED_COLUMN_COUNT + ".");
  }

  const sourceHeaders = sourceSheet
    .getRange(1, 1, 1, EXPECTED_COLUMN_COUNT)
    .getDisplayValues()[0]
    .map(function (h) { return String(h).trim(); });

  if (sourceHeaders[1] !== "Nama Santri" || sourceHeaders[15] !== "Jenis Kelamin" ||
      sourceHeaders[22] !== "Email") {
    throw new Error("Urutan kolom sheet sumber berubah. Ditemukan: B='" + sourceHeaders[1] +
      "', P='" + sourceHeaders[15] + "', W='" + sourceHeaders[22] + "'.");
  }

  const extraHeaders = EXTRA_FIELDS.map(function (field) {
    return "Data Form: " + field[1];
  });
  const targetHeaders = sourceHeaders.concat(extraHeaders);

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const targetSheet = getTargetSheet_(spreadsheet, targetHeaders);
    const row = Array(targetHeaders.length).fill("");
    row[0] = new Date();

    Object.keys(FIELD_COLUMNS).forEach(function (name) {
      FIELD_COLUMNS[name].forEach(function (column) {
        row[column] = safeCellValue_(values[name] || "");
      });
    });
    row[49] = safeCellValue_(values.alamat_ayah || values.alamat_jalan || "");
    row[70] = safeCellValue_(values.alamat_ibu || values.alamat_jalan || "");
    row[78] = safeCellValue_([values.lintang, values.bujur].filter(Boolean).join(", "));
    EXTRA_FIELDS.forEach(function (field, index) {
      row[EXPECTED_COLUMN_COUNT + index] = safeCellValue_(values[field[0]] || "");
    });

    targetSheet.appendRow(row);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  let emailSent = true;
  try {
    const recipient = properties.getProperty("NOTIFICATION_EMAIL");
    if (!recipient) {
      throw new Error("Script Property NOTIFICATION_EMAIL belum diatur.");
    }
    MailApp.sendEmail({
      to: recipient,
      subject: "Pendaftaran santri baru masuk",
      body: buildEmailBody_(values)
    });
  } catch (error) {
    emailSent = false;
    console.error("Pendaftaran tersimpan, tetapi email notifikasi gagal: " + error.message);
  }

  const message = emailSent
    ? "Data berhasil disimpan ke spreadsheet dan email notifikasi telah dikirim."
    : "Data berhasil disimpan ke spreadsheet, tetapi email notifikasi gagal dikirim.";
  return renderResult_(true, message);
}

/* ------------------------------------------------------------------ */
/* Fungsi bantu                                                        */
/* ------------------------------------------------------------------ */

// Membaca data dari form biasa (urlencoded / multipart) maupun body JSON.
function readParameters_(event) {
  const parameters = {};
  const fromForm = event && event.parameters ? event.parameters : {};
  Object.keys(fromForm).forEach(function (name) {
    parameters[name] = fromForm[name];
  });

  if (Object.keys(parameters).length === 0 && event && event.postData && event.postData.contents) {
    const type = String(event.postData.type || "").toLowerCase();
    const body = String(event.postData.contents || "").trim();
    if (type.indexOf("json") !== -1 || body.charAt(0) === "{") {
      try {
        const json = JSON.parse(body);
        Object.keys(json).forEach(function (name) {
          const value = json[name];
          parameters[name] = Array.isArray(value) ? value : [value];
        });
      } catch (error) {
        console.error("Body JSON tidak valid: " + error.message);
      }
    }
  }
  return parameters;
}

// Pengganti Spreadsheet.getSheetById() yang tidak tersedia di Apps Script.
function findSheetById_(spreadsheet, sheetId) {
  const sheets = spreadsheet.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === sheetId) {
      return sheets[i];
    }
  }
  return null;
}

function getTargetSheet_(spreadsheet, headers) {
  let target = spreadsheet.getSheetByName(TARGET_SHEET_NAME);
  if (!target) {
    target = spreadsheet.insertSheet(TARGET_SHEET_NAME);
    ensureColumns_(target, headers.length);
    target.getRange(1, 1, 1, headers.length).setValues([headers]);
    target.setFrozenRows(1);
    return target;
  }
  if (target.getLastRow() === 0) {
    ensureColumns_(target, headers.length);
    target.getRange(1, 1, 1, headers.length).setValues([headers]);
    target.setFrozenRows(1);
    return target;
  }
  ensureColumns_(target, headers.length);
  const currentHeaders = target.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  if (JSON.stringify(currentHeaders) !== JSON.stringify(headers)) {
    throw new Error("Header tab tujuan berbeda; data tidak ditulis. Hapus tab '" +
      TARGET_SHEET_NAME + "' agar dibuat ulang, atau samakan headernya.");
  }
  return target;
}

function ensureColumns_(sheet, requiredColumnCount) {
  const missingColumns = requiredColumnCount - sheet.getMaxColumns();
  if (missingColumns > 0) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), missingColumns);
  }
}

function buildEmailBody_(values) {
  const lines = ["Pendaftaran santri baru diterima:", ""];
  Object.keys(values).forEach(function (name) {
    if (name !== "persetujuan" && name !== "website") {
      lines.push(name.replace(/\[\]$/, "") + ": " + values[name]);
    }
  });
  return lines.join("\n");
}

function firstValue_(value) {
  return Array.isArray(value) ? String(value[0] || "").trim() : String(value || "").trim();
}

function cleanValue_(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

// Mencegah formula injection di sel spreadsheet.
function safeCellValue_(value) {
  return /^[\u0000-\u0020]*[=+\-@]/.test(value) ? "'" + value : value;
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderResult_(success, message) {
  const title = success ? "Pengiriman berhasil" : "Pengiriman belum berhasil";
  const color = success ? "#08705e" : "#9b3d2c";
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + '</title><body style="margin:0;padding:40px 18px;background:#f5f7f2;color:#18342e;font:16px/1.6 system-ui,sans-serif">' +
    '<main style="max-width:560px;margin:10vh auto;padding:28px;border:1px solid #dce7e0;border-radius:14px;background:#fff">' +
    '<h1 style="margin:0 0 12px;color:' + color + ';font-size:24px">' + title + '</h1>' +
    '<p>' + escapeHtml_(message) + '</p><p>Anda dapat menutup tab ini dan kembali ke halaman formulir.</p></main></body></html>'
  );
}

/* ------------------------------------------------------------------ */
/* Dijalankan manual dari editor (bukan oleh form)                     */
/* ------------------------------------------------------------------ */

// Jalankan SEKALI dari editor (pilih fungsi ini lalu klik Run) untuk menyetujui izin
// akses spreadsheet dan email. Setelah itu deploy ulang dengan "New version".
function izinkanAkses() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Isi dulu Script Property SPREADSHEET_ID.");
  const ss = SpreadsheetApp.openById(id);
  console.log("Spreadsheet terbuka: " + ss.getName());
  console.log("Sisa kuota email hari ini: " + MailApp.getRemainingDailyQuota());
}

// Jalankan dari editor untuk memeriksa struktur sheet sumber. Hasilnya muncul di log eksekusi.
function cekStruktur() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Isi dulu Script Property SPREADSHEET_ID.");
  const ss = SpreadsheetApp.openById(id);
  console.log("Daftar sheet (nama = gid):");
  ss.getSheets().forEach(function (s) {
    console.log("- " + s.getName() + " = " + s.getSheetId() + " (" + s.getLastColumn() + " kolom)");
  });
  const source = findSheetById_(ss, SOURCE_SHEET_ID);
  if (!source) {
    console.log("TIDAK DITEMUKAN sheet dengan gid " + SOURCE_SHEET_ID + ". Ubah SOURCE_SHEET_ID sesuai daftar di atas.");
    return;
  }
  const headers = source.getRange(1, 1, 1, EXPECTED_COLUMN_COUNT).getDisplayValues()[0];
  console.log("B (indeks 1)  = '" + headers[1] + "' (harus 'Nama Santri')");
  console.log("P (indeks 15) = '" + headers[15] + "' (harus 'Jenis Kelamin')");
  console.log("W (indeks 22) = '" + headers[22] + "' (harus 'Email')");
}
