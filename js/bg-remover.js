export const bgRemover = {
    async remover(file) {
        if (window.userPlano !== 'pro') {
            return alert("O removedor de fundo é exclusivo para o Plano PRO!");
        }

        const status = document.getElementById('bg-status') || { innerText: "" };
        status.innerText = "Removendo fundo... Isso pode demorar alguns segundos.";

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
                status.innerText = "Concluído!";
            };
            img.src = url;
        } catch (e) {
            console.error("Erro na IA:", e);
            status.innerText = "Erro ao processar imagem.";
        }
    }
};
