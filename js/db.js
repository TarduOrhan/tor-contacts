// db.js
import { db } from './config.js';

// Real-time listener
import { collection, onSnapshot, addDoc, deleteDoc,getDocs, doc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


enableIndexedDbPersistence(db)
      .then(() => console.log("Enabled offline persistence"))
      .catch((error) => {
        if (error.code == "failed-precondition") {
          console.error("Persistence failed: Multiple tabs open");
        } else if (error.code == "unimplemented") {
          console.error("Persistence is not available: Browser does not support");
        }
      });
const contactsRef = collection(db, 'contacts');

onSnapshot(contactsRef, snapshot => {
    snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        if (change.type === 'added') {
            renderContact(data, id);
        } else if (change.type === 'removed') {
            removeContact(id);
        }
    });
});

// Add new contact
const form = document.querySelector('.add-contact');

form.addEventListener('submit', async evt => {
    evt.preventDefault();

    const contact = {
        name: form.elements['name'].value,
        number: form.elements['number'].value
    };

    try {
        await addDoc(contactsRef, contact);
        console.log('Contact added:', contact);
        form.reset();
    } catch (err) {
        console.error('Error adding contact:', err);
    }
});

// Delete function

const removeContact = (id) => {
    const contactElement = document.querySelector(`.pk-contact[data-id="${id}"]`);
    console.log(`Trying to remove contact with ID: ${id}`);
    if (contactElement) {
        console.log(`Found contact element: `, contactElement);
        contactElement.remove();
        console.log("Contact removed:", id);
    } else {
        console.error(`Contact with ID ${id} not found.`);
    }
};

const contactContainer = document.querySelector('.contacts');

contactContainer.addEventListener('click', async evt => {
    if (evt.target.tagName === 'I' && evt.target.getAttribute('data-id')) {
        const id = evt.target.getAttribute('data-id');
        await deleteContact(id);
        
    }
});

async function deleteContact(contactId) {
    if (confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) {
        try {
            await deleteDoc(doc(db, 'contacts', contactId));
            console.log('Contact deleted:', contactId);

            // DOM'dan öğeyi kaldır
            removeContact(contactId);
        } catch (err) {
            console.error('Error deleting contact:', err);
        }
    }
}

//Veri okuma 
const querySnapshot = await getDocs(collection(db, "contacts"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
