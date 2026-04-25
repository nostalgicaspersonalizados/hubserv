import { db, auth } from './firebase.js';
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const dashboard = {
    async atualizar() {
        if (!auth.currentUser) {
            console.log("Dashboard: Aguardando login...");
            return;
        }

        try {
            const q = query(collection(db, `usuarios/${auth.currentUser.uid}/pedidos`));
            const snap = await getDocs(q);
            
            let totalPedidos = 0;
            let faturamento = 0;

            snap.forEach(doc => {
                const d = doc.data();
                totalPedidos++;
                faturamento += parseFloat(d.valor || 0);
            });

            // Atualiza a tela com segurança
            const elPedidos = document.getElementById('stat-pedidos');
            const elMoney = document.getElementById('stat-money');
            
            if (elPedidos) elPedidos.innerText = totalPedidos;
            if (elMoney) elMoney.innerText = faturamento.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            
            console.log("Dashboard atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao carregar Dashboard:", error);
            // Se der erro de "coleção não encontrada", ele apenas mostra 0
            document.getElementById('stat-pedidos').innerText = "0";
            document.getElementById('stat-money').innerText = "R$ 0,00";
        }
    }
};
