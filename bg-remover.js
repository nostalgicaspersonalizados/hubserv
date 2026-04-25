/**
 * NOSTÁLGICAS HUB - Removedor de Fundo (IA Local)
 */

window.processarRemocao = async () => {
    const fileInput = document.getElementById('f-remove');
    const file = fileInput.files[0];
    if (!file) return;

    const loading = document.getElementById('loading-remove');
    const resultArea = document.getElementById('result-area');
    const canvas = document.getElementById('canvas-remove');
    
    // Mostra loading e limpa o que tinha antes
    loading.style.display = 'block';
    resultArea.style.display = 'none';

    try {
        // Executa a remoção usando a biblioteca importada no index.html
        // Nota: A primeira execução baixa o modelo da IA (~80MB)
        const blob = await imglyRemoveBackground(file);
        
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            // Ajusta o canvas ao tamanho real da imagem processada
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            loading.style.display = 'none';
            resultArea.style.display = 'block';

            // Limpeza de memória: libera a URL do blob após carregar no canvas
            URL.revokeObjectURL(url);
        };
        img.src = url;
    } catch (error) {
        console.error("Erro na IA:", error);
        alert("Ocorreu um erro ao processar. Certifique-se de que a imagem não é grande demais e que você está conectado à internet para carregar o modelo de IA na primeira vez.");
        loading.style.display = 'none';
    }
};

window.baixarImagemSemFundo = () => {
    const canvas = document.getElementById('canvas-remove');
    const link = document.createElement('a');
    
    // Define o nome do arquivo com base na data para evitar sobrepor downloads
    const dataRef = new Date().getTime();
    link.download = `nostalgicas_sem_fundo_${dataRef}.png`;
    
    // Exporta em PNG (essencial para manter a transparência)
    link.href = canvas.toDataURL("image/png");
    link.click();
};
