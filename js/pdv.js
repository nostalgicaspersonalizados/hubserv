import { db, auth } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const pdv = {
    async gerar() {
        const cliente = document.getElementById('p-cliente').value;
        const item = document.getElementById('p-item').value;
        const valor = document.getElementById('p-val').value;
        if (!cliente || !item || !valor) return alert("Preencha tudo!");

        try {
            await addDoc(collection(db, `usuarios/${auth.currentUser.uid}/pedidos`), {
                cliente, item, valor: parseFloat(valor), data: new Date()
            });
            const msg = encodeURIComponent(`Olá ${cliente}, seu pedido de ${item} (R$ ${valor}) foi recebido!`);
            window.open(`https://wa.me/?text=${msg}`);
        } catch (e) { console.error(e); }
    }
};
