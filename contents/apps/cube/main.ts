/// <reference types="three" />

// Three.js scene setup
import * as THREE from 'three';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
let rotationInfo: HTMLDivElement | null = null;

function init(): void {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 10;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // create rotation info overlay
    rotationInfo = document.createElement('div');
    rotationInfo.id = 'rotation-info';
    rotationInfo.style.position = 'absolute';
    rotationInfo.style.top = '12px';
    rotationInfo.style.right = '12px';
    rotationInfo.style.padding = '8px 10px';
    rotationInfo.style.background = 'rgba(0,0,0,0.6)';
    rotationInfo.style.color = 'white';
    rotationInfo.style.fontFamily = 'monospace, monospace';
    rotationInfo.style.fontSize = '12px';
    rotationInfo.style.borderRadius = '6px';
    rotationInfo.style.zIndex = '1000';
    rotationInfo.style.whiteSpace = 'pre';
    rotationInfo.style.textAlign = 'right';
    if (container) container.appendChild(rotationInfo);

    // Create cube with different colored faces
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow
        new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta
        new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Cyan
    ];
    
    cube = new THREE.Mesh(geometry, materials);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    // Add edges to the cube for better visibility
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cube.add(wireframe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Event listeners
    setupEventListeners();

    // Start animation loop
    animate();
}

function setupEventListeners(): void {
    const canvas = renderer.domElement;

    // Mouse events
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

    // Touch events for mobile
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseDown(event: MouseEvent): void {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event: MouseEvent): void {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    rotationVelocity.x = deltaMove.y * 0.01;
    rotationVelocity.y = deltaMove.x * 0.01;

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp(): void {
    isDragging = false;
}

function onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchMove(event: TouchEvent): void {
    if (!isDragging || event.touches.length !== 1) return;

    event.preventDefault();
    
    const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
    };

    rotationVelocity.x = deltaMove.y * 0.02;
    rotationVelocity.y = deltaMove.x * 0.02;

    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function onTouchEnd(): void {
    isDragging = false;
}

function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(): void {
    requestAnimationFrame(animate);

    // Apply rotation velocity with damping
    if (!isDragging) {
        rotationVelocity.x *= (1 - 1e-2);
        rotationVelocity.y *= (1 - 1e-2);
    }

    cube.rotation.x += rotationVelocity.x;
    cube.rotation.y += rotationVelocity.y;

    // Add subtle auto-rotation when not being dragged
    //if (!isDragging && Math.abs(rotationVelocity.x) < 0.001 && Math.abs(rotationVelocity.y) < 0.001) {
    //    cube.rotation.y += 0.005;
    //}

    // update rotation overlay
    if (rotationInfo) {
        const vx = (rotationVelocity.x ?? 0);
        const vy = (rotationVelocity.y ?? 0);
        rotationInfo.innerText = `rotationVelocity.x: ${vx.toFixed(3)}\n` +
                               `rotationVelocity.y: ${vy.toFixed(3)}`;
    }

    renderer.render(scene, camera);
}

// Initialize the scene when the page loads
window.addEventListener('load', init);
