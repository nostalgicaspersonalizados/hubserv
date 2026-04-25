import { db, auth } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const pdv = {
    async gerar() {
        const cliente = document.getElementById('p-cliente').value;
        const item = document.getElementById('p-item').value;
        const valor = document.getElementById('p-val').value;

        if (!cliente || !item || !valor) return alert("Preencha todos os campos!");

        const pedido = {
            cliente,
            item,
            valor: parseFloat(valor),
            data: new Date(),
            status: "pendente"
        };

        try {
            // Salva no Firebase do usuário
            await addDoc(collection(db, `usuarios/${auth.currentUser.uid}/pedidos`), pedido);
            
            // Link de WhatsApp Automático
            const msg = encodeURIComponent(`Olá ${cliente}! Seu pedido de ${item} foi registrado. Valor: R$ ${valor}`);
            window.open(`https://wa.me/?text=${msg}`);
            
            alert("Pedido salvo e enviado!");
        } catch (e) {
            console.error("Erro ao salvar pedido:", e);
        }
    }
};
