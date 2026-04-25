import { initAuth } from './auth.js';
import { calculadora } from './calculadora.js';
import { fotos } from './fotos.js';

// Inicializa a Proteção de Rotas e Login
initAuth();

// Navegação entre abas
window.tab = (id) => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById('tab-' + id);
    if(targetTab) targetTab.classList.add('ativa');
    
    // Marca o botão clicado como ativo
    const btn = document.querySelector(`[onclick="tab('${id}')"]`);
    if(btn) btn.classList.add('active');
};

// Listeners de Clique
const btnCalc = document.getElementById('btn-calc');
if(btnCalc) btnCalc.onclick = () => calculadora.calcular();

const inputFoto = document.getElementById('f-in');
if(inputFoto) inputFoto.onchange = (e) => fotos.upload(e.target.files);

const btnPdf = document.getElementById('btn-pdf');
if(btnPdf) {
    btnPdf.onclick = () => {
        if(window.userPlano === 'pro') fotos.exportarPDF();
        else alert("⚠️ Funcionalidade disponível apenas no Plano PRO!");
    };
}
