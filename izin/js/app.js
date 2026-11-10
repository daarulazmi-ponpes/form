document.addEventListener('DOMContentLoaded', () => {
    const selectKelas = document.getElementById('kelasSantri');
    const selectPenerima = document.getElementById('pilihPenerima');
    const selectJenisIzin = document.getElementById('jenisIzin');
    const inputNomorDisplay = document.getElementById('nomorTujuanDisplay');
    const form = document.getElementById('formIzinSantri');
    const hintIzinHarian = document.getElementById('hintIzinHarian');

    // Elemen Modal Konfirmasi
    const modalKonfirmasi = document.getElementById('modalKonfirmasi');
    const btnPrint = document.getElementById('btnPrint');
    const btnPrintModal = document.getElementById('btnPrintModal');
    const btnBukaWA = document.getElementById('btnBukaWA');
    const btnTutupModal = document.getElementById('btnTutupModal');

    // Variabel untuk menyimpan data pengajuan sementara
    let pendingWaUrl = '';
    let pendingData = null;

    // 1. Load Opsi Kelas dari config.js secara dinamis
    function initKelasOptions() {
        if (typeof DATA_WA === 'undefined') {
            console.error('DATA_WA tidak ditemukan di config.js!');
            return;
        }

        for (const kelas in DATA_WA) {
            const option = document.createElement('option');
            option.value = kelas;
            option.textContent = kelas;
            selectKelas.appendChild(option);
        }
    }

    // 2. Event Listener Perubahan Jenis Izin -> Tampilkan Hint Izin Harian
    selectJenisIzin.addEventListener('change', () => {
        if (selectJenisIzin.value === 'Izin keluar harian') {
            hintIzinHarian.style.display = 'flex';
        } else {
            hintIzinHarian.style.display = 'none';
        }
    });

    // 3. Event Listener Perubahan Kelas -> Mengisi Pilihan Penerima
    selectKelas.addEventListener('change', () => {
        const kelasTerpilih = selectKelas.value;

        // Reset pilihan penerima
        selectPenerima.innerHTML = '<option value="">-- Pilih Penerima --</option>';
        inputNomorDisplay.value = '';

        if (kelasTerpilih && DATA_WA[kelasTerpilih]) {
            selectPenerima.disabled = false;
            const petugasList = DATA_WA[kelasTerpilih];

            for (const jabatan in petugasList) {
                const opt = document.createElement('option');
                opt.value = jabatan;
                opt.textContent = `${jabatan} (${petugasList[jabatan]})`;
                selectPenerima.appendChild(opt);
            }
        } else {
            selectPenerima.disabled = true;
            selectPenerima.innerHTML = '<option value="">-- Pilih kelas terlebih dahulu --</option>';
        }
    });

    // 4. Event Listener Perubahan Penerima -> Menampilkan Nomor WhatsApp Tujuan
    selectPenerima.addEventListener('change', () => {
        const kelasTerpilih = selectKelas.value;
        const penerimaTerpilih = selectPenerima.value;

        if (kelasTerpilih && penerimaTerpilih && DATA_WA[kelasTerpilih][penerimaTerpilih]) {
            inputNomorDisplay.value = '+' + DATA_WA[kelasTerpilih][penerimaTerpilih];
        } else {
            inputNomorDisplay.value = '';
        }
    });

    // 5. Generate Nomor Referensi Unik (DAZ-YYYYMMDD-XXX)
    function generateRefNumber() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const serial = String(Math.floor(Math.random() * 900) + 100); // 100-999
        return `DAZ-${yyyy}${mm}${dd}-${serial}`;
    }

    // 6. Format Tanggal untuk Tampilan
    function formatDateDisplay(dateStr) {
        if (!dateStr) return '-';
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const d = new Date(dateStr);
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    // 7. Tampilkan Modal Konfirmasi Bukti Pengajuan
    function showConfirmationModal(data, waUrl) {
        pendingWaUrl = waUrl;
        pendingData = data;

        const refNumber = generateRefNumber();
        document.getElementById('receiptRef').textContent = refNumber;
        document.getElementById('receiptTanggal').textContent = formatDateDisplay(new Date().toISOString().split('T')[0]);
        document.getElementById('receiptNama').textContent = data.namaSantri;
        document.getElementById('receiptKelas').textContent = data.kelasSantri;
        document.getElementById('receiptJenis').textContent = data.jenisIzin;
        document.getElementById('receiptPenerima').textContent = `${data.penerimaJabatan} (${data.kelasSantri})`;

        modalKonfirmasi.style.display = 'flex';
    }

    // 8. Sembunyikan Modal
    function hideModal() {
        modalKonfirmasi.style.display = 'none';
    }

    // 9. Event Listener Tombol Cetak (di form)
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // 10. Event Listener Tombol Cetak di Modal
    btnPrintModal.addEventListener('click', () => {
        window.print();
    });

    // 11. Event Listener Tombol Buka WhatsApp di Modal
    btnBukaWA.addEventListener('click', () => {
        if (pendingWaUrl) {
            window.open(pendingWaUrl, '_blank');
            hideModal();
        }
    });

    // 12. Event Listener Tombol Tutup Modal
    btnTutupModal.addEventListener('click', () => {
        hideModal();
    });

    // 13. Tutup Modal saat Klik di Luar Card
    modalKonfirmasi.addEventListener('click', (e) => {
        if (e.target === modalKonfirmasi) {
            hideModal();
        }
    });

    // 5. Validasi Tanggal dan Jam (Mendukung izin harian / pulang-pergi di hari yang sama)
    function validateDateTime() {
        const tglBerangkat = document.getElementById('tglBerangkat').value;
        const jamBerangkat = document.getElementById('jamBerangkat').value;
        const tglKembali = document.getElementById('tglKembali').value;
        const jamKembali = document.getElementById('jamKembali').value;
        const errTglKembali = document.getElementById('err-tglKembali');

        if (!tglBerangkat || !tglKembali) return true;

        const dateBerangkat = new Date(tglBerangkat);
        const dateKembali = new Date(tglKembali);

        if (dateKembali < dateBerangkat) {
            errTglKembali.textContent = "Tanggal kembali tidak boleh lebih awal dari keberangkatan.";
            errTglKembali.style.display = "block";
            return false;
        }

        // Jika tanggal sama (izin harian / tidak menginap), cek jamnya
        if (dateKembali.getTime() === dateBerangkat.getTime() && jamBerangkat && jamKembali) {
            if (jamKembali <= jamBerangkat) {
                errTglKembali.textContent = "Untuk izin di hari yang sama, jam kembali harus setelah jam keberangkatan.";
                errTglKembali.style.display = "block";
                return false;
            }
        }

        errTglKembali.style.display = "none";
        return true;
    }

    ['tglBerangkat', 'jamBerangkat', 'tglKembali', 'jamKembali'].forEach(id => {
        document.getElementById(id).addEventListener('change', validateDateTime);
    });

    // 6. Penanganan Submit & Validasi Form
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validasi field wajib HTML5 & Kustom
        let isValid = true;

        // Validasi input standar bertipe required
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const errEl = document.getElementById(`err-${field.id}`);
            if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
                field.classList.add('error');
                if (errEl) errEl.style.display = 'block';
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errEl && field.type !== 'checkbox') errEl.style.display = 'none';
            }
        });

        // Validasi khusus tanggal & jam
        if (!validateDateTime()) {
            isValid = false;
        }

        if (!isValid) {
            // Scroll ke elemen error pertama
            const firstError = form.querySelector('.error, input:invalid, select:invalid, textarea:invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Ambil Nilai Form
        const data = {
            namaSantri: document.getElementById('namaSantri').value.trim(),
            kelasSantri: selectKelas.value,
            kamarSantri: document.getElementById('kamarSantri').value.trim() || '-',
            namaWali: document.getElementById('namaWali').value.trim(),
            noWaWali: document.getElementById('noWaWali').value.trim(),
            jenisIzin: document.getElementById('jenisIzin').value,
            tglBerangkat: document.getElementById('tglBerangkat').value,
            jamBerangkat: document.getElementById('jamBerangkat').value,
            tglKembali: document.getElementById('tglKembali').value,
            jamKembali: document.getElementById('jamKembali').value,
            alamatTujuan: document.getElementById('alamatTujuan').value.trim(),
            alasanIzin: document.getElementById('alasanIzin').value.trim(),
            namaPenjemput: document.getElementById('namaPenjemput').value.trim(),
            hubunganPenjemput: document.getElementById('hubunganPenjemput').value.trim(),
            jenisTransportasi: document.getElementById('jenisTransportasi').value,
            ketKendaraan: document.getElementById('ketKendaraan').value.trim() || '-',
            penerimaJabatan: selectPenerima.value
        };

        const nomorTujuan = DATA_WA[data.kelasSantri][data.penerimaJabatan];

        // Susun Pesan WhatsApp
        const pesan =
            `PENGAJUAN IZIN SANTRI
PONDOK PESANTREN DAARUL AZMI

A. IDENTITAS SANTRI
Nama: ${data.namaSantri}
Kelas: ${data.kelasSantri}
Kamar/Asrama: ${data.kamarSantri}
Orang tua/Wali: ${data.namaWali}
Nomor WA wali: ${data.noWaWali}

B. JENIS DAN WAKTU IZIN
Jenis izin: ${data.jenisIzin}
Tanggal berangkat: ${data.tglBerangkat}
Jam berangkat: ${data.jamBerangkat}
Tanggal wajib kembali: ${data.tglKembali}
Jam wajib kembali: ${data.jamKembali}

C. TUJUAN DAN KEPERLUAN
Alamat tujuan: ${data.alamatTujuan}
Alasan izin: ${data.alasanIzin}

D. PENJEMPUT DAN TRANSPORTASI
Nama penjemput: ${data.namaPenjemput}
Hubungan: ${data.hubunganPenjemput}
Transportasi: ${data.jenisTransportasi}
Keterangan kendaraan: ${data.ketKendaraan}

E. KONFIRMASI
Santri: [Sudah Dinyatakan Benar]
Orang tua/Wali: [Disetujui]
Wali asuh: [Sudah Dikomunikasikan]
Keamanan: [Siap Diperiksa]

Penerima pengajuan: ${data.penerimaJabatan} (${data.kelasSantri})

Mohon pemeriksaan dan tindak lanjut sesuai prosedur perizinan pondok.

Dikirim melalui Formulir Izin Santri Daarul Azmi.`;

        // Susun URL WhatsApp
        const waUrl = `https://wa.me/${nomorTujuan}?text=${encodeURIComponent(pesan)}`;

        // Tampilkan Modal Konfirmasi Bukti Pengajuan
        showConfirmationModal(data, waUrl);
    });

    // Inisialisasi awal
    initKelasOptions();
});