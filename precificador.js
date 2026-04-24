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
    // 1. Soma dos Materiais
    let totalMateriais = 0;
    document.querySelectorAll('.mat-valor').forEach(v => totalMateriais += (parseFloat(v.value) || 0));

    // 2. Custo da sua hora baseado nos custos fixos e jornada
    const custoFixoMensal = parseFloat(document.getElementById('calc-fixo').value) || 0;
    const horasTrabalhoMes = parseFloat(document.getElementById('calc-horas-mes').value) || 160;
    
    // Quanto custa sua estrutura por hora
    const valorHoraEstrutura = custoFixoMensal / horasTrabalhoMes;
    
    // Seu pró-labore (salário por hora). Ajuste conforme desejar.
    const meuSalarioHora = 25; 
    const valorHoraTotal = valorHoraEstrutura + meuSalarioHora;

    // 3. Tempo de produção da peça
    const hh = parseFloat(document.getElementById('t-hh').value) || 0;
    const mm = parseFloat(document.getElementById('t-mm').value) || 0;
    const tempoDecimal = hh + (mm / 60);
    const custoTempoProducao = tempoDecimal * valorHoraTotal;

    // 4. Impostos e Margens
    const margemLucro = parseFloat(document.getElementById('calc-margem').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('calc-taxa').value) || 0;
    const lucroFixoRs = parseFloat(document.getElementById('calc-lucro-rs').value) || 0;

    // 5. Cálculo Final com Markup (evita prejuízo em taxas)
    const custoBaseTotal = totalMateriais + custoTempoProducao;
    const divisor = 1 - ((margemLucro + taxaCartao) / 100);

    if (divisor <= 0) {
        alert("Erro: Margens e taxas somam 100% ou mais!");
        return;
    }

    const precoFinal = (custoBaseTotal + lucroFixoRs) / divisor;

    // 6. Exibir na tela
    document.getElementById('preco-venda-final').innerText = precoFinal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('detalhes-final').innerHTML = `
        <div style="text-align: left;">
            <p>📦 Materiais: R$ ${totalMateriais.toFixed(2)}</p>
            <p>⏳ Tempo (Sua hora R$ ${valorHoraTotal.toFixed(2)}): R$ ${custoTempoProducao.toFixed(2)}</p>
            <p>🏢 Custo Fixo embutido: R$ ${(tempoDecimal * valorHoraEstrutura).toFixed(2)}</p>
            <hr>
            <p>💰 Lucro Bruto Estimado: R$ ${(precoFinal - custoBaseTotal).toFixed(2)}</p>
        </div>
    `;
};

window.copiarCalculo = () => {
    const preco = document.getElementById('preco-venda-final').innerText;
    navigator.clipboard.writeText("Orçamento Nostálgicas: " + preco);
    alert("Preço copiado!");
};
