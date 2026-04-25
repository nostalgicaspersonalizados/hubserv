// 1. Importação de todos os módulos
import { initAuth } from './auth.js';
import { calculadora } from './calculadora.js';
import { fotos } from './fotos.js';
import { pdv } from './pdv.js';
import { dashboard } from './dashboard.js';

// 2. Inicializa a Autenticação (Isso permite o login funcionar)
initAuth();

// 3. Função Global de Navegação (Ajustada para carregar o Dashboard)
window.tab = (id) => {
    // Esconde todas as abas e remove destaques dos botões
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    // Mostra a aba clicada
    const targetTab = document.getElementById('tab-' + id);
    if (targetTab) {
        targetTab.classList.add('ativa');
    }

    // Se a aba for a de Dashboard, atualiza os números do banco de dados
    if (id === 'dash') {
        dashboard.atualizar();
    }
};

// 4. Listeners de Eventos (O que acontece quando você clica nos botões)

// Botão de Calcular Preço
const btnCalc = document.getElementById('btn-calc');
if (btnCalc) {
    btnCalc.onclick = () => calculadora.calcular();
}

// Input de Upload de Fotos (Polaroids)
const inputFoto = document.getElementById('f-in');
if (inputFoto) {
    inputFoto.onchange = (e) => fotos.upload(e.target.files);
}

// Botão de Exportar PDF (Com trava de segurança PRO)
const btnPdf = document.getElementById('btn-pdf');
if (btnPdf) {
    btnPdf.onclick = () => {
        if (window.userPlano === 'pro') {
            fotos.exportarPDF();
        } else {
            alert("⚠️ Esta função é exclusiva para o Plano PRO!");
        }
    };
}

// Botão de Gerar Pedido no PDV
const btnPdv = document.getElementById('btn-gerar-pdv');
if (btnPdv) {
    btnPdv.onclick = () => pdv.gerar();
}

console.log("🚀 Nostálgicas Hub Pro: Sistema carregado com sucesso!");
