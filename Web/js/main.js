import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';

// Contenedor para el modelo 3D
const canvas = document.getElementById('viewer3d');

// Configuración de la escena
const scene = new THREE.Scene();

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(20, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 1.2, 10);

// Configuración del renderizador
// alpha: true fondo transparente
// antialias: true suaviza los bordes
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// Luz ambiental general
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
// Luz direccional para skippy
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-1, 1, 1);
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

// Cargar materiales
mtlLoader.load('../models/skippy.mtl', (materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    // Cargar el modelo
    objLoader.load('../models/skippy.obj', (object) => {
        scene.add(object);
        // Ajustar la escala y posición del modelo
        object.position.set(0, 0, 0);
        baseRotationX = Math.PI / 16;
        baseRotationY = Math.PI / 2 - Math.PI / 9;
        object.rotation.set(baseRotationX, baseRotationY, 0);
        model = object;
    });
});

// Listener para mover el mouse
window.addEventListener('mousemove', (event) => {
    // Obtener coordenadas del mouse
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    targetRotationY = x * Math.PI / 10; // Limita el giro horizontal
    targetRotationX = y * Math.PI / 20; // Limita el giro vertical
});

// Función para ajustar el tamaño del renderizador al tamaño de la ventana
function resizeRendererToDisplaySize() {
    // Obtener el tamaño del canvas
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    // Comprobar si el tamaño del canvas ha cambiado
    const needResize = renderer.domElement.width !== width || renderer.domElement.height !== height;

    // Si el tamaño ha cambiado, ajustar el tamaño del renderizador
    if (needResize) {
        renderer.setSize(width, height, false); // false evita limpiar el canvas
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}
window.addEventListener('resize', resizeRendererToDisplaySize);

// Función para animar el modelo cuando se mueve el mouse
function animate() {
    resizeRendererToDisplaySize();
    if (model) {
        // Actualizar la rotación del modelo
        // Se multiplica por 0.1 para suavizar el movimiento
        model.rotation.y += ((baseRotationY + targetRotationY) - model.rotation.y) * 0.1;
        model.rotation.x += ((baseRotationX + targetRotationX) - model.rotation.x) * 0.1;
    }
    // Actualiza el renderizador para que se vea el modelo
    renderer.render(scene, camera);
}
// Llamar a la función animate en cada frame
renderer.setAnimationLoop(animate);