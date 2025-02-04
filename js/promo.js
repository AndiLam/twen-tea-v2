// Ambil elemen form dan tombol
const form = document.getElementById('promoForm');
const updateButton = document.getElementById('updateButton');

// Tambahkan event listener ke tombol submit
updateButton.addEventListener('click', () => {
    // Ambil nilai dari form
    const highCategory = document.getElementById('high-category').value;
    const lowCategory = document.getElementById('low-category').value;

    // Buat objek data
    const formData = {
        highCategory: highCategory,
        lowCategory: lowCategory
    };

    // Simpan data ke localStorage
    localStorage.setItem('formData', JSON.stringify(formData));

    // alert('Data berhasil disimpan ke localStorage!');
});

// Fungsi untuk memuat data dari localStorage saat halaman dimuat
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('high-category').value = formData.highCategory;
        document.getElementById('low-category').value = formData.lowCategory;
        // alert('Data berhasil dimuat dari localStorage!');
    }
});