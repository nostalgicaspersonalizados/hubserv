export const calculadora = {
    init() {
        console.log("Calculadora SaaS: Pronta para processamento.");
    },

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    },

    calcular() {
        try {
            // Captura de Dados
            const unitario = Number(document.getElementById('c-unit').value) || 0;
            const qtd = Number(document.getElementById('c-qtd').value) || 1;
            const extra = Number(document.getElementById('c-extra').value) || 0;
            const energia = Number(document.getElementById('c-energia').value) || 0;
            const tempo = Number(document.getElementById('c-tempo').value) || 0;
            const valorHora = Number(document.getElementById('c-hora').value) || 0;
            
            const margemPercentual = Number(document.getElementById('c-margem').value) || 0;
            const taxaCartao = Number(document.getElementById('c-taxa').value) || 0;
            const desconto = Number(document.getElementById('c-desconto').value) || 0;

            // Cálculos Base
            const maoDeObra = (valorHora / 60) * tempo;
            const custoTotalBase = (unitario * qtd) + extra + energia + maoDeObra;

            // Preço com Margem
            let precoSugerido = custoTotalBase * (1 + (margemPercentual / 100));

            // Ajuste de Taxa de Cartão (Markup sobre o preço de venda)
            if (taxaCartao > 0 && taxaCartao < 100) {
                precoSugerido = precoSugerido / (1 - (taxaCartao / 100));
            }

            const precoFinal = precoSugerido - desconto;
            const lucroReal = precoFinal - custoTotalBase;

            // Atualização Visual
            document.getElementById('res-total').innerText = this.formatarMoeda(precoFinal);
            const elLucro = document.getElementById('res-lucro');
            elLucro.innerText = `Lucro Real: ${this.formatarMoeda(lucroReal)}`;
            elLucro.style.color = lucroReal > 0 ? "#10b981" : "#ef4444";

            // Retorno do Payload para o Firebase
            return {
                userId: window.userUid || "default",
                projeto: document.getElementById('c-nome-projeto').value || "Sem nome",
                financeiro: {
                    custoBase: custoTotalBase,
                    venda: precoFinal,
                    lucro: lucroReal,
                    moeda: "BRL"
                },
                criadoEm: Date.now()
            };
        } catch (error) {
            console.error("Erro no cálculo:", error);
        }
    }
};
