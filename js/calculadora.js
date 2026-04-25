export const calculadora = {
    calcular() {
        const unit = parseFloat(document.getElementById('c-unit').value) || 0;
        const qtd = parseFloat(document.getElementById('c-qtd').value) || 1;
        const tempo = parseFloat(document.getElementById('c-tempo').value) || 0;
        const hora = parseFloat(document.getElementById('c-hora').value) || 0;
        const energia = parseFloat(document.getElementById('c-energia').value) || 0;
        const margem = parseFloat(document.getElementById('c-margem').value) || 0;
        const taxa = parseFloat(document.getElementById('c-taxa').value) || 0;

        const maoDeObra = (tempo / 60) * hora;
        const custoTotalBase = (unit * qtd) + maoDeObra + energia;
        let precoFinal = custoTotalBase * (1 + margem / 100);
        
        if (taxa > 0) precoFinal = precoFinal / (1 - (taxa / 100));

        const lucro = precoFinal - custoTotalBase;

        document.getElementById('res-total').innerText = precoFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        document.getElementById('res-lucro').innerText = `Lucro: ${lucro.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`;
    }
};
