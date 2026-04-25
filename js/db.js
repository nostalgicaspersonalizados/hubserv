import { db, auth } from './firebase.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const dbService = {
    /**
     * Função Universal para Salvar Dados
     * @param {string} col - Nome da coleção (pedidos, calculos, etc)
     * @param {object} payload - Objeto de dados gerado pelo módulo
     */
    async salvar(col, payload) {
        if (!auth.currentUser) {
            console.error("Acesso negado: Usuário não autenticado.");
            alert("Sessão expirada. Por favor, faça login novamente.");
            return null;
        }

        try {
            // Injeta metadados de auditoria antes de salvar
            const finalData = {
                ...payload,
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                criadoEm: serverTimestamp() // Usa o horário oficial do servidor Google
            };

            const docRef = await addDoc(collection(db, col), finalData);
            console.log(`Dados salvos com sucesso em ${col}. ID:`, docRef.id);
            return docRef.id;
        } catch (error) {
            console.error(`Erro ao salvar em ${col}:`, error);
            throw error;
        }
    },

    /**
     * Recupera histórico do usuário logado
     */
    async buscarHistorico(col, limite = 10) {
        if (!auth.currentUser) return [];

        try {
            const q = query(
                collection(db, col),
                where("userId", "==", auth.currentUser.uid),
                orderBy("criadoEm", "desc"),
                limit(limite)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Erro ao buscar ${col}:`, error);
            return [];
        }
    }
};
