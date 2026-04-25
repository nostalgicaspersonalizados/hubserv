const bgInput = document.getElementById('bg-in');
const canvas = document.getElementById('bg-canvas');
const status = document.getElementById('bg-status');

if (bgInput) {
    bgInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        status.innerText = "Processando...";

        try {
            const blob = await removeBackground(file);
            const img = new Image();
            img.src = URL.createObjectURL(blob);

            img.onload = () => {
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                status.innerText = "Concluído!";
            };

        } catch (err) {
            status.innerText = "Erro ao remover fundo (verifique internet)";
        }
    });
}
