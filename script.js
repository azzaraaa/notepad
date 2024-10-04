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