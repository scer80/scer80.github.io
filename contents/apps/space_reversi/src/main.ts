import { createBoardRenderer, Player } from './board';
import { createGameState, makeMove, getScore, GameState } from './game';

const canvas3d = document.getElementById('canvas3d') as HTMLCanvasElement;
const canvas2d = document.getElementById('board2d') as HTMLCanvasElement;

const gameState = createGameState();
const renderer = createBoardRenderer(canvas3d, canvas2d);

const greenStatus = document.getElementById('green-status')!;
const redStatus = document.getElementById('red-status')!;
const greenAction = document.getElementById('green-action')!;
const redAction = document.getElementById('red-action')!;

function updateStatus() {
  if (gameState.gameOver) {
    const score = getScore(gameState.board);
    if (gameState.winner === Player.GREEN) {
      greenAction.textContent = 'Wins!';
      redAction.textContent = 'Loses';
    } else if (gameState.winner === Player.RED) {
      greenAction.textContent = 'Loses';
      redAction.textContent = 'Wins!';
    } else {
      greenAction.textContent = 'Draw';
      redAction.textContent = 'Draw';
    }
    greenStatus.classList.remove('active');
    redStatus.classList.remove('active');
  } else {
    if (gameState.currentPlayer === Player.GREEN) {
      greenAction.textContent = 'Move';
      redAction.textContent = 'Wait';
      greenStatus.classList.add('active');
      redStatus.classList.remove('active');
    } else {
      greenAction.textContent = 'Wait';
      redAction.textContent = 'Move';
      greenStatus.classList.remove('active');
      redStatus.classList.add('active');
    }
  }
}

function render() {
  renderer.render(gameState.board, gameState.currentPlayer, gameState.validMoves);
  updateStatus();
}

canvas2d.addEventListener('click', (e) => {
  if (gameState.gameOver) return;

  const rect = canvas2d.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cell = renderer.getCellFromClick(x, y);
  if (cell) {
    const moved = makeMove(gameState, cell.x, cell.y, cell.z);
    if (moved) {
      render();
    }
  }
});

render();
