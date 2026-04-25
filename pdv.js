function gerarRecibo() {
    const cliente = document.getElementById('r-cli').value || "Cliente";
    const item = document.getElementById('r-item').value || "Produto";
    const valor = parseFloat(document.getElementById('r-val').value) || 0;
    
    const texto = `Cliente: ${cliente} | Item: ${item} | Total: R$ ${valor.toFixed(2)}`;
    document.getElementById('v-txt').innerText = texto;
    
    alert("Recibo gerado no preview!");
}
