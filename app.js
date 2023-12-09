let cardIndex = 0;
let lastCardIndex = 0;

/*
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█  Boring rendering stuff  █
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█*/

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

// Add directional lights
const spotLight = new THREE.DirectionalLight(0xffffff, 1.0);
spotLight.position.set(0, 0.8, 1);
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = false;
scene.add(spotLight);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);




/*
█▀▀▀▀▀▀▀▀▀▀▀▀▀█
█  Materials  █
█▄▄▄▄▄▄▄▄▄▄▄▄▄█*/

// Set initial texturemaps
//let frontMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('texturemaps/x32/patakuningas@32x.png') });
let backMaterial  = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('texturemaps/x32/pakka@32x.png') });
let sideMaterial  = new THREE.MeshStandardMaterial({ color: 0xffffff });

// Create an array for the front texturemaps
const cardTextures = [];
for (let i = 0; i < 54; i++) {
    cardTextures.push(
        new THREE.TextureLoader().load(getCardImagePath(i))
    );
}

// Create an array for all texturemaps for the card geometry
/*
const materials = [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    frontMaterial,
    backMaterial
];*/

// Set bump and specular maps
/*
frontMaterial.bumpMap = new THREE.TextureLoader().load('texturemaps/x32/pakka_bump@32x.png');
backMaterial .bumpMap = new THREE.TextureLoader().load('texturemaps/x32/pakka_bump@32x.png');

frontMaterial.specularMap = new THREE.TextureLoader().load('texturemaps/x32/pakka_specular@32x.png');
backMaterial .specularMap = new THREE.TextureLoader().load('texturemaps/x32/pakka_specular@32x.png');

frontMaterial.shininess = 40;
backMaterial .shininess = 40;

frontMaterial.bumpScale = 0.2;
backMaterial .bumpScale = 0.2;

frontMaterial.specular = new THREE.Color(0xbbccff);
backMaterial .specular = new THREE.Color(0xbbccff);
*/



/*
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█  Cards and geometry  █
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█*/

// Create ground plane to hide the other cards
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({ color: 0x0f1024 }))
plane.position.z = -3;

scene.add(plane);

// Set the card shape
const geometry = new THREE.BoxGeometry(3, 4.5, 0.02);

const shuffle = (array) => {return array.sort(() => Math.random() - 0.5);};

let cards = [];

// Create the card meshes
const bumpMap     = new THREE.TextureLoader().load('texturemaps/x32/grainy_bump.png');
const specularMap = new THREE.TextureLoader().load('texturemaps/x32/full_specular.png');

for (let i = 0; i < 54; i++) {
    let frontMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(getCardImagePath(i)) });
    frontMaterial.bumpMap = bumpMap;
    frontMaterial.specularMap = specularMap;
    frontMaterial.shininess = 30;
    frontMaterial.bumpScale = 0.1;
    frontMaterial.specular = new THREE.Color(0xbbccff);
    backMaterial.bumpMap = bumpMap;
    backMaterial.specularMap = specularMap;
    backMaterial.shininess = 30;
    backMaterial.bumpScale = 0.1;
    backMaterial.specular = new THREE.Color(0xbbccff);
    const materials = [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        frontMaterial,
        backMaterial
    ]
    const card = new THREE.Mesh(geometry, materials);
    card.position.z = -6;
    scene.add(card);
    cards.push(card);
}








// Variables for the sine function controlling the turning and floating movement
let turnPhase = 1.0;

let xLevPhase = 0.0;
let yLevPhase = 0.0;
let zLevPhase = 0.0;

let xRotVel = 0;
let yRotVel = 0;
let zRotVel = 0;

let cooldown = 0;

// Ticker
let lastTimestamp = performance.now();
let deltaTime = 0;
function animate(timestamp) {
    deltaTime = timestamp - lastTimestamp;
    if (isNaN(deltaTime)) {deltaTime = 1}
    lastTimestamp = timestamp;

    requestAnimationFrame(animate);

    applyTurnForce();
    applyPressForce();
    applyReturnForce();
    levitate();
    dampenRotation();



    cards[cardIndex].rotation.x += xRotVel;
    cards[cardIndex].rotation.y += yRotVel;
    cards[cardIndex].rotation.z += zRotVel;

    cards[cardIndex].rotation.x += xRotVel;
    cards[cardIndex].rotation.y += yRotVel;
    cards[cardIndex].rotation.z += zRotVel;

    renderer.render(scene, camera);

    if (turnPhase < 1.0) {
        turnPhase += 0.01 * (deltaTime / 7);
    }

    if (cooldown > 0) {
        cooldown -= 0.005 * (deltaTime / 7);
    }

    xLevPhase = (xLevPhase + 0.0008) % 1.0;
    yLevPhase = (yLevPhase + 0.0005) % 1.0;
    zLevPhase = (zLevPhase + 0.0006) % 1.0;
}

// Start the animation
animate();

renderer.compile(scene, camera);

function applyTurnForce() {
    xRotVel += (deltaTime / 7) * 0.00005 * (1 - Math.cos(2 * Math.PI * turnPhase));
    yRotVel += (deltaTime / 7) *  0.0014  * (1 - Math.cos(2 * Math.PI * turnPhase));
    zRotVel += (deltaTime / 7) * 0.00005 * (1 - Math.cos(2 * Math.PI * turnPhase));
}

function applyPressForce() {
    if (turnPhase < .5) {
        cards[cardIndex].position.z = - Math.sin(2 * Math.PI * turnPhase) * Math.sin(2 * Math.PI * turnPhase);
    } else {
        cards[cardIndex].position.z = 0;
    }
}

function applyReturnForce() {
    xRotVel += 0.001 * Math.sin(cards[cardIndex].rotation.x + Math.PI);
    yRotVel += 0.001 * Math.sin(cards[cardIndex].rotation.y + Math.PI);
    zRotVel += 0.001 * Math.sin(cards[cardIndex].rotation.z + Math.PI);
}

function dampenRotation() {
    xRotVel *= 0.96;
    yRotVel *= 0.96;
    zRotVel *= 0.96;
}

function levitate() {
    xRotVel += 0.00005 * (Math.sin(2 * xLevPhase * Math.PI));
    yRotVel += 0.00005 * (Math.sin(2 * xLevPhase * Math.PI));
    zRotVel += 0.00002 * (Math.sin(2 * zLevPhase * Math.PI));
}

function tryToPickCard() {
    if (cooldown <= 0) {
        pickCard(cardIndex);
    }
}

// Create an array of integers from 0 until 54 (card indices) and shuffle them
const deck = [];
for (let i = 0; i < 54; i++) {deck.push(i);} shuffle(deck);

function pickCard() {
    cooldown = 1.0;
    turnPhase = 0;
    setTimeout(
        changeCard,
        400
    )
}

function changeCard() {

    // Move current card down
    cards[cardIndex].position.z = -6;

    lastCardIndex = cardIndex;
    cardIndex     = Math.floor(Math.random() * 54);

    // Move next card up
    cards[cardIndex].position.y = 0;

    cards[cardIndex].rotation.x = cards[lastCardIndex].rotation.x;
    cards[cardIndex].rotation.y = cards[lastCardIndex].rotation.y;
    cards[cardIndex].rotation.z = cards[lastCardIndex].rotation.z;

    cards[lastCardIndex].rotation.x = 0;
    cards[lastCardIndex].rotation.y = 0;
    cards[lastCardIndex].rotation.z = 0;
}

function getCardImagePath(index) {
    let path = "texturemaps/"
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
