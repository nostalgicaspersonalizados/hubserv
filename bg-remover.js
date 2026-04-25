import imglyRemoveBackground from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@latest/dist/bundle.js';

window.processarRemocao = async () => {
    const file = document.getElementById('f-remove').files[0];
    if (!file) return;

    const loading = document.getElementById('loading-remove');
    const resultArea = document.getElementById('result-area');
    const canvas = document.getElementById('canvas-remove');
    
    loading.style.display = 'block';
    resultArea.style.display = 'none';

    try {
        // A IA processa a imagem aqui
        const blob = await imglyRemoveBackground(file);
        
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            loading.style.display = 'none';
            resultArea.style.display = 'block';
        };
        img.src = url;
    } catch (error) {
        alert("Erro ao remover fundo. Tente uma imagem menor.");
        loading.style.display = 'none';
    }
};

window.baixarImagemSemFundo = () => {
    const canvas = document.getElementById('canvas-remove');
    const link = document.createElement('a');
    link.download = 'nostalgicas-sem-fundo.png';
    link.href = canvas.toDataURL();
    link.click();
};
