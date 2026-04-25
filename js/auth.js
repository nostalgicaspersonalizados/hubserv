import { auth, provider, db } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initAuth() {
    document.getElementById('btn-google').onclick = () => signInWithPopup(auth, provider);
    document.getElementById('btn-logout').onclick = () => signOut(auth).then(() => location.reload());

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById('auth-overlay').style.display = 'none';
            document.querySelector('.app-container').style.display = 'flex';
            document.getElementById('user-name').innerText = user.displayName;
            
            const userRef = doc(db, "usuarios", user.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                await setDoc(userRef, { nome: user.displayName, plano: "free", criadoEm: new Date() });
            }
            const plano = snap.exists() ? snap.data().plano : "free";
            document.getElementById('user-plan').innerText = plano.toUpperCase();
            window.userPlano = plano; // Variável global para controle de funções
        }
    });
}