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

camera.position.z = 5;

// Set card shape
const texture = new THREE.TextureLoader().load('textures/pakka@32x.png' );

let frontMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('textures/x32/pakka@32x.png') });
let backMaterial  = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('textures/x32/pakka@32x.png') });
let sideMaterial  = new THREE.MeshStandardMaterial({ color: 0xffffff });

const materials = [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    frontMaterial,
    backMaterial
];

frontMaterial.bumpMap = new THREE.TextureLoader().load('textures/x32/pakka_bump@32x.png');
backMaterial.bumpMap  = new THREE.TextureLoader().load('textures/x32/pakka_bump@32x.png');

frontMaterial.specularMap = new THREE.TextureLoader().load('textures/x32/pakka_specular@32x.png');
backMaterial.specularMap  = new THREE.TextureLoader().load('textures/x32/pakka_specular@32x.png');

frontMaterial.shininess = 70;
backMaterial.shininess  = 70;

frontMaterial.specular = new THREE.Color(0xbbccff);
backMaterial.specular  = new THREE.Color(0xbbccff);

const geometry = new THREE.BoxGeometry(2, 3, 0.015);

// Create two cards
const card1 = new THREE.Mesh(geometry, materials);
//const card2 = new THREE.Mesh(geometry, materials); TODO: Add a second card
scene.add(card1);
//scene.add(card2);


const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 0.5, 1);
light.target.position.set(0, 0, 0);
light.castShadow = false;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

//card1.rotation.x = Math.PI / 2;
//card2.rotation.x = Math.PI / 2;

let currentCard = 1;

let turnPhase = 0.0;

let xLevPhase = 0.0;
let yLevPhase = 0.0;
let zLevPhase = 0.0;

function animate() {
    requestAnimationFrame(animate);

    turnCard(card1, turnPhase);
    levitate(card1);

    renderer.render(scene, camera);

    if (turnPhase < 2.0) {
        turnPhase += 0.005;
    }

    xLevPhase = (xLevPhase + 0.0004) % 1.0;
    yLevPhase = (yLevPhase + 0.0003) % 1.0;
    zLevPhase = (zLevPhase + 0.0005) % 1.0;
}

animate();

function turnCard(card, t) {
    if (t <= 1) {
        card.rotation.y = Math.PI * 0.5 * (t*t*t*t*t*t*t*t*t);
    } else {
        card.rotation.y = Math.PI * 0.5 * (2 + (t-2)*(t-2)*(t-2)*(t-2)*(t-2)*(t-2)*(t-2)*(t-2)*(t-2))
    }
}

function levitate(card) {
    card.rotation.x = 0.1 * (Math.sin(2 * xLevPhase * Math.PI));
    card.rotation.y += 0.1 * (Math.sin(2 * xLevPhase * Math.PI));
    card.rotation.z = 0.03 * (Math.sin(2 * zLevPhase * Math.PI));
}
