// --- MÓDULO DE PRECIFICAÇÃO (precificador.js) ---

window.calcularPreco = () => {
    const custoMaterial = parseFloat(document.getElementById('calc-material').value) || 0;
    const tempoMinutos = parseFloat(document.getElementById('calc-tempo').value) || 0;
    const margemLucro = parseFloat(document.getElementById('calc-lucro').value) || 0;

    // Defina aqui quanto vale sua hora (Ex: R$ 30,00)
    const valorHora = 30;
    const custoTempo = (tempoMinutos / 60) * valorHora;

    // Cálculo: (Material + Tempo) + Margem de Lucro
    const custoBase = custoMaterial + custoTempo;
    const precoFinal = custoBase + (custoBase * (margemLucro / 100));

    // Exibir Resultado
    document.getElementById('res-preco').innerText = precoFinal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    
    document.getElementById('res-detalhe').innerText = 
        `Custo Base: R$ ${custoBase.toFixed(2)} (Material + Mão de Obra)`;
};