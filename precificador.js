function calcularPreco() {
    const unit = parseFloat(document.getElementById('c-unit').value) || 0;
    const qtd = parseFloat(document.getElementById('c-qtd').value) || 1;
    const tempo = parseFloat(document.getElementById('c-tempo').value) || 0;
    const margem = parseFloat(document.getElementById('c-margem').value) || 100;
    
    // Valor da sua mão de obra (base R$ 20/hora = 0.33 por minuto)
    const maoDeObra = tempo * 0.33;
    const custoTotal = (unit * qtd) + maoDeObra;
    const precoFinal = custoTotal + (custoTotal * (margem / 100));

    document.getElementById('res-total').innerText = precoFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
}
