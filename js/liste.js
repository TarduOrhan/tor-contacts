// liste.js
import { db } from './config.js';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc,where } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const contactsTableBody = document.getElementById('contacts-table-body');
const nameFilterInput = document.getElementById('name-filter');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editNameInput = document.getElementById('edit-name');
const editNumberInput = document.getElementById('edit-number');

// Tabloda veriyi göstermek için fonksiyon
const renderContactTable = (data, id) => {
    const html = `
        <tr data-id="${id}">
            <td>${data.name}</td>
            <td>${data.number}</td>
            <td><button class="edit-btn" data-id="${id}">Düzenle</button></td>
        </tr>
    `;
    contactsTableBody.innerHTML += html;
};

// Firestore'dan verileri çekmek ve sıralamak
const loadContacts = async (nameFilter = '') => {
    try {
        // Firestore sorgusu oluştur
        const contactsRef = collection(db, 'contacts');
        let q = query(contactsRef);

        // Eğer nameFilter varsa, name alanına göre filtrele
        if (nameFilter !== '') {
          //  q = query(contactsRef, where('name', '==', 'nisa'));
          //  q = query(contactsRef, where('name', '>=', 'orhan').where('name', '<=', 'nisa'+'\uf8ff'));
            q =query(contactsRef, where("name", ">=", nameFilter), where("name", "<=", nameFilter));

        } else {
            // Varsa sıralamayı ekle
            q = query(contactsRef, orderBy('name'));
        }

        // Firestore'dan verileri al
        const snapshot = await getDocs(q);
        contactsTableBody.innerHTML = ''; // Tabloyu temizle

        snapshot.forEach(doc => {
            renderContactTable(doc.data(), doc.id);
        });

        // Düzenle butonlarına tıklama olaylarını ekleyin
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });

    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
};


// Düzenle butonuna tıklama işlemi
const handleEdit = async (event) => {
    const id = event.target.getAttribute('data-id');
    try {
        // Belgeyi Firestore'dan al
        const docRef = doc(db, 'contacts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Form alanlarını doldur
            editIdInput.value = id;
            editNameInput.value = data.name;
            editNumberInput.value = data.number;
            // Modalı aç
            const instance = M.Modal.getInstance(editModal);
            instance.open();
        } else {
            console.log('Belge bulunamadı');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
};


// Form gönderildiğinde verileri güncelle
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = editIdInput.value;
    const newName = editNameInput.value;
    const newNumber = editNumberInput.value;
    // Firestore'da belgeyi güncelle
    const docRef = doc(db, 'contacts', id);
    await updateDoc(docRef, {
        name: newName,
        number: newNumber
    });
    // Modalı kapat
    const instance = M.Modal.getInstance(editModal);
    instance.close();
    // Formu temizle
    editIdInput.value = '';
    editNameInput.value = '';
    editNumberInput.value = '';
    loadContacts();
});

// Sayfa yüklendiğinde verileri yüklemek
window.addEventListener('DOMContentLoaded', () => {
    loadContacts(); // İlk yükleme

    // nameFilterInput dinleyici
    nameFilterInput.addEventListener('input', () => {
        const nameFilterValue = nameFilterInput.value.trim();
        loadContacts(nameFilterValue);
    });
});
