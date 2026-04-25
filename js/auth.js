import { auth } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initAuth() {
    const btnLogin = document.getElementById('btn-login');
    const btnGoogle = document.getElementById('btn-google');
    const btnLogout = document.getElementById('btn-logout');

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

    // 2. Login com Google
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

    // 3. Observador de Estado (Controla o Acesso e o Selo PRO)
    onAuthStateChanged(auth, (user) => {
        const overlay = document.getElementById('auth-overlay');
        const appContent = document.getElementById('app-content');
        const userBadge = document.getElementById('user-plan-badge');

        if (user) {
            console.log("✅ Login detectado para:", user.email);
            
            // Define permissões globais para liberar as ferramentas (Calculadora, BG Remover, etc)
            window.userUid = user.uid;
            window.userPlan = 'pro'; 

            // Atualiza a Interface do Usuário
            if (overlay && appContent) {
                overlay.style.display = 'none';
                appContent.style.display = 'grid';
                
                // Nome do usuário
                const userNameEl = document.getElementById('user-name');
                if (userNameEl) {
                    userNameEl.innerText = user.displayName || user.email.split('@')[0];
                }

                // Corrige o selo de "FREE" para "PRO"
                if (userBadge) {
                    userBadge.innerText = "PRO";
                    userBadge.style.background = "var(--success)"; // Garante a cor verde de sucesso
                }

                // Força a abertura da aba inicial
                if (typeof window.tab === 'function') {
                    window.tab('dash');
                }
            }
        } else {
            console.log("❌ Nenhum usuário logado.");
            window.userUid = null;
            window.userPlan = 'free';

            if (overlay) overlay.style.display = 'flex';
            if (appContent) appContent.style.display = 'none';
        }
    });

    // 4. Lógica de Logout
    if (btnLogout) {
        btnLogout.onclick = async () => {
            try {
                await signOut(auth);
                console.log("Usuário deslogado.");
                location.reload(); // Recarrega para garantir limpeza de cache/estado
            } catch (error) {
                console.error("Erro ao deslogar:", error);
            }
        };
    }
}
