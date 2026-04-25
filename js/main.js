// Dentro do seu js/main.js

document.addEventListener('click', async (e) => {
    
    // 1. AÇÃO DE APENAS CALCULAR (O que já tínhamos)
    if (e.target.id === 'btn-calc') {
        const { calculadora } = await import('./calculadora.js');
        calculadora.calcular(); 
    }

    // 2. AÇÃO DE CALCULAR E SALVAR NO FIREBASE (Nova função)
    if (e.target.id === 'btn-save-calc') {
        const { calculadora } = await import('./calculadora.js');
        
        // Primeiro, executamos o cálculo para obter o objeto JSON (Payload)
        const data = calculadora.calcular(); 

        if (data) {
            try {
                // Importamos o serviço de banco de dados dinamicamente
                const { dbService } = await import('./db.js');
                
                // Chamamos a função salvar enviando para a coleção 'calculos'
                await dbService.salvar('calculos', data);
                
                alert("✅ Sucesso: Cálculo salvo no seu histórico Nostálgicas PRO!");
            } catch (error) {
                console.error("Erro ao salvar:", error);
                alert("❌ Erro ao salvar no Firebase. Verifique o console.");
            }
        }
    }
});
