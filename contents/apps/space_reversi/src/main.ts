import { createBoardRenderer, Player } from './board';
import { createGameState, makeMove, getScore, getBestMove, GameState } from './game';

const canvas3d = document.getElementById('canvas3d') as HTMLCanvasElement;
const canvas2d = document.getElementById('board2d') as HTMLCanvasElement;

let gameState = createGameState();
const renderer = createBoardRenderer(canvas3d, canvas2d);

const greenStatus = document.getElementById('green-status')!;
const redStatus = document.getElementById('red-status')!;
const greenAction = document.getElementById('green-action')!;
const redAction = document.getElementById('red-action')!;

let isAiThinking = false;

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
    if (isAiThinking) {
      if (gameState.currentPlayer === Player.GREEN) {
        greenAction.textContent = 'Thinking';
        redAction.textContent = 'Wait';
      } else {
        greenAction.textContent = 'Wait';
        redAction.textContent = 'Thinking';
      }
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
}

function render() {
  renderer.render(gameState.board, gameState.currentPlayer, gameState.validMoves);
  updateStatus();
}

canvas2d.addEventListener('click', (e) => {
  if (gameState.gameOver || isAiThinking) return;

  const rect = canvas2d.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cell = renderer.getCellFromClick(x, y);
  if (cell) {
    const moved = makeMove(gameState, cell.x, cell.y, cell.z);
    if (moved) {
      render();
      checkAndMakeAiMove();
    }
  }
});

function checkAndMakeAiMove() {
  if (gameState.gameOver) return;
  
  const isGreenAi = greenAiCheck.checked;
  const isRedAi = redAiCheck.checked;
  
  const currentIsAi = (gameState.currentPlayer === Player.GREEN && isGreenAi) ||
                      (gameState.currentPlayer === Player.RED && isRedAi);
  
  if (currentIsAi) {
    isAiThinking = true;
    updateStatus();
    
    setTimeout(() => {
      const depthSelect = gameState.currentPlayer === Player.GREEN ? greenDepthSelect : redDepthSelect;
      const depth = parseInt(depthSelect.value);
      const bestMove = getBestMove(gameState.board, gameState.currentPlayer, depth);
      
      if (bestMove) {
        makeMove(gameState, bestMove.x, bestMove.y, bestMove.z);
      }
      
      isAiThinking = false;
      render();
      checkAndMakeAiMove();
    }, 50);
  }
}

const resetBtn = document.getElementById('reset-btn')!;
resetBtn.addEventListener('click', () => {
  gameState = createGameState();
  renderer.resetCamera();
  isAiThinking = false;
  render();
  checkAndMakeAiMove();
});

const greenAiCheck = document.getElementById('green-ai') as HTMLInputElement;
const redAiCheck = document.getElementById('red-ai') as HTMLInputElement;
const greenAiLabel = document.getElementById('green-ai-label')!;
const redAiLabel = document.getElementById('red-ai-label')!;
const greenDepthSelect = document.getElementById('green-depth-select') as HTMLSelectElement;
const redDepthSelect = document.getElementById('red-depth-select') as HTMLSelectElement;

function updateAiLabels() {
  greenAiLabel.textContent = greenAiCheck.checked ? 'AI' : 'User';
  redAiLabel.textContent = redAiCheck.checked ? 'AI' : 'User';
}

greenAiCheck.addEventListener('change', () => {
  updateAiLabels();
  checkAndMakeAiMove();
});

redAiCheck.addEventListener('change', () => {
  updateAiLabels();
  checkAndMakeAiMove();
});

updateAiLabels();

render();
checkAndMakeAiMove();
