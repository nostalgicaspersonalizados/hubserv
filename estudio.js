const fInput = document.getElementById('f-input');
const fImg = document.getElementById('foto-view');
const molde = document.getElementById('molde-print');

function mudarMolde() {
    const s = document.getElementById('f-formato').value;
    molde.className = s;
    document.getElementById('cabine-slots').style.display = (s === 'p-cabine') ? 'contents' : 'none';
}

fInput.onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => {
        fImg.src = ev.target.result;
        document.querySelectorAll('.foto-clone').forEach(i => i.src = ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

async function baixarPNG() {
    const canvas = await html2canvas(molde, { scale: 3 });
    const a = document.createElement('a');
    a.download = 'nostalgicas-print.png';
    a.href = canvas.toDataURL();
    a.click();
}
