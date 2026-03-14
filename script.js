// Empêche l'iPad de faire défiler la page quand on glisse une étiquette
window.addEventListener('touchmove', function() {}, {passive: false});

const locations = [
    { id: "suez", name: "Canal de Suez", t: 43.5, l: 56.5, info: "Relie Méditerranée et Mer Rouge. Vital pour le commerce Asie-Europe." },
    { id: "panama", name: "Canal de Panama", t: 55, l: 28, info: "Raccourcit la route entre l'Atlantique et le Pacifique." },
    { id: "malacca", name: "Détroit de Malacca", t: 59, l: 77, info: "Point de passage le plus emprunté au monde." },
    { id: "ormuz", name: "Détroit d'Ormuz", t: 43.5, l: 63, info: "Verrou pétrolier stratégique du Golfe Arabo-Persique." },
    { id: "gibraltar", name: "Détroit de Gibraltar", t: 38.5, l: 48, info: "Seul accès naturel entre l'Atlantique et la Méditerranée." },
    { id: "bab", name: "Bab-el-Mandeb", t: 48.5, l: 59, info: "Verrou entre l'Océan Indien et la Mer Rouge (accès à Suez)." },
    { id: "nrange", name: "Northern Range", t: 30, l: 50.5, info: "2ème façade maritime mondiale (du Havre à Hambourg)." },
    { id: "shanghai", name: "Shanghai", t: 41, l: 83.5, info: "1er port mondial de marchandises." },
    { id: "singapour", name: "Singapour", t: 60.5, l: 78, info: "Port hub majeur au cœur du détroit de Malacca." },
    { id: "guinee", name: "Golfe de Guinée", t: 55, l: 50, info: "Zone riche en hydrocarbures, enjeu de piraterie." }
];

let score = 0;
let seconds = 0;
let foundCount = 0;
let highscore = 0;

try {
    highscore = localStorage.getItem('geo-highscore') || 0;
} catch (e) {
    console.warn("Le navigateur bloque la sauvegarde locale.");
}
document.getElementById('high-score').textContent = highscore;

const timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = seconds;
}, 1000);

const bank = document.getElementById('labels-bank');
const map = document.getElementById('map-frame');

function init() {
    [...locations].sort(() => Math.random() - 0.5).forEach(loc => {
        const lb = document.createElement('div');
        lb.className = 'label';
        lb.id = loc.id;
        lb.draggable = true;
        lb.textContent = loc.name;
        
        // CORRECTION iPAD : On utilise 'text' au lieu de 'text/plain'
        lb.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.id));
        bank.appendChild(lb);

        const dz = document.createElement('div');
        dz.className = 'dropzone';
        dz.style.top = loc.t + "%";
        dz.style.left = loc.l + "%";
        dz.dataset.target = loc.id;
        
        // CORRECTION iPAD : Ajout du dragenter avec preventDefault
        dz.addEventListener('dragenter', e => e.preventDefault()); 
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('hover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('hover'));
        dz.addEventListener('drop', handleDrop);
        
        map.appendChild(dz);
    });
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('hover');
    
    // CORRECTION iPAD : On récupère avec 'text'
    const id = e.dataTransfer.getData('text');
    if(!id) return; 
    
    const loc = locations.find(l => l.id === id);
    
    if (id === this.dataset.target) {
        this.classList.add('found');
        this.textContent = loc.name;
        document.getElementById(id).style.display = 'none'; 
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
        try {
            localStorage.setItem('geo-highscore', highscore);
        } catch (e) {}
        document.getElementById('high-score').textContent = highscore;
    }
}

function checkWin() {
    if(foundCount === locations.length) {
        clearInterval(timerInterval);
        document.getElementById('btn-sos').disabled = true;
        setTimeout(() => {
            alert(`Terminé ! Score : ${score} en ${seconds}s. Tes révisions avancent bien !`);
        }, 500);
    }
}

function useHint() {
    const unplacedZones = Array.from(document.querySelectorAll('.dropzone:not(.found)'));
    if (unplacedZones.length === 0) return;

    const randomZone = unplacedZones[Math.floor(Math.random() * unplacedZones.length)];
    const targetId = randomZone.dataset.target;
    const targetLabel = document.getElementById(targetId);

    randomZone.classList.add('hint-active');
    if (targetLabel) targetLabel.classList.add('hint-active');
    
    setTimeout(() => {
        randomZone.classList.remove('hint-active');
        if (targetLabel) targetLabel.classList.remove('hint-active');
    }, 3000);
    
    updateScore(-20);
    
    if (unplacedZones.length === 1) {
        document.getElementById('btn-sos').disabled = true;
    }
}

init();
