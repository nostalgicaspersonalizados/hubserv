function calcularPreco() {
    const custo = parseFloat(document.getElementById('c-unit').value) || 0;
    const qtd = parseFloat(document.getElementById('c-qtd').value) || 1;
    const tempo = parseFloat(document.getElementById('c-tempo').value) || 0;
    const valorHora = parseFloat(document.getElementById('c-hora').value) || 20;
    const margem = parseFloat(document.getElementById('c-margem').value) || 0;
    const taxa = parseFloat(document.getElementById('c-taxa').value) || 0;

    const maoDeObra = (tempo / 60) * valorHora;
    const custoBase = (custo * qtd) + maoDeObra;
    
    let total = custoBase + (custoBase * (margem / 100));
    if (taxa > 0) total = total / (1 - (taxa / 100)); // Margem real de cartão

    document.getElementById('res-total').innerText = total.toLocaleString('pt-br',{style:'currency', currency:'BRL'});
    document.getElementById('res-unit').innerText = "Unitário: " + (total/qtd).toLocaleString('pt-br',{style:'currency', currency:'BRL'});
}
