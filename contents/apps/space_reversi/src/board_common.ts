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

export function createEmptyBoard(size: number): BoardState {
  const board: BoardState = [];
  for (let z = 0; z < size; z++) {
    board[z] = [];
    for (let y = 0; y < size; y++) {
      board[z][y] = [];
      for (let x = 0; x < size; x++) {
        board[z][y][x] = 0;
      }
    }
  }
  return board;
}

export function setInitialPieces(board: BoardState, size: number) {
  const mid = size / 2;
  board[mid-1][mid-1][mid-1] = Player.RED;
  board[mid-1][mid-1][mid]   = Player.GREEN;
  board[mid-1][mid][mid-1]   = Player.GREEN;
  board[mid-1][mid][mid]     = Player.RED;
  board[mid][mid-1][mid-1]   = Player.GREEN;
  board[mid][mid-1][mid]     = Player.RED;
  board[mid][mid][mid-1]     = Player.RED;
  board[mid][mid][mid]       = Player.GREEN;
}
