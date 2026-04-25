/**
 * NOSTÁLGICAS HUB - Módulo de Vendas e Recibos (pdv.js)
 */

let itensVenda = [];

// Atualiza o nome do cliente no preview em tempo real
document.getElementById('pdv-cliente').addEventListener('input', (e) => {
    document.getElementById('preview-cliente').innerText = "Cliente: " + (e.target.value || "---");
});

window.adicionarItem = () => {
    const nomeInput = document.getElementById('pdv-item');
    const valorInput = document.getElementById('pdv-valor');
    
    const nome = nomeInput.value;
    const valor = parseFloat(valorInput.value);

    if (!nome || isNaN(valor)) {
        alert("Preencha o nome do produto e o valor corretamente.");
        return;
    }

    itensVenda.push({ nome, valor });
    
    atualizarTabela();
    
    // Limpa apenas os campos do item, mantém o nome do cliente
    nomeInput.value = "";
    valorInput.value = "";
    nomeInput.focus();
};

function atualizarTabela() {
    const corpo = document.querySelector('#tabela-itens tbody');
    corpo.innerHTML = "";
    let total = 0;

    itensVenda.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 5px 0;">${item.nome}</td>
            <td style="text-align: right;">R$ ${item.valor.toFixed(2)}</td>
            <td style="text-align: right; width: 30px;">
                <button onclick="removerItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">×</button>
            </td>
        `;
        corpo.appendChild(tr);
        total += item.valor;
    });

    document.getElementById('preview-total').innerText = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

window.removerItem = (index) => {
    itensVenda.splice(index, 1);
    atualizarTabela();
};

window.gerarReciboPDF = async () => {
    if (itensVenda.length === 0) return alert("Adicione pelo menos um item ao recibo.");

    const area = document.getElementById('recibo-preview');
    const btn = event.target;
    const { jsPDF } = window.jspdf;
    
    btn.innerText = "⏳ Processando...";
    btn.disabled = true;

    try {
        // scale: 3 garante que o texto pequeno do recibo fique legível no PDF
        const canvas = await html2canvas(area, { scale: 3, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/png');
        
        // Formato 80mm (largura padrão de cupom térmico)
        const pdf = new jsPDF('p', 'mm', [80, 150]); 
        
        const larguraPdf = 70; // margem de 5mm cada lado
        const alturaImg = (canvas.height * larguraPdf) / canvas.width;

        pdf.addImage(imgData, 'PNG', 5, 10, larguraPdf, alturaImg);
        pdf.save(`Recibo_${document.getElementById('pdv-cliente').value || 'Cliente'}.pdf`);
        
        // Opcional: Limpar após gerar
        if(confirm("Deseja limpar os dados para uma nova venda?")) {
            itensVenda = [];
            document.getElementById('pdv-cliente').value = "";
            document.getElementById('preview-cliente').innerText = "Cliente: ---";
            atualizarTabela();
        }

    } catch (err) {
        console.error(err);
        alert("Erro ao gerar recibo.");
    } finally {
        btn.innerText = "📄 GERAR RECIBO PDF";
        btn.disabled = false;
    }
};
