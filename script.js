// Tema dan sinkronisasi
let currentTheme = localStorage.getItem('theme') || 'white';
changeTheme(currentTheme);

function changeTheme(theme) {
    if (theme === 'pink') {
        document.documentElement.style.setProperty('--bg-color', '#FFABAB');
        document.documentElement.style.setProperty('--font-color', '#0B192C ');
    } else if (theme === 'white') {
        document.documentElement.style.setProperty('--bg-color', '#ffffff');
        document.documentElement.style.setProperty('--font-color', '#FFABAB');
    } else if (theme === 'black') {
        document.documentElement.style.setProperty('--bg-color', '#000000');
        document.documentElement.style.setProperty('--font-color', '#ffd700');
        const encryptionKey = 'your-secret-key'; // Kunci enkripsi (jangan ubah untuk konsistensi)

        // Fungsi untuk mengenkripsi catatan
        function encryptNote(content) {
            return CryptoJS.AES.encrypt(content, encryptionKey).toString();
        }

        // Fungsi untuk mendekripsi catatan
        function decryptNote(encryptedContent) {
            const bytes = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }

    }
    localStorage.setItem('theme', theme); // Simpan tema
}

// Menampilkan daftar catatan dengan ikon kertas untuk opsi tambahan
function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note-item');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.date}</p> <!-- Tanggal pembuatan ditampilkan -->
            <div class="note-actions">
                <button onclick="viewNote(${index})">see notes </button>
                <button onclick="confirmDelete(${index})">🗑️</button>
                <!-- Ikon kertas untuk membuka pop-up -->
                <img src="paper-icon.png" alt="⤴️" class="icon-paper" onclick="showNoteOptions(${index})" />
            </div>
        `;
        noteList.appendChild(noteDiv);
    });
}

// Menampilkan dialog konfirmasi hapus catatan
function confirmDelete(index) {
    if (confirm("ARE U SURE DELETE THIS MESSAGE?")) {
        deleteNote(index);
    }
}

// Hapus catatan
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1); // Hapus catatan
    localStorage.setItem('notes', JSON.stringify(notes)); // Simpan perubahan
    displayNotes(); // Update daftar
}

// Menyimpan catatan
function saveNote() {
    const title = document.getElementById('note-title').innerText;
    const content = document.getElementById('note-content').innerText;
    const date = new Date().toLocaleString(); // Catat dan waktu pembuatan

    if (title && content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({ title, content, date }); // Simpan catatan beserta tanggal
        localStorage.setItem('notes', JSON.stringify(notes));
        alert('SAVED!!');
        window.location.href = 'index.html'; // Kembali ke daftar
    } else {
        alert('Judul dan catatan tidak boleh kosong!');
    }
}

// Menghitung jumlah karakter
function updateCharacterCount() {
    const content = document.getElementById('note-content').innerText;
    document.getElementById('charCount').innerText = `Jumlah Karakter: ${content.length}`;
}

// Melihat catatan
function viewNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    if (note) {
        alert(`Judul: ${note.title}\n\nIsi: ${note.content}`);
    }
}

// Sinkronisasi tema pada halaman penulisan
function saveNote() {
    const title = document.getElementById('note-title').innerText;
    const content = document.getElementById('note-content').innerText;
    const date = new Date().toLocaleString(); // Catat tanggal dan waktu pembuatan

    if (title && content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const encryptedContent = encryptNote(content); // Enkripsi konten catatan
        notes.push({ title, content: encryptedContent, date }); // Simpan catatan ter-enkripsi
        localStorage.setItem('notes', JSON.stringify(notes));
        alert('SAVED!!');
        window.location.href = 'index.html'; // Kembali ke daftar
    } else {
        alert('Judul dan catatan tidak boleh kosong!');
    }
}

function syncThemeOnLoad() {
    const theme = localStorage.getItem('theme') || 'white';
    changeTheme(theme);
}

// Menampilkan tanggal dan waktu saat ini
function setDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const today = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = today.toLocaleDateString(undefined, dateOptions);
    timeElement.innerText = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

window.onload = () => {
    displayNotes(); // Panggil fungsi untuk menampilkan catatan 
    function viewNote(index) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes[index];

        if (note) {
            const decryptedContent = decryptNote(note.content); // Dekripsi konten
            alert(`Judul: ${note.title}\n\nIsi: ${decryptedContent}`);
        }
    }

    setDateTime(); // Panggil fungsi untuk mengatur tanggal dan waktu
    syncThemeOnLoad(); // Panggil fungsi untuk sinkronisasi tema
};

// Fungsi untuk menampilkan pop-up dengan pilihan Share dan Cetak PDF
function showNoteOptions(index) {
    const popUpDiv = document.createElement('div');
    popUpDiv.classList.add('popup');

    popUpDiv.innerHTML = `
        <div class="popup-content">
            <h3>Pilihan Catatan</h3>
            <button onclick="shareNoteWhatsApp(${index})">Share ke WhatsApp</button>
            <button onclick="printNoteToPDF(${index})">Cetak ke PDF</button>
            <button onclick="closePopUp(this)">Tutup</button>
        </div>
    `;

    document.body.appendChild(popUpDiv);
}

// Fungsi untuk menutup pop-up
function closePopUp(button) {
    const popUpDiv = button.closest('.popup');
    document.body.removeChild(popUpDiv);
}

// Fungsi Share ke WhatsApp dalam bentuk file .txt
function shareNoteWhatsApp(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    if (note) {
        const textContent = `Judul: ${note.title}\n\nIsi: ${note.content}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textContent)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Fungsi Print catatan ke PDF
function printNoteToPDF(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    if (note) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head><title>${note.title}</title></head>
            <body>
                <h1>${note.title}</h1>
                <p>${note.date}</p>
                <div>${note.content}</div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Fungsi untuk mengimpor folder
async function importFolder() {
    try {
        const folderHandle = await window.showDirectoryPicker(); // Meminta akses ke folder

        for await (const entry of folderHandle.values()) {
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                const reader = new FileReader();

                reader.onload = function(e) {
                    console.log("File content:", e.target.result);
                    // Di sini, kamu bisa menambahkan logika untuk menangani konten file
                    alert(`File "${file.name}" berhasil diimpor!`);
                };

                reader.readAsText(file); // Membaca konten file
            }
        }
    } catch (error) {
        console.error("Gagal mengimpor folder:", error);
    }
}

// Fungsi untuk menampilkan file dalam daftar catatan dan membuka file jika formatnya sesuai
async function importFolder() {
    try {
        const folderHandle = await window.showDirectoryPicker(); // Meminta akses ke folder
        const notes = JSON.parse(localStorage.getItem('notes')) || []; // Mengambil catatan yang ada

        for await (const entry of folderHandle.values()) {
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                const fileExtension = file.name.split('.').pop().toLowerCase(); // Mendapatkan ekstensi file

                // Cek apakah file berformat doc, pdf, atau txt
                if (['doc', 'docx', 'pdf', 'txt'].includes(fileExtension)) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        const content = e.target.result;

                        // Simpan file sebagai catatan baru di localStorage
                        notes.push({
                            title: file.name,
                            content: content,
                            date: new Date().toLocaleString(),
                            type: fileExtension // Tambahkan tipe file untuk penanganan pembukaan nanti
                        });
                        localStorage.setItem('notes', JSON.stringify(notes)); // Simpan catatan
                        displayNotes(); // Tampilkan ulang catatan
                    };

                    if (fileExtension === 'txt') {
                        reader.readAsText(file); // Membaca file txt
                    } else {
                        reader.readAsArrayBuffer(file); // Membaca file non-txt sebagai array buffer
                    }
                } else {
                    alert(`File "${file.name}" tidak berformat doc, docx, pdf, atau txt, tidak diimpor.`);
                }
            }
        }
    } catch (error) {
        console.error("Gagal mengimpor folder:", error);
    }
}

// Modifikasi fungsi viewNote untuk membuka catatan yang diimpor dari folder
function viewNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];

    if (note) {
        if (note.type === 'txt') {
            // Tampilkan isi file txt
            alert(`Judul: ${note.title}\n\nIsi: ${note.content}`);
        } else if (['pdf', 'doc', 'docx'].includes(note.type)) {
            const blob = new Blob([note.content], { type: note.type === 'pdf' ? 'application/pdf' : 'application/msword' });
            const fileUrl = URL.createObjectURL(blob);
            window.open(fileUrl); // Membuka file pdf/doc di tab baru
        } else {
            alert(`File ${note.title} tidak dapat dibuka.`);
        }
    }
}