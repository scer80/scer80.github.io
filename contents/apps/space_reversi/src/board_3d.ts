import * as THREE from 'three';
import { BoardState, Player, BOARD_SIZE, LAYERS, PLAYER_COLORS } from './board_common';

export interface BoardRenderer3D {
  render(board: BoardState): void;
  resetCamera(): void;
}

export function createBoardRenderer3D(canvas: HTMLCanvasElement): BoardRenderer3D {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(600, 400);
  renderer.setClearColor(0x0a0a1a);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 600 / 400, 0.1, 1000);
  camera.position.set(12, 10, 12);
  camera.lookAt(3.5, 3.5, 3.5);

  const axesGroup = new THREE.Group();
  scene.add(axesGroup);
  axesGroup.position.set(-0.45, -0.45, -0.45);

  const arrowLength = 1.5;
  const arrowHeadLength = 0.3;
  const arrowHeadWidth = 0.15;

  const xArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0xff4444,
    arrowHeadLength,
    arrowHeadWidth
  );
  axesGroup.add(xArrow);

  const yArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x44ff44,
    arrowHeadLength,
    arrowHeadWidth
  );
  axesGroup.add(yArrow);

  const zArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x4444ff,
    arrowHeadLength,
    arrowHeadWidth
  );
  axesGroup.add(zArrow);

  function createTextSprite(text: string, color: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.5, 1);
    return sprite;
  }

  const xLabel = createTextSprite('X', '#ff4444');
  xLabel.position.set(arrowLength + 0.3, 0, 0);
  axesGroup.add(xLabel);

  const yLabel = createTextSprite('Y', '#44ff44');
  yLabel.position.set(0, arrowLength + 0.3, 0);
  axesGroup.add(yLabel);

  const zLabel = createTextSprite('Z', '#4444ff');
  zLabel.position.set(0, 0, arrowLength + 0.3);
  axesGroup.add(zLabel);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotation = { x: 0, y: 0 };

  function updateCamera() {
    const distance = 18;
    const centerX = 3.5;
    const centerY = 3.5;
    const centerZ = 3.5;
    
    camera.position.x = centerX + distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = centerY + distance * Math.sin(rotation.y);
    camera.position.z = centerZ + distance * Math.cos(rotation.x) * Math.cos(rotation.y);
    camera.lookAt(centerX, centerY, centerZ);
  }

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  let currentBoard: BoardState | null = null;

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    rotation.x -= deltaX * 0.01;
    rotation.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.y + deltaY * 0.01));
    updateCamera();
    previousMousePosition = { x: e.clientX, y: e.clientY };
    if (currentBoard) {
      for (let z = 0; z < LAYERS; z++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = currentBoard[z][y][x];
            const piece = pieces[z][y][x];
            if (cell === 0) {
              piece.visible = false;
            } else {
              piece.visible = true;
              piece.material = pieceMaterials[cell as Player];
            }
          }
        }
      }
      renderer.render(scene, camera);
    }
  });

  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.35 });

  const gridGroup = new THREE.Group();
  scene.add(gridGroup);

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const xPoints = [];
      for (let k = 0; k < BOARD_SIZE; k++) {
        xPoints.push(new THREE.Vector3(k, i, j));
      }
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(xPoints), lineMaterial));

      const yPoints = [];
      for (let k = 0; k < BOARD_SIZE; k++) {
        yPoints.push(new THREE.Vector3(i, k, j));
      }
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(yPoints), lineMaterial));

      const zPoints = [];
      for (let k = 0; k < BOARD_SIZE; k++) {
        zPoints.push(new THREE.Vector3(i, j, k));
      }
      gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(zPoints), lineMaterial));
    }
  }

  const pieceGeometry = new THREE.SphereGeometry(0.42, 16, 16);
  const pieceMaterials: Record<Player, THREE.MeshLambertMaterial> = {
    [Player.GREEN]: new THREE.MeshLambertMaterial({ color: 0x44ff44, transparent: true, opacity: 0.85 }),
    [Player.RED]: new THREE.MeshLambertMaterial({ color: 0xff4444, transparent: true, opacity: 0.85 }),
  };

  const pieces: THREE.Mesh[][][] = [];
  for (let z = 0; z < LAYERS; z++) {
    pieces[z] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      pieces[z][y] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        const piece = new THREE.Mesh(pieceGeometry, pieceMaterials[1]);
        piece.position.set(x, y, z);
        piece.visible = false;
        piece.renderOrder = 1;
        scene.add(piece);
        pieces[z][y][x] = piece;
      }
    }
  }

  updateCamera();

  return {
    render(board: BoardState) {
      currentBoard = board;
      for (let z = 0; z < LAYERS; z++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = board[z][y][x];
            const piece = pieces[z][y][x];

            if (cell === 0) {
              piece.visible = false;
            } else {
              piece.visible = true;
              piece.material = pieceMaterials[cell as Player];
            }
          }
        }
      }
      renderer.render(scene, camera);
    },

    resetCamera() {
      rotation = { x: Math.PI / 4, y: Math.PI / 4 };
      updateCamera();
      axesGroup.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    }
  };
}
