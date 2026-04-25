const input = document.getElementById('f-input');
const preview = document.getElementById('preview-area');
const formatoSelect = document.getElementById('f-formato');

if (input) {
    input.addEventListener('change', handleFiles);
}

function handleFiles(e) {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (files.length > 20) {
        alert("Máximo 20 imagens por vez");
        return;
    }

    preview.innerHTML = '';

    const formato = formatoSelect.value;

    if (formato === 'p-cabine') {
        gerarCabine(files);
    } else {
        gerarPadrao(files, formato);
    }
}

function gerarPadrao(files, formato) {
    files.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();

        reader.onload = function(e) {
            const wrapper = document.createElement('div');
            wrapper.className = `foto ${formato}`;

            const img = document.createElement('img');
            img.src = e.target.result;

            wrapper.appendChild(img);
            preview.appendChild(wrapper);
        };

        reader.readAsDataURL(file);
    });
}

function gerarCabine(files) {
    for (let i = 0; i < files.length; i += 3) {
        const grupo = document.createElement('div');
        grupo.className = 'cabine';

        for (let j = 0; j < 3; j++) {
            const file = files[i + j];
            if (!file) continue;

            const reader = new FileReader();

            reader.onload = function(e) {
                const box = document.createElement('div');
                box.className = 'foto cabine-foto';

                const img = document.createElement('img');
                img.src = e.target.result;

                box.appendChild(img);
                grupo.appendChild(box);
            };

            reader.readAsDataURL(file);
        }

        preview.appendChild(grupo);
    }
}

function baixarPNG() {
    const area = document.getElementById('print-area');

    html2canvas(area, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'fotos.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
