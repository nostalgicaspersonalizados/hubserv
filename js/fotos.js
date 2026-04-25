export const fotos = {
    // Configurações de formatos (Medidas em mm para precisão gráfica)
    formatos: {
        'p-padrao': { nome: 'Polaroid Padrão', w: 95, h: 100 },
        'p-cabine': { nome: 'Cabine (Tira)', w: 50, h: 150 },
        'p-quadrada': { nome: 'Quadrada', w: 100, h: 100 }
    },

    init() {
        console.log("Gerador A4: Inicializado.");
        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById('f-in');
        if (input) {
            input.addEventListener('change', (e) => this.processarUpload(e.target.files));
        }
    },

    processarUpload(files) {
        const container = document.getElementById('canvas-a4');
        const formatoChave = document.getElementById('f-formato').value;
        const config = this.formatos[formatoChave];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.renderizarMoldura(container, e.target.result, formatoChave, config);
            };
            reader.readAsDataURL(file);
        });
    },

    renderizarMoldura(container, imgSrc, tipo, config) {
        const div = document.createElement('div');
        div.className = `moldura-saas ${tipo}`;
        
        // Estilização dinâmica via JS para garantir precisão de tamanho
        div.style.width = `${config.w}mm`;
        div.style.height = `${config.h}mm`;
        div.style.position = 'relative';
        div.style.overflow = 'hidden';
        div.style.border = '1px solid #ddd'; // Guia de corte suave

        if (tipo === 'p-cabine') {
            // Lógica de Cabine: Repete a mesma foto 3 vezes na tira automaticamente
            div.innerHTML = `
                <div class="tira-container" style="display:flex; flex-direction:column; height:100%;">
                    <div class="foto-slot"><img src="${imgSrc}"></div>
                    <div class="foto-slot"><img src="${imgSrc}"></div>
                    <div class="foto-slot"><img src="${imgSrc}"></div>
                </div>
            `;
        } else {
            div.innerHTML = `<img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;">`;
        }

        // Permitir remover foto com clique direito
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

        btn.innerText = "⏳ Gerando PDF...";
        btn.disabled = true;

        try {
            const canvas = await html2canvas(folha, {
                scale: 3, // Alta qualidade para impressão
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
