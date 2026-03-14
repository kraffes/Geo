const locations = [
    { id: "suez", name: "Canal de Suez", t: 39, l: 56.5, info: "Relie Méditerranée et Mer Rouge. Vital pour le commerce Asie-Europe." },
    { id: "panama", name: "Canal de Panama", t: 53, l: 25.5, info: "Raccourcit la route entre l'Atlantique et le Pacifique." },
    { id: "malacca", name: "Détroit de Malacca", t: 62, l: 77.5, info: "Point de passage le plus emprunté au monde (pétrole, marchandises)." },
    { id: "ormuz", name: "Détroit d'Ormuz", t: 41.5, l: 61.5, info: "Verrou pétrolier stratégique du Golfe Arabo-Persique." },
    { id: "gibraltar", name: "Détroit de Gibraltar", t: 36, l: 46.5, info: "Seul accès naturel entre l'Atlantique et la Méditerranée." },
    { id: "bab", name: "Bab-el-Mandeb", t: 48, l: 57.5, info: "Verrou entre l'Océan Indien et la Mer Rouge (accès à Suez)." },
    { id: "nrange", name: "Northern Range", t: 28, l: 49.5, info: "2ème façade maritime mondiale (du Havre à Hambourg)." },
    { id: "shanghai", name: "Shanghai", t: 40, l: 83.5, info: "1er port mondial de marchandises (conteneurs)." },
    { id: "singapour", name: "Singapour", t: 65, l: 77.5, info: "Port hub majeur au cœur du détroit de Malacca." },
    { id: "guinee", name: "Golfe de Guinée", t: 55, l: 50, info: "Zone riche en hydrocarbures, enjeu de piraterie." }
];

let score = 0;
let seconds = 0;
let foundCount = 0;
let highscore = localStorage.getItem('geo-highscore') || 0;
document.getElementById('high-score').textContent = highscore;

// Timer
const timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = seconds;
}, 1000);

const bank = document.getElementById('labels-bank');
const map = document.getElementById('map-frame');

// Initialisation des éléments
function init() {
    [...locations].sort(() => Math.random() - 0.5).forEach(loc => {
        const lb = document.createElement('div');
        lb.className = 'label';
        lb.id = loc.id;
        lb.draggable = true;
        lb.textContent = loc.name;
        lb.ontouchstart = (e) => e.preventDefault(); // Support mobile basique
        lb.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.id));
        bank.appendChild(lb);

        const dz = document.createElement('div');
        dz.className = 'dropzone';
        dz.style.top = loc.t + "%";
        dz.style.left = loc.l + "%";
        dz.dataset.target = loc.id;
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('hover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('hover'));
        dz.addEventListener('drop', handleDrop);
        map.appendChild(dz);
    });
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('hover');
    const id = e.dataTransfer.getData('text');
    const loc = locations.find(l => l.id === id);
    
    if (id === this.dataset.target) {
        this.classList.add('found');
        this.textContent = loc.name;
        document.getElementById(id).style.visibility = 'hidden';
        showInfo(loc);
        updateScore(50);
        foundCount++;
        checkWin();
    } else {
        updateScore(-15);
    }
}

function showInfo(loc) {
    const modal = document.getElementById('info-modal');
    document.getElementById('modal-title').textContent = loc.name;
    document.getElementById('modal-desc').textContent = loc.info;
    modal.style.display = 'block';
    setTimeout(() => modal.style.display = 'none', 6000);
}

function updateScore(pts) {
    score = Math.max(0, score + pts);
    document.getElementById('score').textContent = score;
    if(score > highscore) {
        highscore = score;
        localStorage.setItem('geo-highscore', highscore);
        document.getElementById('high-score').textContent = highscore;
    }
}

function checkWin() {
    if(foundCount === locations.length) {
        clearInterval(timerInterval);
        alert(`Terminé ! Score : ${score} en ${seconds}s. Tes révisions avancent bien !`);
    }
}

init();
