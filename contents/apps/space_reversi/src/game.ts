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
