import { dbService } from './db.js';

export const dashboard = {
    async atualizar() {
        console.log("📊 Dashboard: Atualizando métricas...");
        
        try {
            // 1. Busca os pedidos do Firebase (Coleção definida no PDV)
            const pedidos = await dbService.buscarHistorico('pedidos', 50); 
            
            // 2. Processamento de Métricas
            let faturamentoTotal = 0;
            let totalPedidos = pedidos.length;
            let pedidosPagos = 0;

            pedidos.forEach(pedido => {
                // Soma o faturamento (usando a estrutura de payload do PDV)
                faturamentoTotal += pedido.financeiro?.totalVenda || 0;
                
                if (pedido.financeiro?.status === 'pago') {
                    pedidosPagos++;
                }
            });

            const ticketMedio = totalPedidos > 0 ? (faturamentoTotal / totalPedidos) : 0;

            // 3. Atualização da Interface (DOM)
            this.renderizarCards({
                faturamento: faturamentoTotal,
                qtd: totalPedidos,
                pago: pedidosPagos,
                ticket: ticketMedio
            });

            // 4. Renderizar Lista de Atividades Recentes
            this.renderizarListaRecente(pedidos.slice(0, 5));

        } catch (error) {
            console.error("Erro ao processar Dashboard:", error);
        }
    },

    renderizarCards(dados) {
        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

        const elMoney = document.getElementById('stat-money');
        const elPedidos = document.getElementById('stat-pedidos');
        const elTicket = document.getElementById('stat-ticket');

        if (elMoney) elMoney.innerText = fmt.format(dados.faturamento);
        if (elPedidos) elPedidos.innerText = dados.qtd;
        if (elTicket) elTicket.innerText = fmt.format(dados.ticket);
    },

    renderizarListaRecente(pedidos) {
        const lista = document.getElementById('lista-recente');
        if (!lista) return;

        if (pedidos.length === 0) {
            lista.innerHTML = `<p style="color:var(--text-dim)">Nenhuma venda registrada ainda.</p>`;
            return;
        }

        lista.innerHTML = pedidos.map(p => `
            <div class="activity-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #334155;">
                <div>
                    <span style="display:block; font-weight:bold;">${p.cliente?.nome || 'Cliente Final'}</span>
                    <small style="color:var(--text-dim)">${p.data} às ${p.hora}</small>
                </div>
                <div style="text-align:right;">
                    <span style="display:block; color:#10b981;">R$ ${(p.financeiro?.totalVenda || 0).toFixed(2)}</span>
                    <span class="badge" style="font-size:10px; background:#334155; padding:2px 6px; border-radius:4px;">${p.financeiro?.metodo.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    }
};
