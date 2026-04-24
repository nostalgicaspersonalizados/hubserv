// --- MÓDULO PDV (pdv.js) ---
let itensVenda = [];

window.adicionarItem = () => {
    const nome = document.getElementById('pdv-item').value;
    const valor = parseFloat(document.getElementById('pdv-valor').value);
    const cliente = document.getElementById('pdv-cliente').value;

    if (!nome || isNaN(valor)) return alert("Preencha o item e o valor!");

    itensVenda.push({ nome, valor });
    document.getElementById('preview-cliente').innerText = "Cliente: " + (cliente || "Não informado");
    
    atualizarTabela();
    
    // Limpa campos de item
    document.getElementById('pdv-item').value = "";
    document.getElementById('pdv-valor').value = "";
};

function atualizarTabela() {
    const corpo = document.querySelector('#tabela-itens tbody');
    corpo.innerHTML = "";
    let total = 0;

    itensVenda.forEach(item => {
        corpo.innerHTML += `<tr><td>${item.nome}</td><td>R$ ${item.valor.toFixed(2)}</td></tr>`;
        total += item.valor;
    });

    document.getElementById('preview-total').innerText = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

window.gerarReciboPDF = async () => {
    const area = document.getElementById('recibo-preview');
    const { jsPDF } = window.jspdf;
    
    const canvas = await html2canvas(area);
    const pdf = new jsPDF('p', 'mm', [80, 150]); // Tamanho estilo cupom fiscal
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 5, 5, 70, 0);
    pdf.save('recibo_nostalgicas.pdf');
};