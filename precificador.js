// --- MÓDULO DE PRECIFICAÇÃO AVANÇADA ---

window.addMaterialField = () => {
    const container = document.getElementById('materiais-lista');
    const row = document.createElement('div');
    row.className = "material-row";
    row.style = "display: flex; gap: 5px; margin-bottom: 8px;";
    row.innerHTML = `
        <input type="text" placeholder="Item" class="mat-nome">
        <input type="number" placeholder="R$" class="mat-valor" style="width: 100px;">
        <button class="btn" onclick="this.parentElement.remove()" style="width: 40px; background: #ef4444">×</button>
    `;
    container.appendChild(row);
};

window.processarCalculo = () => {
    // 1. Somar Materiais
    let totalMateriais = 0;
    const valores = document.querySelectorAll('.mat-valor');
    valores.forEach(v => totalMateriais += (parseFloat(v.value) || 0));

    // 2. Calcular Tempo (Base R$ 30,00/hora - ajuste se necessário)
    const hh = parseFloat(document.getElementById('t-hh').value) || 0;
    const mm = parseFloat(document.getElementById('t-mm').value) || 0;
    const ss = parseFloat(document.getElementById('t-ss').value) || 0;
    const tempoTotalHoras = hh + (mm / 60) + (ss / 3600);
    const valorHoraTrabalho = 30; // Valor da sua hora
    const custoMaoDeObra = tempoTotalHoras * valorHoraTrabalho;

    // 3. Custos Fixos e Lucro
    const custoFixo = parseFloat(document.getElementById('calc-fixo').value) || 0;
    const margemPorcentagem = parseFloat(document.getElementById('calc-margem').value) || 0;
    const lucroDiretoRs = parseFloat(document.getElementById('calc-lucro-rs').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('calc-taxa').value) || 0;

    // 4. Cálculo Final
    const custoTotalProducao = totalMateriais + custoMaoDeObra + custoFixo;
    let precoComLucro = custoTotalProducao + (custoTotalProducao * (margemPorcentagem / 100)) + lucroDiretoRs;
    
    // Adicionar Taxas sobre o valor final
    const precoFinalVenda = precoComLucro / (1 - (taxaCartao / 100));

    // 5. Exibir Resultados
    document.getElementById('preco-venda-final').innerText = precoFinalVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('detalhes-final').innerHTML = `
        📌 Materiais: R$ ${totalMateriais.toFixed(2)}<br>
        ⏱️ Mão de Obra (${hh}h ${mm}m ${ss}s): R$ ${custoMaoDeObra.toFixed(2)}<br>
        🏢 Custo Fixo: R$ ${custoFixo.toFixed(2)}<br>
        📈 Lucro Bruto: R$ ${(precoFinalVenda - custoTotalProducao).toFixed(2)}
    `;
};

window.copiarCalculo = () => {
    const preco = document.getElementById('preco-venda-final').innerText;
    const detalhes = document.getElementById('detalhes-final').innerText.replace(/<br>/g, '\n');
    const textoParaCopiar = `🛒 *ORÇAMENTO NOSTÁLGICAS*\n\n${detalhes}\n💰 *TOTAL SUGERIDO: ${preco}*`;
    
    navigator.clipboard.writeText(textoParaCopiar);
    alert("Cálculo copiado para a área de transferência!");
};
