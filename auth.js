import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB16iMJr1wKOfijoFCuClRKIP05CHdE9q4",
  authDomain: "nostalgicashub.firebaseapp.com",
  databaseURL: "https://nostalgicashub-default-rtdb.firebaseio.com",
  projectId: "nostalgicashub",
  storageBucket: "nostalgicashub.firebasestorage.app",
  messagingSenderId: "542069933172",
  appId: "1:542069933172:web:0c71e8737e6c4545e5bd21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase Nostálgicas Conectado com Sucesso!");
export { db };
