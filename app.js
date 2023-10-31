let cardIndex = 0;
let loader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1024);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Set camera 5 units away from the origin
camera.position.z = 5;

// Set initial textures
let frontMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('textures/x32/patakuningas@32x.png') });
let backMaterial  = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('textures/x32/pakka@32x.png') });
let sideMaterial  = new THREE.MeshStandardMaterial({ color: 0xffffff });

// Create an array for the front textures
const cardTextures = [];
for (let i = 0; i < 54; i++) {
    cardTextures.push(
        new THREE.TextureLoader().load(getCardImagePath(i))
    );
}

// Create an array for all textures for the card geometry
const materials = [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    frontMaterial,
    backMaterial
];

// Set bump and specular maps
frontMaterial.bumpMap = new THREE.TextureLoader().load('textures/x32/pakka_bump@32x.png');
backMaterial .bumpMap = new THREE.TextureLoader().load('textures/x32/pakka_bump@32x.png');

frontMaterial.specularMap = new THREE.TextureLoader().load('textures/x32/pakka_specular@32x.png');
backMaterial .specularMap = new THREE.TextureLoader().load('textures/x32/pakka_specular@32x.png');

frontMaterial.shininess = 40;
backMaterial .shininess = 40;

frontMaterial.bumpScale = 0.5;
backMaterial .bumpScale = 0.5;

frontMaterial.specular = new THREE.Color(0xbbccff);
backMaterial .specular = new THREE.Color(0xbbccff);

// Set the card shape
const geometry = new THREE.BoxGeometry(3, 4.5, 0.02);

// Create the card
const card1 = new THREE.Mesh(geometry, materials);
scene.add(card1);

// Add a directional light
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 0.8, 1);
light.target.position.set(0, 0, 0);
light.castShadow = false;
scene.add(light);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// Variables for the sine function controlling the turning and floating movement
let turnPhase = 1.0;

let xLevPhase = 0.0;
let yLevPhase = 0.0;
let zLevPhase = 0.0;

// Ticker
function animate() {
    requestAnimationFrame(animate);

    turnCard(card1, turnPhase);
    levitate(card1);

    renderer.render(scene, camera);

    if (turnPhase < 1.0) {
        turnPhase += 0.01;
    }

    xLevPhase = (xLevPhase + 0.0008) % 1.0;
    yLevPhase = (yLevPhase + 0.0005) % 1.0;
    zLevPhase = (zLevPhase + 0.0006) % 1.0;
}

// Start the animation
animate();

renderer.compile(scene, camera);

function turnCard(card, t) {
    card.rotation.x = 0;
    card.rotation.z = 0;
    if (t <= 0.2005304) {
        card.rotation.y = Math.PI * 2 * 6.77534196258 * t*t;
    } else {
        const newT = ((9/8)*t-(9/8));
        card.rotation.y = Math.PI * 2 * (newT*newT*newT + 1)
    }
}

function levitate(card) {
    card.rotation.x += 0.1 * (Math.sin(2 * xLevPhase * Math.PI));
    card.rotation.y += 0.1 * (Math.sin(2 * xLevPhase * Math.PI));
    card.rotation.z += 0.03 * (Math.sin(2 * zLevPhase * Math.PI));
}

function tryToPickCard() {
    pickCard(cardIndex);
}

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// Create an array of integers from 0 until 54 (card indices) and shuffle them
const deck = [];
for (let i = 0; i < 54; i++) {deck.push(i);} shuffle(deck);

function pickCard(index) {
    turnPhase = 0;
    setTimeout(
        changeCard,
        350,
        index
    )
    cardIndex++;
}

function changeCard(index) {
    frontMaterial.map = cardTextures[deck[index]];
}

function getCardImagePath(index) {
    let path = "textures/"
    path = path.concat("x32/")
    if (cardIndex >= 0) {
        switch (Math.floor(index / 13)) {
            case 0:  path = path.concat("hertta"); break;
            case 1:  path = path.concat("ruutu" ); break;
            case 2:  path = path.concat("risti" ); break;
            case 3:  path = path.concat("pata"  ); break;}
        switch (index % 13) {
            case 0:  path = path.concat("assa"      ); break;
            case 1:  path = path.concat("kakkonen"  ); break;
            case 2:  path = path.concat("kolmonen"  ); break;
            case 3:  path = path.concat("nelonen"   ); break;
            case 4:  path = path.concat("vitonen"   ); break;
            case 5:  path = path.concat("kutonen"   ); break;
            case 6:  path = path.concat("seitseman" ); break;
            case 7:  path = path.concat("kahdeksan" ); break;
            case 8:  path = path.concat("yhdeksan"  ); break;
            case 9:  path = path.concat("kymmenen"  ); break;
            case 10: path = path.concat("jatka"     ); break;
            case 11: path = path.concat("kuningatar"); break;
            case 12: path = path.concat("kuningas"  ); break;}
    } else {
        path = path.concat("pakka");
    }
    path = path.concat("@32x")
    path = path.concat(".png")
    return path;
}