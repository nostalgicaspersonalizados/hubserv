import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// 1. CONFIGURAÇÃO
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

// 3. FUNÇÕES GLOBAIS
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
        // Remove a classe de logado antes de recarregar
        document.body.classList.remove('logged-in');
        location.reload(); 
    });
};

// 4. OBSERVADOR DE ESTADO (Onde a mágica acontece)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ADICIONA a classe que mostra a sidebar e o main (conforme o novo CSS)
        document.body.classList.add('logged-in');
        console.log("Acesso liberado:", user.email);
    } else {
        // REMOVE a classe caso não esteja logado
        document.body.classList.remove('logged-in');
    }
});
