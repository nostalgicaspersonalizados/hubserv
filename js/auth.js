import { auth } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initAuth() {
    const btnLogin = document.getElementById('btn-login');
    const btnGoogle = document.getElementById('btn-google'); // Adicionado para suportar o botão do seu HTML

    // 1. Login com E-mail e Senha
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
                if (error.code === 'auth/invalid-credential') {
                    alert("E-mail ou senha incorretos.");
                } else if (error.code === 'auth/user-not-found') {
                    alert("Usuário não cadastrado.");
                } else if (error.code === 'auth/wrong-password') {
                    alert("Senha incorreta.");
                } else {
                    alert("Erro do Firebase: " + error.message);
                }
            }
        };
    }

    // 2. Login com Google (Necessário para o seu botão btn-google funcionar)
    if (btnGoogle) {
        btnGoogle.onclick = async () => {
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
                console.log("Login com Google realizado com sucesso.");
            } catch (error) {
                console.error("Erro Google Login:", error.message);
                alert("Erro ao entrar com Google.");
            }
        };
    }

    // 3. Observador de Estado (Controla a visibilidade do App)
    onAuthStateChanged(auth, (user) => {
        const overlay = document.getElementById('auth-overlay');
        const appContent = document.getElementById('app-content');

        if (user) {
            console.log("✅ Login detectado para:", user.email);
            
            // Variáveis globais para uso nos outros módulos (PDV, Calculadora)
            window.userUid = user.uid;
            window.userPlan = 'pro'; 

            if (overlay && appContent) {
                overlay.style.display = 'none'; // Esconde o login
                appContent.style.display = 'grid'; // Mostra o sistema conforme seu CSS app-grid
                
                // Atualiza o nome do usuário na sidebar se os elementos existirem
                const userNameEl = document.getElementById('user-name');
                if (userNameEl) {
                    userNameEl.innerText = user.displayName || user.email.split('@')[0];
                }

                // Força a abertura da primeira aba (Dashboard)
                if (typeof window.tab === 'function') {
                    window.tab('dash');
                }
            }
        } else {
            console.log("❌ Nenhum usuário logado.");
            if (overlay) overlay.style.display = 'flex';
            if (appContent) appContent.style.display = 'none';
        }
    });

    // 4. Lógica de Logout (Para o botão btn-logout da sua sidebar)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = async () => {
            try {
                await auth.signOut();
                console.log("Usuário deslogado.");
            } catch (error) {
                console.error("Erro ao deslogar:", error);
            }
        };
    }
}
