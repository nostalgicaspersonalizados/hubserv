import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // PEGUE NO CONSOLE DO FIREBASE
  authDomain: "nostalgicaspersonalizados.firebaseapp.com",
  projectId: "nostalgicaspersonalizados",
  storageBucket: "nostalgicaspersonalizados.appspot.com",
  messagingSenderId: "542069933172",
  appId: "1:542069933172:web:0c71e8737e6c4545e5bd21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Conectado ao Firebase Nostálgicas");
export { db };
