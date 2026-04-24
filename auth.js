import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// 1. CONFIGURAÇÃO (Substitua pelos seus dados se necessário)
const firebaseConfig = {
    apiKey: "AIzaSyB16iMJr1wKOfijoFCuClRKIP05CHdE9q4",
    authDomain: "nostalgicashub.firebaseapp.com",
    projectId: "nostalgicashub",
    storageBucket: "nostalgicashub.firebasestorage.app",
    messagingSenderId: "542069933172",
    appId: "1:542069933172:web:0c71e8737e6c4545e5bd21"
};

// 2. INICIALIZAÇÃO
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. FUNÇÕES GLOBAIS (Expostas para o HTML via window)
window.handleAuth = (modo) => {
    const email = document.getElementById('auth-email').value;
    const senha = document.getElementById('auth-senha').value;
    const msg = document.getElementById('auth-msg');

    if (!email || !senha) {
        msg.innerText = "Preencha todos os campos.";
        return;
    }

    if (modo === 'login') {
        signInWithEmailAndPassword(auth, email, senha)
            .then(() => msg.innerText = "")
            .catch(error => {
                console.error(error);
                msg.innerText = "Erro ao entrar: Verifique e-mail e senha.";
            });
    }
};

window.logout = () => {
    signOut(auth).then(() => {
        location.reload(); // Recarrega para limpar o estado do sistema
    });
};

// 4. OBSERVADOR DE ESTADO
// Isso controla se a tela de login aparece ou some
onAuthStateChanged(auth, (user) => {
    const authScreen = document.getElementById('auth-screen');
    if (user) {
        authScreen.style.display = 'none';
        console.log("Usuário logado:", user.email);
    } else {
        authScreen.style.display = 'flex';
    }
});