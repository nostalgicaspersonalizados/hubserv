import { db, auth } from './firebase.js';
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const dashboard = {
    async atualizar() {
        const q = query(collection(db, `usuarios/${auth.currentUser.uid}/pedidos`));
        const snap = await getDocs(q);
        
        let totalPedidos = 0;
        let faturamento = 0;

        snap.forEach(doc => {
            const d = doc.data();
            totalPedidos++;
            faturamento += d.valor;
        });

        document.getElementById('stat-pedidos').innerText = totalPedidos;
        document.getElementById('stat-money').innerText = faturamento.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    }
};
