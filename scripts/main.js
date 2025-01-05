
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/FBXLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Load the FBX model
const loader = new FBXLoader();
loader.load(
    'https://threejs.org/examples/models/fbx/Samba_Dancing.fbx',
    (fbx) => {
        fbx.scale.set(0.01, 0.01, 0.01);
        scene.add(fbx);
        console.log('FBX model loaded:', fbx);
    },
    undefined,
    (error) => {
        console.error('Error loading FBX model:', error);
    }
);
// Set up the animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
