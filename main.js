import * as THREE from 'three';
import { OBJLoader } from './loaders/OBJLoader.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { FontLoader } from './loaders/FontLoader.js';
import { TextGeometry } from './loaders/TextGeometry.js';

// se realiza la configuración de la escena
const scene = new THREE.Scene();

// Cambia el color del fondo
scene.background = new THREE.Color(0xFFFFFF); // Color azul cielo

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añade una luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Añade una luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040); 
scene.add(ambientLight);

// Configura OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI; // Permite rotación completa desde arriba hacia abajo


const cocheMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0xff0000, 
    metalness: 0.5, 
    roughness: 0.2, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
});

const aroMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080, // Esto da color gris metálico para los aros
    metalness: 1,
    roughness: 0.4
});

const ruedaMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Esto da color negro para las ruedas
    metalness: 0.2,
    roughness: 0.9
});

const parabrisasMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, //esto da  color negro para el parabrisas (puedes cambiarlo a transparente si lo prefieres)
    metalness: 0.1,
    roughness: 0.2,
    opacity: 0.5,
    transparent: true
});

// Esta es una función para crear texto 3D
function createText(text, position) {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const geometry = new TextGeometry(text, {
            font: font,
            size: 0.1,
            height: 0.02,
        });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        scene.add(mesh);
    });
}

// Carga el modelo OBJ
const loader = new OBJLoader();
loader.load('../Lamborghini_Huracan_LP580-2_2017.obj', function (object) {
    console.log("Modelo cargado:", object);

    // Aplica materiales a las diferentes partes del objeto
    object.traverse(function (child) {
        if (child.isMesh) {
            if (child.name.toLowerCase().includes('wheel') || child.name.toLowerCase().includes('tire')) {
                child.material = ruedaMaterial; // Aplica material negro a las ruedas
                createText('Rueda', child.position); // Añade etiqueta de texto
            } else if (child.name.toLowerCase().includes('rim') || child.name.toLowerCase().includes('hubcap')) {
                child.material = aroMaterial; // Aplica material de aros
                createText('Aro', child.position); // Añadie etiqueta de texto
            } else if (child.name.toLowerCase().includes('windshield') || child.name.toLowerCase().includes('glass')) {
                child.material = parabrisasMaterial; // Aplica material al parabrisas
                createText('Parabrisas', child.position); // Añade etiqueta de texto
            } else {
                child.material = cocheMaterial; // Aplica material del coche
            }
        }
    });

    scene.add(object);

    // Ajusta la escala del modelo
    const scale = 0.01; // Reducimos la escala
    object.scale.set(scale, scale, scale);

    // Ajusta la posición del modelo
    object.position.set(0, -0.5, 0);

    // Ajusta la rotación del modelo
    object.rotation.y = Math.PI / 4; // Rotar el modelo para ver mejor las dimensiones 3D
}, 
function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% cargado');
}, 
function (error) {
    console.log('Error al cargar el modelo:', error);
});

// Configuración de la cámara
camera.position.set(0, 2, 10); 

// Función de renderizado
const animate = function () {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar los controles
    renderer.render(scene, camera);
};
animate();