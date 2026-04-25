import { initAuth } from './auth.js';

// Inicialização imediata do sistema de segurança
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    console.log("Nostálgicas Hub Pro: Sistema inicializado com sucesso.");
});

// Navegação de Abas (Global para ser chamada pelo HTML)
window.tab = async (id) => {
    // UI: Gerenciar visual das abas e botões da sidebar
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('tab-' + id);
    const navBtn = document.querySelector(`[onclick="tab('${id}')"]`);
    
    if (target) target.style.display = 'block';
    if (navBtn) navBtn.classList.add('active');

    // Carregamento dinâmico de lógica para otimizar performance (SaaS)
    switch(id) {
        case 'dash':
            const { dashboard } = await import('./dashboard.js');
            dashboard.atualizar();
            break;
        case 'calc':
            const { calculadora } = await import('./calculadora.js');
            calculadora.init();
            break;
        case 'pdv':
            const { pdv } = await import('./pdv.js');
            pdv.init();
            break;
    }
};

// Listener Global de Cliques para Ações Rápidas
document.addEventListener('click', async (e) => {
    // Gatilho da Calculadora
    if (e.target.id === 'btn-calc') {
        const { calculadora } = await import('./calculadora.js');
        calculadora.calcular();
    }

    // Gatilho para Salvar Cálculo (Firebase)
    if (e.target.id === 'btn-save-calc') {
        const { calculadora } = await import('./calculadora.js');
        const data = calculadora.calcular(); // Pega o payload pronto
        if (data) {
            console.log("Enviando para Firebase:", data);
            // Aqui entrará a função de persistência: db.save('calculos', data);
        }
    }

    // Lógica do PDV: Adicionar ao Carrinho
    if (e.target.id === 'btn-add-item') {
        const { pdv } = await import('./pdv.js');
        const nome = document.getElementById('p-item-nome').value;
        const valor = document.getElementById('p-item-valor').value;
        if (nome && valor) {
            pdv.adicionarItem(nome, valor);
            // Limpa campos após adicionar
            document.getElementById('p-item-nome').value = '';
            document.getElementById('p-item-valor').value = '';
        } else {
            alert("Preencha o nome e o valor do produto.");
        }
    }

    // Finalizar Venda no PDV
    if (e.target.id === 'btn-finish-sale') {
        const { pdv } = await import('./pdv.js');
        pdv.fecharVenda();
    }
});
