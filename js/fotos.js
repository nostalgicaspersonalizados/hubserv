export const fotos = {
    // Configurações de formatos (Medidas em mm para precisão gráfica)
    // Ajustado para proporções reais de Polaroid (L x A)
    formatos: {
        'p-padrao': { nome: 'Polaroid Padrão', w: 90, h: 105 },
        'p-cabine': { nome: 'Cabine (Tira)', w: 50, h: 150 },
        'p-quadrada': { nome: 'Quadrada', w: 100, h: 115 }
    },

    init() {
        console.log("Gerador A4: Inicializado.");
        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById('f-in');
        if (input) {
            // Substituímos o listener antigo para evitar duplicidade se o init for chamado mais de uma vez
            input.onchange = (e) => this.processarUpload(e.target.files);
        }
    },

    processarUpload(files) {
        const container = document.getElementById('canvas-a4');
        const formatoChave = document.getElementById('f-formato').value;
        const config = this.formatos[formatoChave];

        if (!container) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.renderizarMoldura(container, e.target.result, formatoChave, config);
            };
            reader.readAsDataURL(file);
        });
    },

    renderizarMoldura(container, imgSrc, tipo, config) {
        // 1. Criamos a Moldura (O papel branco)
        const div = document.createElement('div');
        div.className = `moldura-foto ${tipo}`; // Usando a classe que corrigimos no style.css
        
        // Estilização dinâmica para precisão milimétrica
        div.style.width = `${config.w}mm`;
        div.style.height = `${config.h}mm`;
        div.style.position = 'relative';

        // 2. Lógica de Conteúdo Interno
        if (tipo === 'p-cabine') {
            // Estilo Tira de Cabine
            div.style.padding = "5px"; 
            div.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:3px; height:100%;">
                    <div style="flex:1; overflow:hidden;"><img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;"></div>
                    <div style="flex:1; overflow:hidden;"><img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;"></div>
                    <div style="flex:1; overflow:hidden;"><img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;"></div>
                    <div style="height:15px;"></div> </div>
            `;
        } else {
            // Estilo Polaroid (Padrao e Quadrada)
            // A imagem fica dentro da moldura que tem o padding definido no CSS
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";
            
            div.appendChild(img);
        }

        // 3. Permitir remover foto com clique direito
        div.oncontextmenu = (e) => {
            e.preventDefault();
            if(confirm("Remover esta foto da folha?")) div.remove();
        };

        container.appendChild(div);
    },

    async exportarPDF() {
        const { jsPDF } = window.jspdf;
        const folha = document.getElementById('canvas-a4');
        const btn = document.getElementById('btn-pdf');

        if (!folha) return;

        btn.innerText = "⏳ Gerando PDF...";
        btn.disabled = true;

        try {
            const canvas = await html2canvas(folha, {
                scale: 3, // Alta resolução
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Nostalgicas_Impressao_${Date.now()}.pdf`);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar arquivo de impressão.");
        } finally {
            btn.innerText = "📥 Baixar PDF para Impressão";
            btn.disabled = false;
        }
    }
};
