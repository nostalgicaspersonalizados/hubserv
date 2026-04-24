window.processarCalculo = () => {
    // 1. Materiais
    let totalMateriais = 0;
    document.querySelectorAll('.mat-valor').forEach(v => totalMateriais += (parseFloat(v.value) || 0));

    // 2. Mão de Obra (Tempo x Valor da sua Hora)
    const hh = parseFloat(document.getElementById('t-hh').value) || 0;
    const mm = parseFloat(document.getElementById('t-mm').value) || 0;
    const ss = parseFloat(document.getElementById('t-ss').value) || 0;
    const valorHoraTrabalho = 20; // Ajuste quanto vale sua hora
    const tempoTotalHoras = hh + (mm / 60) + (ss / 3600);
    const custoMaoDeObra = tempoTotalHoras * valorHoraTrabalho;

    // 3. Custos Fixos Diluídos (A MÁGICA AQUI)
    const custoFixoMensal = parseFloat(document.getElementById('calc-fixo').value) || 0;
    const volumeProducao = parseFloat(document.getElementById('calc-volume').value) || 1; // Evita divisão por zero
    const custoFixoPorPeca = custoFixoMensal / volumeProducao;

    // 4. Margens e Taxas
    const margemPercentual = parseFloat(document.getElementById('calc-margem').value) || 0;
    const lucroDesejadoRs = parseFloat(document.getElementById('calc-lucro-rs').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('calc-taxa').value) || 0;

    // Custo Total Real da Peça
    const custoTotalPeca = totalMateriais + custoMaoDeObra + custoFixoPorPeca;
    
    // Preço Sugerido (Custo + Margem % + Lucro em R$)
    let precoVenda = custoTotalPeca + (custoTotalPeca * (margemPercentual / 100)) + lucroDesejadoRs;
    
    // Ajuste para Taxa de Cartão (Markup reverso para não perder dinheiro)
    if (taxaCartao > 0) {
        precoVenda = precoVenda / (1 - (taxaCartao / 100));
    }

    // 5. Exibição
    document.getElementById('preco-venda-final').innerText = precoVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('detalhes-final').innerHTML = `
        📦 Materiais: R$ ${totalMateriais.toFixed(2)}<br>
        🛠️ Mão de Obra: R$ ${custoMaoDeObra.toFixed(2)}<br>
        🏢 Custo Fixo (fatia): R$ ${custoFixoPorPeca.toFixed(2)}<br>
        📈 Lucro Bruto p/ peça: R$ ${(precoVenda - custoTotalPeca).toFixed(2)}
    `;
};
