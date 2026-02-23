import { BoardState, Player, createEmptyBoard, setInitialPieces } from './board_common';
import { createBoardRenderer3D } from './board_3d';
import { createBoardRenderer2D } from './board_2d';

export interface BoardRenderer {
  render(board: BoardState, currentPlayer: Player, validMoves: Set<string>): void;
  getCellFromClick(clickX: number, clickY: number): { x: number; y: number; z: number } | null;
  resetCamera(): void;
}

export function createBoardRenderer(
  canvas3d: HTMLCanvasElement,
  canvas2d: HTMLCanvasElement
): BoardRenderer {
  const renderer3d = createBoardRenderer3D(canvas3d);
  const renderer2d = createBoardRenderer2D(canvas2d);

  return {
    render(board: BoardState, currentPlayer: Player, validMoves: Set<string>) {
      renderer3d.render(board);
      renderer2d.render(board, currentPlayer, validMoves);
    },
    getCellFromClick(clickX: number, clickY: number) {
      return renderer2d.getCellFromClick(clickX, clickY);
    },
    resetCamera() {
      renderer3d.resetCamera();
    },
  };
}

export { createEmptyBoard, setInitialPieces, BoardState };
export type { Cell } from './board_common';
export { Player } from './board_common';
