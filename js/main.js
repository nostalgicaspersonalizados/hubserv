import { initAuth } from './auth.js';

// Inicializa a autenticação IMEDIATAMENTE
console.log("Tentando iniciar Autenticação...");
initAuth();

// Função de trocar abas (Global)
window.tab = async (id) => {
    // Esconde tudo
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    // Mostra a certa
    const target = document.getElementById('tab-' + id);
    if (target) target.classList.add('ativa');

    // Carrega módulos apenas quando necessário (Evita o erro 404 de travar o login)
    if (id === 'dash') {
        const mod = await import('./dashboard.js').catch(e => console.error("Erro no Dash:", e));
        if (mod) mod.dashboard.atualizar();
    }
    if (id === 'calc') {
        await import('./calculadora.js').catch(e => console.error("Erro na Calc:", e));
    }
};

// Configura botões de clique (com proteção contra erro)
document.addEventListener('click', async (e) => {
    if (e.target.id === 'btn-calc') {
        const mod = await import('./calculadora.js');
        mod.calculadora.calcular();
    }
    if (e.target.id === 'btn-pdf') {
        const mod = await import('./fotos.js');
        if (window.userPlano === 'pro') mod.fotos.exportarPDF();
        else alert("Apenas no Plano PRO");
    }
});

console.log("🚀 Main carregado. Se a tela não sumir ao logar, o erro está no auth.js");
