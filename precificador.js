/**
 * NOSTÁLGICAS HUB - Módulo de Precificação Profissional
 */

window.addMaterialField = () => {
    const container = document.getElementById('materiais-lista');
    const row = document.createElement('div');
    row.className = "material-row";
    row.style = "display: flex; gap: 5px; margin-bottom: 8px;";
    row.innerHTML = `
        <input type="text" placeholder="Item" class="mat-nome">
        <input type="number" placeholder="R$" class="mat-valor" style="width: 100px;">
        <button class="btn" onclick="this.parentElement.remove()" style="width: 40px; background: #ef4444; padding: 0; line-height: 1;">×</button>
    `;
    container.appendChild(row);
};

window.processarCalculo = () => {
    // 1. Soma dos Materiais
    let totalMateriais = 0;
    document.querySelectorAll('.mat-valor').forEach(v => {
        totalMateriais += (parseFloat(v.value) || 0);
    });

    // 2. Base de Custos Fixos (Diluição por hora)
    const custoFixoMensal = parseFloat(document.getElementById('calc-fixo').value) || 0;
    const horasTrabalhoMes = parseFloat(document.getElementById('calc-horas-mes').value) || 160;
    
    // Descobre o custo de manter a empresa aberta por 1 hora
    const valorHoraEstrutura = custoFixoMensal / horasTrabalhoMes;
    
    // Seu salário/mão de obra por hora (Ex: R$ 25,00)
    const meuSalarioHora = 25; 
    const valorHoraOperacional = valorHoraEstrutura + meuSalarioHora;

    // 3. Tempo de Produção convertido para Decimal
    const hh = parseFloat(document.getElementById('t-hh').value) || 0;
    const mm = parseFloat(document.getElementById('t-mm').value) || 0;
    const ss = parseFloat(document.getElementById('t-ss')?.value) || 0; // Segundos opcional
    
    const tempoTotalEmHoras = hh + (mm / 60) + (ss / 3600);
    const custoTempoTotal = tempoTotalEmHoras * valorHoraOperacional;

    // 4. Margens e Taxas
    const margemLucro = parseFloat(document.getElementById('calc-margem').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('calc-taxa').value) || 0;
    const lucroExtraRs = parseFloat(document.getElementById('calc-lucro-rs').value) || 0;

    // 5. Cálculo do Markup (Garante que a taxa do cartão incida sobre o valor final)
    const custoBase = totalMateriais + custoTempoTotal;
    const divisor = 1 - ((margemLucro + taxaCartao) / 100);

    if (divisor <= 0) {
        alert("Atenção: A soma das margens e taxas não pode ser 100% ou mais.");
        return;
    }

    const precoVenda = (custoBase + lucroExtraRs) / divisor;

    // 6. Atualização da Tela
    document.getElementById('preco-venda-final').innerText = precoVenda.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('detalhes-final').innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 5px;">
            <p><strong>📦 Materiais:</strong> R$ ${totalMateriais.toFixed(2)}</p>
            <p><strong>🛠️ Mão de Obra + Fixos:</strong> R$ ${custoTempoTotal.toFixed(2)}</p>
            <p style="font-size: 11px; color: #64748b;">(Sua hora total: R$ ${valorHoraOperacional.toFixed(2)})</p>
            <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 5px 0;">
            <p><strong>💰 Lucro + Taxas:</strong> R$ ${(precoVenda - custoBase).toFixed(2)}</p>
        </div>
    `;
};

window.copiarCalculo = () => {
    const preco = document.getElementById('preco-venda-final').innerText;
    if (preco === "R$ 0,00") return alert("Calcule um preço antes de copiar!");
    
    navigator.clipboard.writeText(`Orçamento Nostálgicas: ${preco}`)
        .then(() => alert("Preço copiado para a área de transferência!"))
        .catch(() => alert("Erro ao copiar. Tente selecionar o texto manualmente."));
};
