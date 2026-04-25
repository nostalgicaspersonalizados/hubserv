import { initAuth } from './auth.js';

// 1. Inicialização de Segurança
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    console.log("🚀 Nostálgicas Hub Pro: Orquestrador carregado.");
});

// 2. Navegação Global entre Abas (SaaS Multi-ferramentas)
window.tab = async (id) => {
    // UI: Gerenciar classes de visualização
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('tab-' + id);
    // Seleciona o botão de navegação correspondente
    const navBtn = document.querySelector(`[onclick*="tab('${id}')"]`);
    
    if (target) target.style.display = 'block';
    if (navBtn) navBtn.classList.add('active');

    // Carregamento On-Demand (Lazy Loading) para performance
    try {
        switch(id) {
            case 'dash':
                const { dashboard } = await import('./dashboard.js');
                dashboard.atualizar();
                break;
            case 'calc':
                const { calculadora } = await import('./calculadora.js');
                if (calculadora.init) calculadora.init();
                break;
            case 'pdv':
                const { pdv } = await import('./pdv.js');
                pdv.init();
                break;
            case 'fotos':
                const { fotos } = await import('./fotos.js');
                fotos.init();
                break;
            case 'bg':
                // Apenas garante que o módulo pode ser carregado se necessário
                console.log("Módulo de Remoção de Fundo pronto.");
                break;
        }
    } catch (err) {
        console.error("Erro ao carregar módulo:", err);
    }
};

// 3. Listener de Eventos Global (Centraliza os cliques do sistema)
document.addEventListener('click', async (e) => {
    
    // --- LÓGICA DE FOTOS / PDF ---
    if (e.target.id === 'btn-pdf') {
        const { fotos } = await import('./fotos.js');
        fotos.exportarPDF();
    }

    // --- LÓGICA DE REMOÇÃO DE FUNDO (IA) ---
    if (e.target.id === 'btn-remove-bg') {
        const { bgRemover } = await import('./bg-remover.js');
        const input = document.getElementById('f-in'); // Ajustado para o ID do seu HTML
        
        if (input && input.files[0]) {
            await bgRemover.remover(input.files[0]);
        } else {
            alert("Selecione uma imagem primeiro no campo de arquivo.");
        }
    }

    if (e.target.id === 'btn-download-bg') {
        const { bgRemover } = await import('./bg-remover.js');
        bgRemover.baixarResultado();
    }

    // --- LÓGICA DA CALCULADORA ---
    if (e.target.id === 'btn-calc') {
        const { calculadora } = await import('./calculadora.js');
        calculadora.calcular();
    }

    if (e.target.id === 'btn-save-calc') {
        const { calculadora } = await import('./calculadora.js');
        const data = calculadora.calcular(); 

        if (data) {
            try {
                const { dbService } = await import('./db.js');
                await dbService.salvar('calculos', data);
                alert("✅ Cálculo guardado com sucesso no seu histórico!");
            } catch (err) {
                alert("❌ Erro ao salvar cálculo. Verifique a conexão.");
            }
        }
    }

    // --- LÓGICA DO PDV (VENDAS) ---
    if (e.target.id === 'btn-add-item') {
        const { pdv } = await import('./pdv.js');
        const nome = document.getElementById('p-item-nome').value;
        const valor = document.getElementById('p-item-valor').value;
        
        if (nome && valor) {
            pdv.adicionarItem(nome, valor);
            document.getElementById('p-item-nome').value = '';
            document.getElementById('p-item-valor').value = '';
        } else {
            alert("⚠️ Informe o nome e o valor do produto.");
        }
    }

    if (e.target.id === 'btn-finish-sale') {
        const { pdv } = await import('./pdv.js');
        const payload = pdv.fecharVenda(); 

        if (payload) {
            try {
                const { dbService } = await import('./db.js');
                await dbService.salvar('pedidos', payload);
                alert("✅ Venda registrada com sucesso!");
                
                const { dashboard } = await import('./dashboard.js');
                dashboard.atualizar();
            } catch (err) {
                alert("❌ Erro ao processar venda no banco de dados.");
            }
        }
    }
});
