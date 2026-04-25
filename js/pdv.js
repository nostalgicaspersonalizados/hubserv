export const pdv = {
    carrinho: [],

    init() {
        // Reseta o estado local ao abrir a aba
        this.renderizarCarrinho();
    },

    adicionarItem(nome, preco) {
        const item = {
            id: Date.now(),
            nome: nome,
            preco: Number(preco),
            quantidade: 1
        };
        this.carrinho.push(item);
        this.renderizarCarrinho();
    },

    removerItem(id) {
        this.carrinho = this.carrinho.filter(item => item.id !== id);
        this.renderizarCarrinho();
    },

    renderizarCarrinho() {
        const lista = document.getElementById('pdv-lista-itens');
        const totalExibicao = document.getElementById('cart-total');
        
        if (!lista) return;

        // Renderiza o HTML dos itens no carrinho
        lista.innerHTML = this.carrinho.length === 0 
            ? '<p style="color:#64748b; text-align:center;">Carrinho vazio</p>' 
            : this.carrinho.map(item => `
                <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; background: #334155; padding: 10px; border-radius: 8px;">
                    <span>${item.nome}</span>
                    <div>
                        <strong style="margin-right:10px;">R$ ${item.preco.toFixed(2)}</strong>
                        <button onclick="import('./pdv.js').then(m => m.pdv.removerItem(${item.id}))" style="background:none; border:none; color:#ef4444; cursor:pointer;">×</button>
                    </div>
                </div>
            `).join('');

        const total = this.carrinho.reduce((acc, i) => acc + i.preco, 0);
        totalExibicao.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    },

    fecharVenda() {
        if (this.carrinho.length === 0) return alert("Adicione ao menos um item!");

        // Monta o Payload para o Firebase conforme as regras de negócio SaaS
        const payloadVenda = {
            userId: window.userUid || "offline",
            cliente: {
                nome: document.getElementById('p-cliente-nome').value || "Consumidor Final",
                contato: document.getElementById('p-cliente-contato').value || ""
            },
            itens: this.carrinho,
            financeiro: {
                totalVenda: this.carrinho.reduce((acc, i) => acc + i.preco, 0),
                metodo: document.getElementById('p-metodo-pagamento').value,
                status: document.getElementById('p-status-pagamento').value
            },
            data: new Date().toLocaleDateString('pt-BR'),
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            criadoEm: Date.now()
        };

        console.log("Payload PDV pronto:", payloadVenda);
        
        // Aqui o main.js ou db.js pegará este objeto para salvar no Firestore
        alert("Venda concluída com sucesso!");
        this.carrinho = [];
        this.renderizarCarrinho();
        
        return payloadVenda;
    }
};
