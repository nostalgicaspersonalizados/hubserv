import { initAuth } from './auth.js';

// 1. Inicialização de Segurança: Bloqueia o app até o login ser validado
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    console.log("🚀 Nostálgicas Hub Pro: Orquestrador carregado.");
});

// 2. Navegação Global entre Abas (SaaS Multi-ferramentas)
window.tab = async (id) => {
    // UI: Gerenciar classes de visualização
    document.querySelectorAll('.tab-content, .tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('tab-' + id);
    const navBtn = document.querySelector(`[onclick*="tab('${id}')"]`);
    
    if (target) target.style.display = 'block';
    if (navBtn) navBtn.classList.add('active');

    // Carregamento On-Demand (Lazy Loading) para performance
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
    }
};

// 3. Listener de Eventos Global (Centraliza os cliques do sistema)
document.addEventListener('click', async (e) => {
    
    // --- LÓGICA DA CALCULADORA ---
    
    // Botão: Apenas Calcular (Visual)
    if (e.target.id === 'btn-calc') {
        const { calculadora } = await import('./calculadora.js');
        calculadora.calcular();
    }

    // Botão: Calcular e Salvar no Firebase
    if (e.target.id === 'btn-save-calc') {
        const { calculadora } = await import('./calculadora.js');
        const data = calculadora.calcular(); // Obtém o payload JSON

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

    // Botão: Adicionar ao Carrinho
    if (e.target.id === 'btn-add-item') {
        const { pdv } = await import('./pdv.js');
        const nome = document.getElementById('p-item-nome').value;
        const valor = document.getElementById('p-item-valor').value;
        
        if (nome && valor) {
            pdv.adicionarItem(nome, valor);
            // Limpa os campos para o próximo item
            document.getElementById('p-item-nome').value = '';
            document.getElementById('p-item-valor').value = '';
        } else {
            alert("⚠️ Informe o nome e o valor do produto.");
        }
    }

    // Botão: Finalizar Venda e Gravar no Firebase
    if (e.target.id === 'btn-finish-sale') {
        const { pdv } = await import('./pdv.js');
        const payload = pdv.fecharVenda(); // Gera o JSON da venda completa

        if (payload) {
            try {
                const { dbService } = await import('./db.js');
                await dbService.salvar('pedidos', payload);
                alert("✅ Venda registada com sucesso!");
                
                // Opcional: Atualiza o dashboard automaticamente
                const { dashboard } = await import('./dashboard.js');
                dashboard.atualizar();
            } catch (err) {
                alert("❌ Erro ao processar venda no banco de dados.");
            }
        }
    }
});
