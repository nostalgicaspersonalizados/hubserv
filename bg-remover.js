// Função para processar a remoção
window.processarRemocao = async () => {
    const fileInput = document.getElementById('f-remove');
    const file = fileInput.files[0];
    if (!file) return;

    const loading = document.getElementById('loading-remove');
    const resultArea = document.getElementById('result-area');
    const canvas = document.getElementById('canvas-remove');
    
    // Mostra o loading e esconde o resultado anterior
    loading.style.display = 'block';
    resultArea.style.display = 'none';

    try {
        // Chamando a biblioteca globalmente
        const blob = await imglyRemoveBackground(file);
        
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            loading.style.display = 'none';
            resultArea.style.display = 'block';
        };
        img.src = url;
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar a IA. Verifique sua conexão ou tente uma imagem menor.");
        loading.style.display = 'none';
    }
};

window.baixarImagemSemFundo = () => {
    const canvas = document.getElementById('canvas-remove');
    const link = document.createElement('a');
    link.download = 'nostalgicas-sem-fundo.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
};
