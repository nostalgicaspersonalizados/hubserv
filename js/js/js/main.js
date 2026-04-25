import { initAuth } from './auth.js';
import { calculadora } from './calculadora.js';
import { fotos } from './fotos.js';

// Inicializa Autenticação
initAuth();

// Expõe funções de navegação
window.tab = (id) => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-'+id).classList.add('ativa');
    // Adicione lógica para destacar o botão se necessário
};

// Listeners de Botões
document.getElementById('btn-calc').onclick = () => calculadora.calcular();
document.getElementById('f-in').onchange = (e) => fotos.upload(e.target.files);
document.getElementById('btn-pdf').onclick = () => {
    if(window.userPlano === 'pro') fotos.exportarPDF();
    else alert("Funcionalidade exclusiva para o Plano PRO!");
};
