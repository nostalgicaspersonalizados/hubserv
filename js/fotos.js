export const fotos = {
    upload(files) {
        const container = document.getElementById('canvas-a4');
        const formato = document.getElementById('f-formato').value;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = `moldura ${formato}`;
                
                // Lógica de Cabine (3 fotos automáticas)
                if (formato === 'p-cabine') {
                    div.innerHTML = `
                        <div class="photo-box"><img src="${e.target.result}"></div>
                        <div class="photo-box"><img src="${e.target.result}"></div>
                        <div class="photo-box"><img src="${e.target.result}"></div>
                    `;
                } else {
                    div.innerHTML = `<img src="${e.target.result}">`;
                }
                
                container.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    },

    async exportarPDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('canvas-a4');
        
        // Notificação de processamento
        const btn = document.getElementById('btn-pdf');
        btn.innerText = "Processando...";

        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("nostalgicas-pro-print.pdf");
        
        btn.innerText = "Exportar PDF A4 (PRO)";
    }
};
