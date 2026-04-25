export const pdv = {
    carrinho: [],

    init() {
        this.carrinho = [];
        this.atualizarInterface();
    },

    adicionarItem(nome, preco) {
        const item = {
            id: Date.now(),
            nome: nome,
            preco: Number(preco),
            quantidade: 1
        };
        this.carrinho.push(item);
        this.atualizarInterface();
    },

    removerItem(id) {
        this.carrinho = this.carrinho.filter(item => item.id !== id);
        this.atualizarInterface();
    },

    atualizarInterface() {
        const lista = document.getElementById('pdv-lista-itens');
        const totalExibicao = document.getElementById('cart-total');
        
        if (!lista) return;

        lista.innerHTML = this.carrinho.map(item => `
            <div class="cart-item">
                <span>${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2)}</strong>
                <button onclick="import('./js/pdv.js').then(m => m.pdv.removerItem(${item.id}))" class="btn-del">×</button>
            </div>
        `).join('');

        const total = this.carrinho.reduce((acc, i) => acc + i.preco, 0);
        totalExibicao.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    },

    async fecharVenda() {
        if (this.carrinho.length === 0) return alert("Carrinho vazio!");

        const payloadVenda = {
            userId: window.userUid || "default",
            cliente: {
                nome: document.getElementById('p-cliente-nome').value || "Consumidor",
                contato: document.getElementById('p-cliente-contato').value || ""
            },
            itens: this.carrinho,
            total: this.carrinho.reduce((acc, i) => acc + i.preco, 0),
            metodo: document.getElementById('p-metodo-pagamento').value,
            status: document.getElementById('p-status-pagamento').value,
            data: new Date().toLocaleDateString('pt-BR'),
            criadoEm: Date.now()
        };

        console.log("Venda pronta para o Firebase:", payloadVenda);
        
        // Simulação de sucesso (o próximo passo será o db.js)
        alert("Venda processada com sucesso (Payload Gerado)!");
        this.init(); // Reseta o PDV
    }
};
