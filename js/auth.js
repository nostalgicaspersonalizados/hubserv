import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initAuth() {
    const btnLogin = document.getElementById('btn-login');
    
    if (btnLogin) {
        btnLogin.onclick = async () => {
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-pass').value.trim();

            if (!email || !pass) {
                alert("Por favor, preencha e-mail e senha!");
                return;
            }

            try {
                console.log("Tentando conexão com Firebase...");
                await signInWithEmailAndPassword(auth, email, pass);
                alert("Sucesso! Entrando no sistema...");
            } catch (error) {
                console.error("Erro detalhado:", error.code);
                // ALERTAS DE ERRO COMUNS
                if (error.code === 'auth/invalid-credential') alert("E-mail ou senha incorretos.");
                else if (error.code === 'auth/user-not-found') alert("Usuário não cadastrado.");
                else alert("Erro do Firebase: " + error.message);
            }
        };
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('auth-overlay').style.display = 'none';
            document.querySelector('.app-container').style.display = 'flex';
        }
    });
}
