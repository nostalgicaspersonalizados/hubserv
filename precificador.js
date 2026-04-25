function calcularPreco() {
    const custoUnit = parseFloat(document.getElementById('c-unit').value) || 0;
    const qtd = parseFloat(document.getElementById('c-qtd').value) || 0;
    const tempo = parseFloat(document.getElementById('c-tempo').value) || 0;
    const margem = parseFloat(document.getElementById('c-margem').value) || 0;

    // NOVOS CAMPOS (se não existir, assume 0)
    const custoHoraEl = document.getElementById('c-hora');
    const extraEl = document.getElementById('c-extra');
    const taxaEl = document.getElementById('c-tax');

    const custoHora = custoHoraEl ? parseFloat(custoHoraEl.value) || 0 : 0;
    const extra = extraEl ? parseFloat(extraEl.value) || 0 : 0;
    const taxa = taxaEl ? parseFloat(taxaEl.value) || 0 : 0;

    const custoTempo = (tempo / 60) * custoHora;

    let custoTotal = (custoUnit * qtd) + custoTempo + extra;

    let preco = custoTotal * (1 + margem / 100);

    if (taxa > 0) {
        preco = preco * (1 + taxa / 100);
    }

    const unitario = preco / qtd || 0;
    const lucro = preco - custoTotal;

    document.getElementById('res-total').innerText =
        `R$ ${preco.toFixed(2).replace('.', ',')}`;
}
