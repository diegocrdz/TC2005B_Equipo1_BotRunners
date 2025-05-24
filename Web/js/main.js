import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';

// Contenedor para el modelo 3D
const canvas = document.getElementById('viewer3d');

// Configuración de la escena
const scene = new THREE.Scene();

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(25, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0.2, 1.8, 12);

// Configuración del renderizador
// alpha: true fondo transparente
// antialias: true suaviza los bordes
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Luz ambiental general
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
// Luz direccional para skippy
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 1, 2);
scene.add(directionalLight);

// Cargador de materiales y objetos
const mtlLoader = new MTLLoader(THREE.DefaultLoadingManager);
const objLoader = new OBJLoader(THREE.DefaultLoadingManager);

// Vairables para la posición y rotación del modelo
let model = null;
let targetRotationY = 0;
let targetRotationX = 0;
let baseRotationX = 0;
let baseRotationY = 0;

// Cargar modelo
mtlLoader.setPath('../models/');
objLoader.setPath('../models/');

// Cargar materiales
mtlLoader.load('skippy.mtl', (materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    // Cargar el modelo
    objLoader.load('skippy.obj', (object) => {
        // Ajustar la escala y posición del modelo
        object.scale.set(2, 2, 2);
        object.position.set(0, 0, 0);
        baseRotationX = Math.PI / 16;
        baseRotationY = Math.PI / 2 - Math.PI / 9;
        object.rotation.set(baseRotationX, baseRotationY, 0);
        model = object;
        scene.add(object);
    });
});

// Listener para mover el mouse
window.addEventListener('mousemove', (event) => {
    // Obtener coordenadas del mouse
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    targetRotationY = x * Math.PI / 20; // Limita el giro horizontal
    targetRotationX = y * Math.PI / 50; // Limita el giro vertical
});

function resizeRendererToDisplaySize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = renderer.domElement.width !== width || renderer.domElement.height !== height;

    if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

function animate() {
    resizeRendererToDisplaySize();

    if (model) {
        // Rotación suave con el mouse
        model.rotation.y += ((baseRotationY + targetRotationY) - model.rotation.y) * 0.1;
        model.rotation.x += ((baseRotationX + targetRotationX) - model.rotation.x) * 0.1;

        // Escala fija
        model.scale.set(1.5, 1.5, 1.5);

        // Ajustar cámara según ancho del canvas
        const baseDistance = 9;
        const scale = canvas.offsetWidth / 800;
        camera.position.z = baseDistance / scale; // se aleja si canvas es más grande
    }

    renderer.render(scene, camera);
}
// Llamar a la función animate en cada frame
renderer.setAnimationLoop(animate);