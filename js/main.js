import { initAuth } from './auth.js';

console.log("Sistema Nostálgicas Hub Iniciado!");

try {
    initAuth();
} catch (error) {
    console.error("Erro ao iniciar autenticação:", error);
}

// Função global de navegação (Tab)
window.tab = (id) => {
    const tabs = document.querySelectorAll('.tab');
    const btns = document.querySelectorAll('.nav-item');
    
    tabs.forEach(t => t.classList.remove('ativa'));
    btns.forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + id);
    if (targetTab) targetTab.classList.add('ativa');
};
