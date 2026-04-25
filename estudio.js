function mudarMolde() {
    const formato = document.getElementById('f-formato').value;
    const molde = document.getElementById('molde');
    const cabineExtra = document.getElementById('cabine-extra');

    molde.className = formato;
    
    if (formato === 'p-cabine') {
        cabineExtra.style.display = 'contents';
    } else {
        cabineExtra.style.display = 'none';
    }
}

document.getElementById('f-input').onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => {
        document.getElementById('main-img').src = ev.target.result;
        document.querySelectorAll('.clone').forEach(img => img.src = ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

async function baixarPNG() {
    const area = document.getElementById('molde');
    const canvas = await html2canvas(area, { scale: 3, useCORS: true });
    const link = document.createElement('a');
    link.download = 'nostalgicas-foto.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
