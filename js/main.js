import { initAuth } from './auth.js';

// 1. Inicialização de Segurança
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    console.log("🚀 Nostálgicas Hub Pro: Orquestrador carregado.");
});

// 2. Navegação Global entre Abas (SaaS Multi-ferramentas)
window.tab = async (id) => {
    // UI: Gerenciar classes de visualização
    // Selecionamos apenas .tab-content para evitar conflitos com classes de botões
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('tab-' + id);
    
    // Ajuste no Seletor: Busca o botão que contém a chamada para esta aba específica
    const navBtn = document.querySelector(`.nav-item[onclick*="tab('${id}')"]`);
    
    if (target) {
        target.style.display = 'block';
    } else {
        console.warn(`Aba tab-${id} não encontrada no HTML.`);
    }

    if (navBtn) {
        navBtn.classList.add('active');
    }

    // Carregamento On-Demand (Lazy Loading) para performance
    try {
        switch(id) {
            case 'dash':
                const { dashboard } = await import('./dashboard.js');
                await dashboard.atualizar();
                break;
            case 'calc':
                const { calculadora } = await import('./calculadora.js');
                if (calculadora.init) calculadora.init();
                break;
            case 'pdv':
                const { pdv } = await import('./pdv.js');
                if (pdv.init) pdv.init();
                break;
            case 'fotos':
                const { fotos } = await import('./fotos.js');
                if (fotos.init) fotos.init();
                break;
            case 'bg':
                console.log("Módulo de Remoção de Fundo pronto.");
                break;
        }
    } catch (err) {
        console.error(`Erro ao carregar o módulo [${id}]:`, err);
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
        // No seu HTML o ID do input de arquivo é 'f-in'
        const input = document.getElementById('f-in'); 
        
        if (input && input.files[0]) {
            await bgRemover.remover(input.files[0]);
        } else {
            alert("Por favor, selecione uma imagem primeiro.");
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
                alert("✅ Cálculo guardado com sucesso!");
            } catch (err) {
                alert("❌ Erro ao salvar cálculo no banco de dados.");
            }
        }
    }

    // --- LÓGICA DO PDV (VENDAS) ---
    if (e.target.id === 'btn-add-item') {
        const { pdv } = await import('./pdv.js');
        const nomeIn = document.getElementById('p-item-nome');
        const valorIn = document.getElementById('p-item-valor');
        
        if (nomeIn.value && valorIn.value) {
            pdv.adicionarItem(nomeIn.value, valorIn.value);
            nomeIn.value = '';
            valorIn.value = '';
            nomeIn.focus();
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
                
                // Atualiza o dashboard para refletir a nova venda
                const { dashboard } = await import('./dashboard.js');
                await dashboard.atualizar();
            } catch (err) {
                alert("❌ Erro ao processar venda no Firebase.");
            }
        }
    }
});
