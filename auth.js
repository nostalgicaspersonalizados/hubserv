// 1. Navegação de Abas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 2. Lógica da Calculadora
function calcularPreco() {
    const unit = parseFloat(document.getElementById('c-unit').value) || 0;
    const qtd = parseInt(document.getElementById('c-qtd').value) || 1;
    const tempo = parseInt(document.getElementById('c-tempo').value) || 0;
    const hora = parseFloat(document.getElementById('c-hora').value) || 0;
    const margem = parseFloat(document.getElementById('c-margem').value) || 0;
    const taxa = parseFloat(document.getElementById('c-taxa').value) || 0;

    const custoTrabalho = (tempo / 60) * hora;
    const custoTotalMateria = unit * qtd;
    const custoBase = custoTotalMateria + custoTrabalho;
    
    let final = custoBase + (custoBase * (margem / 100));
    if (taxa > 0) final = final / (1 - (taxa / 100));

    document.getElementById('res-total').innerText = final.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    document.getElementById('res-unit').innerText = (final / qtd).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    document.getElementById('res-lucro').innerText = (final - custoBase).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

// 3. Gerador de Fotos
const inputFoto = document.getElementById('foto-input');
const renderFoto = document.getElementById('img-render');
const previewBox = document.getElementById('foto-preview');
const selectFormato = document.getElementById('foto-formato');

selectFormato.onchange = () => {
    previewBox.className = selectFormato.value;
};

inputFoto.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            renderFoto.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};

async function baixarLayout() {
    const canvas = await html2canvas(previewBox, { scale: 3 });
    const link = document.createElement('a');
    link.download = 'layout-impressao.png';
    link.href = canvas.toDataURL();
    link.click();
}

// 4. PDV e Recibo
function gerarRecibo() {
    const cliente = document.getElementById('p-cliente').value;
    const prod = document.getElementById('p-prod').value;
    const total = (document.getElementById('p-qtd').value * document.getElementById('p-v-unit').value);

    document.getElementById('view-cliente').innerText = cliente;
    document.getElementById('view-prod').innerText = prod;
    document.getElementById('view-total').innerText = total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

    // Aqui você pode integrar o jsPDF para baixar
    alert("Recibo Gerado! Clique no PDF (em desenvolvimento)");
}

// 5. Removedor de Fundo
async function removerFundo() {
    const file = document.getElementById('bg-input').files[0];
    const loading = document.getElementById('bg-loading');
    loading.style.display = 'block';

    try {
        const blob = await imglyRemoveBackground(file);
        const url = URL.createObjectURL(blob);
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            document.getElementById('bg-download').onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sem-fundo.png';
                a.click();
            };
            document.getElementById('bg-download').style.display = 'inline-block';
            loading.style.display = 'none';
        };
        img.src = url;
    } catch (e) {
        alert("Erro na IA: Verifique a conexão ou tamanho da foto.");
        loading.style.display = 'none';
    }
}
