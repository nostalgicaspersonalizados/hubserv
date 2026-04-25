// Importamos a biblioteca de remoção de fundo (via CDN para facilitar no SaaS)
// Nota: Em produção comercial, poderíamos usar uma API como Remove.bg ou ClipDrop.
export const bgRemover = {
    async remover(file) {
        // Validação SaaS: Verifica se o usuário tem plano PRO
        if (window.userPlan !== 'pro') {
            alert("✨ Recurso Exclusivo PRO: Remova fundos com um clique e economize horas de edição!");
            return null;
        }

        const btn = document.getElementById('btn-remove-bg');
        const status = document.getElementById('bg-status');
        
        try {
            status.innerText = "⏳ Analisando imagem com IA...";
            btn.disabled = true;

            // Carregamento dinâmico da biblioteca pesada apenas quando necessário
            const { removeBackground } = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/+esm');
            
            const blob = await removeBackground(file);
            const url = URL.createObjectURL(blob);

            // Exibição do resultado
            const preview = document.getElementById('bg-preview');
            preview.src = url;
            preview.style.display = 'block';

            status.innerText = "✅ Fundo removido com sucesso!";
            
            // Retorna o blob para caso o usuário queira baixar ou enviar para o Firestore/Storage
            return blob;

        } catch (error) {
            console.error("Erro na remoção de fundo:", error);
            status.innerText = "❌ Erro ao processar imagem.";
        } finally {
            btn.disabled = false;
        }
    },

    baixarResultado() {
        const img = document.getElementById('bg-preview');
        if (!img.src) return;
        
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `Nostalgicas_Hub_Removido_${Date.now()}.png`;
        link.click();
    }
};
