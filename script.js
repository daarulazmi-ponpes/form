(() => {
  "use strict";
  const form = document.getElementById("santriForm");
  const list = document.getElementById("prestasiList");
  const addButton = document.getElementById("addPrestasi");
  const whatsappNumber = "6288801005284";

  const field = (label, name, placeholder = "") =>
    `<label class="field"><span>${label}</span><input name="${name}" placeholder="${placeholder.replace(/"/g, "&quot;")}"></label>`;

  function addAchievement() {
    const card = document.createElement("div");
    card.className = "achievement-card";
    const count = list.children.length + 1;
    card.innerHTML = `
      <div class="achievement-top"><span>Prestasi ${count}</span><button type="button" class="remove-achievement">Hapus</button></div>
      <div class="form-grid">
        ${field("Jenis Prestasi", "prestasi_jenis[]")}
        <label class="field"><span>Tingkat</span><select name="prestasi_tingkat[]"><option value="">Pilih tingkat</option><option>Sekolah</option><option>Kecamatan</option><option>Kabupaten/Kota</option><option>Provinsi</option><option>Nasional</option><option>Internasional</option></select></label>
        ${field("Nama Prestasi", "prestasi_nama[]")}
        ${field("Tahun", "prestasi_tahun[]", "YYYY")}
        ${field("Penyelenggaraan", "prestasi_penyelenggaraan[]")}
      </div>`;
    card.querySelector(".remove-achievement").addEventListener("click", () => {
      card.remove();
      renumberAchievements();
    });
    list.appendChild(card);
    renumberAchievements();
  }

  function renumberAchievements() {
    [...list.children].forEach((card, index) => {
      card.querySelector(".achievement-top span").textContent = `Prestasi ${index + 1}`;
    });
  }

  function getValue(name) {
    const el = form.elements.namedItem(name);
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value.trim();
    return (el.value || "").trim();
  }

  function prettyDate(value) {
    if (!value) return "";
    const parts = value.split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
  }

  function addLine(lines, label, value) {
    if (value !== "") lines.push(`${label}: ${value}`);
  }

  function makeMessage() {
    const lines = [
      "*FORMULIR SANTRI BARU DAARUL AZMI*",
      "================================",
      "",
      "*A. IDENTITAS PESERTA DIDIK*"
    ];
    const studentFields = [
      ["Nama sesuai Kartu Keluarga", "nama_kk"],
      ["Nama sesuai Akta Kelahiran", "nama_akta"],
      ["Nama sesuai Ijazah Terakhir", "nama_ijazah"],
      ["Jenis Kelamin", "jenis_kelamin"],
      ["NISN", "nisn"], ["NIS", "nis"], ["Nomor Seri Ijazah", "nomor_ijazah"],
      ["NIK", "nik"], ["Nomor Kartu Keluarga", "no_kk"], ["NPSN Sekolah Asal", "npsn"],
      ["Nama Sekolah Asal", "sekolah_asal"], ["Tempat Lahir", "tempat_lahir"],
      ["Tanggal Lahir", "tanggal_lahir"], ["Agama", "agama"],
      ["No. Registrasi Akta Kelahiran", "registrasi_akta"], ["Berkebutuhan Khusus", "kebutuhan_khusus"],
      ["Alat Transportasi ke Sekolah", "transportasi"], ["Jenis Tinggal", "jenis_tinggal"],
      ["No. Telepon Rumah", "telepon_rumah"], ["No. HP Santri", "hp_santri"], ["Email Pribadi", "email"],
      ["No. KKS", "no_kks"], ["Penerima KPS/PKH", "penerima_kps_pkh"], ["No. KPS", "no_kps"],
      ["Usulan sekolah layak PIP", "usulan_pip"], ["Alasan layak PIP", "alasan_pip"],
      ["Penerima KIP", "penerima_kip"], ["No. KIP", "no_kip"], ["Nama tertera di KIP", "nama_kip"],
      ["Alasan menolak KIP", "alasan_menolak_kip"], ["Lintang", "lintang"], ["Bujur", "bujur"],
      ["Dusun/Jalan", "alamat_jalan"], ["RT", "rt"], ["RW", "rw"], ["Kelurahan/Desa", "desa"],
      ["Kode Pos", "kode_pos"], ["Kecamatan", "kecamatan"], ["Kabupaten/Kota", "kabupaten_kota"], ["Provinsi", "provinsi"]
    ];
    studentFields.forEach(([label, name]) => {
      let value = getValue(name);
      if (name === "tanggal_lahir") value = prettyDate(value);
      addLine(lines, label, value);
    });

    const parentGroups = [
      ["B. DATA AYAH KANDUNG", "ayah", [
        ["Nama Ayah", "nama_ayah"], ["Tahun Lahir", "tahun_lahir_ayah"], ["NIK Ayah", "nik_ayah"],
        ["Alamat Ayah", "alamat_ayah"], ["Pekerjaan Ayah", "pekerjaan_ayah"], ["Pendidikan Ayah", "pendidikan_ayah"],
        ["Penghasilan Bulanan Ayah", "penghasilan_ayah"], ["No. HP Ayah", "hp_ayah"]
      ]],
      ["C. DATA IBU KANDUNG", "ibu", [
        ["Nama Ibu", "nama_ibu"], ["Tahun Lahir", "tahun_lahir_ibu"], ["NIK Ibu", "nik_ibu"],
        ["Alamat Ibu", "alamat_ibu"], ["Pekerjaan Ibu", "pekerjaan_ibu"], ["Pendidikan Ibu", "pendidikan_ibu"],
        ["Penghasilan Bulanan Ibu", "penghasilan_ibu"], ["No. HP Ibu", "hp_ibu"]
      ]],
      ["D. DATA WALI", "wali", [
        ["Nama Wali", "nama_wali"], ["Tahun Lahir", "tahun_lahir_wali"], ["NIK Wali", "nik_wali"],
        ["Alamat Wali", "alamat_wali"], ["Pekerjaan Wali", "pekerjaan_wali"], ["Pendidikan Wali", "pendidikan_wali"],
        ["Penghasilan Bulanan Wali", "penghasilan_wali"], ["No. HP Wali", "hp_wali"]
      ]]
    ];
    parentGroups.forEach(([heading, , fields]) => {
      lines.push("", `*${heading}*`);
      fields.forEach(([label, name]) => addLine(lines, label, getValue(name)));
    });

    lines.push("", "*E. DATA PERIODIK*");
    [
      ["Tinggi Badan (cm)", "tinggi_badan"], ["Berat Badan (kg)", "berat_badan"],
      ["Lingkar Kepala (cm)", "lingkar_kepala"], ["Jarak Rumah ke Sekolah (km)", "jarak_sekolah"],
      ["Waktu Tempuh ke Sekolah (menit)", "waktu_tempuh"], ["Anak ke-", "anak_ke"],
      ["Jumlah Saudara Kandung", "jumlah_saudara"]
    ].forEach(([label, name]) => addLine(lines, label, getValue(name)));

    lines.push("", "*F. DATA PRESTASI*");
    if (list.children.length === 0) {
      lines.push("Tidak ada prestasi yang dicantumkan.");
    } else {
      [...list.children].forEach((card, index) => {
        const vals = [...card.querySelectorAll("input, select")].map(el => (el.value || "").trim());
        const labels = ["Jenis", "Tingkat", "Nama Prestasi", "Tahun", "Penyelenggaraan"];
        const present = vals.map((v, i) => v ? `${labels[i]}: ${v}` : "").filter(Boolean);
        if (present.length) lines.push(`Prestasi ${index + 1}`, ...present);
      });
    }
    lines.push("", "Pernyataan: Saya menyatakan bahwa data yang diisi benar.");
    lines.push("", "Mohon bantuan admin untuk menindaklanjuti pendaftaran santri baru ini.");
    return lines.join("\n");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = makeMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  addButton.addEventListener("click", addAchievement);
  addAchievement();
})();