export const bgRemover = {
    async remover(file) {
        if (window.userPlano !== 'pro') return alert("Exclusivo para Plano PRO!");
        try {
            const blob = await imglyRemoveBackground(file);
            const url = URL.createObjectURL(blob);
            const canvas = document.getElementById('bg-canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width; canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = url;
        } catch (e) { alert("Erro ao remover fundo."); }
    }
};
