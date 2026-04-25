function gerarRecibo() {
    const cliente = document.getElementById('r-cli').value || '-';
    const produto = document.getElementById('r-item').value || '-';
    const valor = parseFloat(document.getElementById('r-val').value) || 0;

    const data = new Date().toLocaleDateString();

    const texto = `
Cliente: ${cliente}
Produto: ${produto}
Valor: R$ ${valor.toFixed(2)}
Data: ${data}
    `;

    document.getElementById('v-txt').innerText = texto;
}
