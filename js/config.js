import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCv3tIviErT_DEv3dpwree6Uf94tS4XQtM",
    authDomain: "pk-contacts-dbtor.firebaseapp.com",
    projectId: "pk-contacts-dbtor",
    storageBucket: "pk-contacts-dbtor.appspot.com",
    messagingSenderId: "148846768423",
    appId: "1:148846768423:web:076457584452cabadab902"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };