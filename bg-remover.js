document.getElementById('bg-in').onchange = async (e) => {
    const status = document.getElementById('bg-status');
    const canvas = document.getElementById('bg-canvas');
    const file = e.target.files[0];

    if (!file) return;

    status.innerText = "⏳ Removendo fundo com IA... aguarde.";

    try {
        const blob = await imglyRemoveBackground(file);
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            status.innerText = "✅ Fundo removido!";
        };
        img.src = url;
    } catch (error) {
        status.innerText = "❌ Erro ao processar imagem.";
        console.error(error);
    }
};
