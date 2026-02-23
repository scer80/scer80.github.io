import { BoardState, Player, BOARD_SIZE, LAYERS } from './board_common';

const DIRECTIONS: [number, number, number][] = [];

for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      if (dx !== 0 || dy !== 0 || dz !== 0) {
        DIRECTIONS.push([dx, dy, dz]);
      }
    }
  }
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  validMoves: Set<string>;
  gameOver: boolean;
  winner: Player | null;
}

export function createGameState(): GameState {
  const board: BoardState = [];
  for (let z = 0; z < LAYERS; z++) {
    board[z] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      board[z][y] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        board[z][y][x] = 0;
      }
    }
  }

  board[3][3][3] = Player.RED;
  board[3][3][4] = Player.GREEN;
  board[3][4][3] = Player.GREEN;
  board[3][4][4] = Player.RED;
  board[4][3][3] = Player.GREEN;
  board[4][3][4] = Player.RED;
  board[4][4][3] = Player.RED;
  board[4][4][4] = Player.GREEN;

  const validMoves = getValidMoves(board, Player.GREEN);

  return {
    board,
    currentPlayer: Player.GREEN,
    validMoves,
    gameOver: false,
    winner: null,
  };
}

export function getValidMoves(board: BoardState, player: Player): Set<string> {
  const moves = new Set<string>();
  const opponent = player === Player.GREEN ? Player.RED : Player.GREEN;

  for (let z = 0; z < LAYERS; z++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[z][y][x] !== 0) continue;

        for (const [dx, dy, dz] of DIRECTIONS) {
          let nx = x + dx;
          let ny = y + dy;
          let nz = z + dz;
          let hasOpponent = false;

          while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && nz >= 0 && nz < LAYERS) {
            const cell = board[nz][ny][nx];
            if (cell === opponent) {
              hasOpponent = true;
            } else if (cell === player) {
              if (hasOpponent) {
                moves.add(`${x},${y},${z}`);
              }
              break;
            } else {
              break;
            }
            nx += dx;
            ny += dy;
            nz += dz;
          }
        }
      }
    }
  }

  return moves;
}

function getFlippedPieces(board: BoardState, x: number, y: number, z: number, player: Player): [number, number, number][] {
  const flipped: [number, number, number][] = [];
  const opponent = player === Player.GREEN ? Player.RED : Player.GREEN;

  for (const [dx, dy, dz] of DIRECTIONS) {
    let nx = x + dx;
    let ny = y + dy;
    let nz = z + dz;
    const directionFlipped: [number, number, number][] = [];

    while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && nz >= 0 && nz < LAYERS) {
      const cell = board[nz][ny][nx];
      if (cell === opponent) {
        directionFlipped.push([nx, ny, nz]);
      } else if (cell === player) {
        if (directionFlipped.length > 0) {
          flipped.push(...directionFlipped);
        }
        break;
      } else {
        break;
      }
      nx += dx;
      ny += dy;
      nz += dz;
    }
  }

  return flipped;
}

export function makeMove(state: GameState, x: number, y: number, z: number): boolean {
  const key = `${x},${y},${z}`;
  if (!state.validMoves.has(key)) {
    return false;
  }

  state.board[z][y][x] = state.currentPlayer;

  const flipped = getFlippedPieces(state.board, x, y, z, state.currentPlayer);
  for (const [fx, fy, fz] of flipped) {
    state.board[fz][fy][fx] = state.currentPlayer;
  }

  const nextPlayer = state.currentPlayer === Player.GREEN ? Player.RED : Player.GREEN;
  const nextValidMoves = getValidMoves(state.board, nextPlayer);

  if (nextValidMoves.size > 0) {
    state.currentPlayer = nextPlayer;
    state.validMoves = nextValidMoves;
  } else {
    const currentValidMoves = getValidMoves(state.board, state.currentPlayer);
    if (currentValidMoves.size > 0) {
      state.validMoves = currentValidMoves;
    } else {
      state.gameOver = true;
      const greenCount = countPieces(state.board, Player.GREEN);
      const redCount = countPieces(state.board, Player.RED);
      if (greenCount > redCount) {
        state.winner = Player.GREEN;
      } else if (redCount > greenCount) {
        state.winner = Player.RED;
      } else {
        state.winner = null;
      }
    }
  }

  return true;
}

function countPieces(board: BoardState, player: Player): number {
  let count = 0;
  for (let z = 0; z < LAYERS; z++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[z][y][x] === player) {
          count++;
        }
      }
    }
  }
  return count;
}

export function getScore(board: BoardState): { green: number; red: number } {
  return {
    green: countPieces(board, Player.GREEN),
    red: countPieces(board, Player.RED),
  };
}

function copyBoard(board: BoardState): BoardState {
  const newBoard: BoardState = [];
  for (let z = 0; z < LAYERS; z++) {
    newBoard[z] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      newBoard[z][y] = [...board[z][y]];
    }
  }
  return newBoard;
}

function applyMove(board: BoardState, x: number, y: number, z: number, player: Player): BoardState {
  const newBoard = copyBoard(board);
  newBoard[z][y][x] = player;
  
  const flipped = getFlippedPieces(board, x, y, z, player);
  for (const [fx, fy, fz] of flipped) {
    newBoard[fz][fy][fx] = player;
  }
  
  return newBoard;
}

function isCorner(x: number, y: number, z: number): boolean {
  const corners = [0, BOARD_SIZE - 1];
  return corners.includes(x) && corners.includes(y) && corners.includes(z);
}

function isEdge(x: number, y: number, z: number): boolean {
  const edges = [0, BOARD_SIZE - 1];
  const edgeCount = (edges.includes(x) ? 1 : 0) + (edges.includes(y) ? 1 : 0) + (edges.includes(z) ? 1 : 0);
  return edgeCount >= 2;
}

function evaluate(board: BoardState, player: Player): number {
  const opponent = player === Player.GREEN ? Player.RED : Player.GREEN;
  
  let score = 0;
  
  for (let z = 0; z < LAYERS; z++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = board[z][y][x];
        if (cell === 0) continue;
        
        let weight = 1;
        
        if (isCorner(x, y, z)) {
          weight = 100;
        } else if (isEdge(x, y, z)) {
          weight = 5;
        }
        
        if (cell === player) {
          score += weight;
        } else {
          score -= weight;
        }
      }
    }
  }
  
  const playerMobility = getValidMoves(board, player).size;
  const opponentMobility = getValidMoves(board, opponent).size;
  score += (playerMobility - opponentMobility) * 2;
  
  return score;
}

let searchTimeLimit = 1000;
let searchStartTime = 0;
let searchStopped = false;

export function setSearchTimeLimit(ms: number) {
  searchTimeLimit = ms;
}

function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player
): number {
  if (searchStopped || Date.now() - searchStartTime > searchTimeLimit) {
    searchStopped = true;
    return evaluate(board, player);
  }
  
  const currentPlayer = isMaximizing ? player : (player === Player.GREEN ? Player.RED : Player.GREEN);
  const moves = getValidMoves(board, currentPlayer);
  
  if (depth === 0 || moves.size === 0) {
    return evaluate(board, player);
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      if (searchStopped || Date.now() - searchStartTime > searchTimeLimit) {
        searchStopped = true;
        break;
      }
      const [x, y, z] = move.split(',').map(Number);
      const newBoard = applyMove(board, x, y, z, currentPlayer);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, player);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      if (searchStopped || Date.now() - searchStartTime > searchTimeLimit) {
        searchStopped = true;
        break;
      }
      const [x, y, z] = move.split(',').map(Number);
      const newBoard = applyMove(board, x, y, z, currentPlayer);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, player);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(board: BoardState, player: Player, depth: number): { x: number; y: number; z: number } | null {
  const moves = getValidMoves(board, player);
  
  if (moves.size === 0) {
    return null;
  }
  
  if (moves.size === 1) {
    const move = Array.from(moves)[0];
    const [x, y, z] = move.split(',').map(Number);
    return { x, y, z };
  }
  
  searchStartTime = Date.now();
  searchStopped = false;
  
  let bestMove: string | null = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    if (searchStopped || Date.now() - searchStartTime > searchTimeLimit) {
      break;
    }
    const [x, y, z] = move.split(',').map(Number);
    const newBoard = applyMove(board, x, y, z, player);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, player);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  if (!bestMove) {
    const move = Array.from(moves)[0];
    const [x, y, z] = move.split(',').map(Number);
    return { x, y, z };
  }
  
  const [x, y, z] = bestMove.split(',').map(Number);
  return { x, y, z };
}
