/**
 * NOSTÁLGICAS HUB - Módulo do Estúdio (estudio.js)
 * Ajustado para funcionar com o sistema de abas e login.
 */

// 1. ESTADO GLOBAL DO MÓDULO
let photoRegistry = {}; 
let curId = null;       
let cropState = { x: 0, y: 0, s: 0.8 }; 
let isDragging = false;
let startPos = { x: 0, y: 0 };

const LIMITES = { padrao: 4, mini: 6, instax: 9, trio: 9 };

// 2. INICIALIZAÇÃO DE EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    const fileIn = document.getElementById('f-in');
    const zoomCtrl = document.getElementById('zoom-ctrl');
    const cropArea = document.getElementById('crop-area');

    if(fileIn) fileIn.onchange = (e) => handleFiles(e.target);
    if(zoomCtrl) zoomCtrl.oninput = (e) => handleZoom(e.target.value);
    
    if(cropArea) {
        cropArea.onpointerdown = startDrag;
        cropArea.onpointermove = doDrag;
        cropArea.onpointerup = endDrag;
        cropArea.onpointerleave = endDrag;
    }
});

// 3. LOGICA DE UPLOAD E GRID
window.handleFiles = (input) => {
    // Verifica se há arquivos selecionados
    if (!input.files.length) return;

    const mod = document.getElementById('p-modelo').value;
    const files = Array.from(input.files);
    const cont = document.getElementById('p-folhas');

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            let folha = cont.lastElementChild;
            
            if (!folha || isFolhaCheia(folha, mod)) {
                folha = document.createElement('div');
                folha.className = `folha-a4 g-${mod}`;
                cont.appendChild(folha);
            }

            if (mod === 'trio') {
                addTrio(folha, e.target.result);
            } else {
                addStd(folha, e.target.result, mod);
            }
        };
        reader.readAsDataURL(file);
    });
    input.value = ""; 
};

function isFolhaCheia(folha, mod) {
    if (!folha.classList.contains(`g-${mod}`)) return true;
    const qtd = mod === 'trio' ? folha.querySelectorAll('.trio-img-box img').length : folha.querySelectorAll('.polaroid').length;
    return qtd >= LIMITES[mod];
}

function addStd(folha, src, mod) {
    const id = 'img_' + Math.random().toString(36).substr(2, 9);
    const card = document.createElement('div');
    card.className = `polaroid f-${mod}`;
    card.innerHTML = `<div class="foto-box"><img src="${src}" id="${id}" style="pointer-events: none;"></div>`;
    card.onclick = () => openEditor(id);
    folha.appendChild(card);
    
    photoRegistry[id] = { x: 0, y: 0, s: 0.8, src: src };
    updateDOM(id);
}

function addTrio(folha, src) {
    const id = 'img_' + Math.random().toString(36).substr(2, 9);
    let ultimaTira = folha.querySelector('.f-trio:last-child');
    
    if (!ultimaTira || ultimaTira.querySelectorAll('img').length >= 3) {
        ultimaTira = document.createElement('div');
        ultimaTira.className = 'polaroid f-trio';
        ultimaTira.innerHTML = '<div class="trio-img-box"></div><div class="trio-img-box"></div><div class="trio-img-box"></div>';
        folha.appendChild(ultimaTira);
    }

    const boxVazio = Array.from(ultimaTira.querySelectorAll('.trio-img-box')).find(b => b.innerHTML === "");
    if (boxVazio) {
        boxVazio.innerHTML = `<img src="${src}" id="${id}" style="pointer-events: none;">`;
        boxVazio.onclick = (e) => { e.stopPropagation(); openEditor(id); };
        photoRegistry[id] = { x: 0, y: 0, s: 0.8, src: src };
        updateDOM(id);
    }
}

// 4. MOTOR DO EDITOR
window.openEditor = (id) => {
    // Só abre se estiver na aba de estúdio (prevenção de bug)
    if (!document.getElementById('aba-prod').classList.contains('ativa')) return;

    curId = id;
    cropState = { ...photoRegistry[id] };
    
    const preview = document.getElementById('crop-img');
    preview.src = cropState.src;
    document.getElementById('zoom-ctrl').value = cropState.s;
    document.getElementById('editor-modal').style.display = 'flex';
    
    refreshPreview();
};

window.closeEditor = () => {
    document.getElementById('editor-modal').style.display = 'none';
    curId = null; // Limpa o ID atual
};

window.saveCrop = () => {
    if (curId) {
        photoRegistry[curId] = { ...cropState };
        updateDOM(curId);
    }
    closeEditor();
};

function handleZoom(val) {
    cropState.s = parseFloat(val);
    refreshPreview();
}

// Lógica de Arrastar
function startDrag(e) {
    isDragging = true;
    this.setPointerCapture(e.pointerId);
    startPos.x = e.clientX - cropState.x;
    startPos.y = e.clientY - cropState.y;
}

function doDrag(e) {
    if (!isDragging) return;
    cropState.x = e.clientX - startPos.x;
    cropState.y = e.clientY - startPos.y;
    requestAnimationFrame(refreshPreview);
}

function endDrag() { isDragging = false; }

function refreshPreview() {
    const img = document.getElementById('crop-img');
    if (img) {
        img.style.transform = `translate(calc(-50% + ${cropState.x}px), calc(-50% + ${cropState.y}px)) scale(${cropState.s})`;
    }
}

function updateDOM(id) {
    const img = document.getElementById(id);
    const data = photoRegistry[id];
    if (img && data) {
        img.style.transform = `translate(calc(-50% + ${data.x}px), calc(-50% + ${data.y}px)) scale(${data.s})`;
    }
}

// 5. EXPORTAÇÃO
window.exportarPDF = async () => {
    const { jsPDF } = window.jspdf;
    const folhas = document.querySelectorAll('.folha-a4');

    if (folhas.length === 0) return alert("Adicione fotos primeiro.");

    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "⏳ Gerando...";
    btn.disabled = true;

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        for (let i = 0; i < folhas.length; i++) {
            if (i > 0) pdf.addPage();
            const canvas = await html2canvas(folhas[i], { scale: 2, useCORS: true });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297);
        }
        pdf.save('Nostalgicas_Producao.pdf');
    } catch (err) {
        console.error(err);
        alert("Erro ao gerar PDF.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

window.limparEstudio = () => {
    if(confirm("Deseja limpar todas as fotos?")) {
        document.getElementById('p-folhas').innerHTML = "";
        photoRegistry = {};
    }
};
