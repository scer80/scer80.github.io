export type Cell = 0 | 1 | 2;
export type BoardState = Cell[][][];

export enum Player {
  GREEN = 1,
  RED = 2,
}

export const PLAYER_COLORS = {
  [Player.GREEN]: '#44ff44',
  [Player.RED]: '#ff4444',
};

export const PLAYER_NAMES = {
  [Player.GREEN]: 'Green',
  [Player.RED]: 'Red',
};

export const BOARD_SIZE = 8;
export const LAYERS = 8;

export function createEmptyBoard(): BoardState {
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
  return board;
}

export function setInitialPieces(board: BoardState) {
  board[3][3][3] = Player.RED;
  board[3][3][4] = Player.GREEN;
  board[3][4][3] = Player.GREEN;
  board[3][4][4] = Player.RED;
  board[4][3][3] = Player.GREEN;
  board[4][3][4] = Player.RED;
  board[4][4][3] = Player.RED;
  board[4][4][4] = Player.GREEN;
}
