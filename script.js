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

// Gestion du Chronomètre
const timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = seconds;
}, 1000);

const bank = document.getElementById('labels-bank');
const map = document.getElementById('map-frame');

// Fonction d'initialisation du jeu
function init() {
    [...locations].sort(() => Math.random() - 0.5).forEach(loc => {
        // Création des étiquettes
        const lb = document.createElement('div');
        lb.className = 'label';
        lb.id = loc.id;
        lb.draggable = true;
        lb.textContent = loc.name;
        
        // Configuration du drag (texte plat pour compatibilité mobile)
        lb.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });
        bank.appendChild(lb);

        // Création des zones sur la carte
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

// Fonction gérant le moment où l'élève lâche une étiquette
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('hover');
    
    // Récupère l'ID envoyé pendant le dragstart
    const id = e.dataTransfer.getData('text/plain');
    if(!id) return; // Sécurité
    
    const loc = locations.find(l => l.id === id);
    
    // Vérification de la réponse
    if (id === this.dataset.target) {
        this.classList.add('found');
        this.textContent = loc.name;
        document.getElementById(id).style.display = 'none'; // Cache l'étiquette initiale
        showInfo(loc);
        updateScore(50);
        foundCount++;
        checkWin();
    } else {
        updateScore(-15);
    }
}

// Affiche la petite fenêtre d'information pédagogique
function showInfo(loc) {
    const modal = document.getElementById('info-modal');
    document.getElementById('modal-title').textContent = loc.name;
    document.getElementById('modal-desc').textContent = loc.info;
    modal.style.display = 'block';
    
    // Disparaît après 6 secondes
    setTimeout(() => modal.style.display = 'none', 6000);
}

// Met à jour les scores
function updateScore(pts) {
    score = Math.max(0, score + pts);
    document.getElementById('score').textContent = score;
    
    // Sauvegarde du meilleur score
    if(score > highscore) {
        highscore = score;
        localStorage.setItem('geo-highscore', highscore);
        document.getElementById('high-score').textContent = highscore;
    }
}

// Vérifie si toutes les étiquettes sont placées
function checkWin() {
    if(foundCount === locations.length) {
        clearInterval(timerInterval);
        document.getElementById('btn-sos').disabled = true; // Désactive le SOS
        setTimeout(() => {
            alert(`Terminé ! Score : ${score} en ${seconds}s. Tes révisions avancent bien !`);
        }, 500);
    }
}

// Fonction du bouton SOS
function useHint() {
    // Cherche les zones qui n'ont pas encore la classe "found"
    const unplacedZones = Array.from(document.querySelectorAll('.dropzone:not(.found)'));
    if (unplacedZones.length === 0) return;

    // Prend une zone au hasard et la fait clignoter
    const randomZone = unplacedZones[Math.floor(Math.random() * unplacedZones.length)];
    randomZone.classList.add('hint-active');
    
    setTimeout(() => {
        randomZone.classList.remove('hint-active');
    }, 3000);

    updateScore(-20);
    
    // Si c'est la dernière zone, on désactive le bouton
    if (unplacedZones.length === 1) {
        document.getElementById('btn-sos').disabled = true;
    }
}

// Lancement de l'application
init();

