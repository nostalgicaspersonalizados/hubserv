window.addMaterialField = () => {
    const container = document.getElementById('materiais-lista');
    const row = document.createElement('div');
    row.className = "material-row";
    row.style = "display: flex; gap: 5px; margin-bottom: 8px;";
    row.innerHTML = `
        <input type="text" placeholder="Item" class="mat-nome">
        <input type="number" placeholder="R$" class="mat-valor" style="width: 100px;">
        <button class="btn" onclick="this.parentElement.remove()" style="width: 40px; background: #ef4444; padding: 0;">×</button>
    `;
    container.appendChild(row);
};

window.processarCalculo = () => {
    let totalMateriais = 0;
    document.querySelectorAll('.mat-valor').forEach(v => totalMateriais += (parseFloat(v.value) || 0));

    const hh = parseFloat(document.getElementById('t-hh').value) || 0;
    const mm = parseFloat(document.getElementById('t-mm').value) || 0;
    const ss = parseFloat(document.getElementById('t-ss').value) || 0;
    
    // SUA HORA DE TRABALHO: Mude o 20 para quanto você quer ganhar por hora
    const valorHoraTrabalho = 20; 
    const tempoTotalHoras = hh + (mm / 60) + (ss / 3600);
    const custoMaoDeObra = tempoTotalHoras * valorHoraTrabalho;

    const custoExtraFixo = parseFloat(document.getElementById('calc-fixo').value) || 0;
    const margemPercentual = parseFloat(document.getElementById('calc-margem').value) || 0;
    const lucroDesejadoRs = parseFloat(document.getElementById('calc-lucro-rs').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('calc-taxa').value) || 0;

    const custoTotalBase = totalMateriais + custoMaoDeObra + custoExtraFixo;
    
    // Cálculo: Custo + Margem% + Lucro Fixo
    let precoVenda = custoTotalBase + (custoTotalBase * (margemPercentual / 100)) + lucroDesejadoRs;
    
    // Aplica taxa de cartão se houver
    if (taxaCartao > 0) {
        precoVenda = precoVenda / (1 - (taxaCartao / 100));
    }

    document.getElementById('preco-venda-final').innerText = precoVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('detalhes-final').innerHTML = `
        📦 Materiais: R$ ${totalMateriais.toFixed(2)}<br>
        🛠️ Mão de Obra: R$ ${custoMaoDeObra.toFixed(2)}<br>
        ⛽ Custos Extras: R$ ${custoExtraFixo.toFixed(2)}<br>
        💰 Lucro Estimado: R$ ${(precoVenda - custoTotalBase).toFixed(2)}
    `;
};

window.copiarCalculo = () => {
    const preco = document.getElementById('preco-venda-final').innerText;
    const detalhes = document.getElementById('detalhes-final').innerText.replace(/<br>/g, '\n');
    navigator.clipboard.writeText(`ORÇAMENTO NOSTÁLGICAS\n${detalhes}\nTOTAL: ${preco}`);
    alert("Copiado!");
};
