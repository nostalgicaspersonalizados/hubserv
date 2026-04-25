import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initAuth() {
    const btnLogin = document.getElementById('btn-login');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-pass');
    const errorMsg = document.getElementById('auth-error');

    if (btnLogin) {
        btnLogin.onclick = async () => {
            const email = emailInput.value;
            const pass = passInput.value;
            
            try {
                await signInWithEmailAndPassword(auth, email, pass);
            } catch (error) {
                console.error("Erro no login:", error.code);
                errorMsg.innerText = "E-mail ou senha incorretos.";
            }
        };
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById('auth-overlay').style.display = 'none';
            document.querySelector('.app-container').style.display = 'flex';
            document.getElementById('user-name').innerText = user.email.split('@')[0];
            
            // Verifica o plano no Firestore
            const userRef = doc(db, "usuarios", user.uid);
            const snap = await getDoc(userRef);
            window.userPlano = snap.exists() ? snap.data().plano : "free";
            document.getElementById('user-plan').innerText = window.userPlano.toUpperCase();
        } else {
            document.getElementById('auth-overlay').style.display = 'flex';
            document.querySelector('.app-container').style.display = 'none';
        }
    });
}
