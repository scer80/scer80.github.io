import { BoardState, Player, PLAYER_COLORS } from './board_common';

export interface BoardRenderer2D {
  render(board: BoardState, currentPlayer: Player, validMoves: Set<string>): void;
  getCellFromClick(clickX: number, clickY: number): { x: number; y: number; z: number } | null;
  dispose(): void;
}

export function createBoardRenderer2D(canvas: HTMLCanvasElement, boardSize: number): BoardRenderer2D {
  const ctx = canvas.getContext('2d')!;

  const padding = 10;
  const labelHeight = 25;
  let cellSizeTotal = 0;

  let boardLayout: { xOffset: number; yOffset: number; z: number }[] = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    const refSize = 8;
    cellSizeTotal = Math.floor((canvas.width - padding * (refSize + 1)) / (refSize * refSize)) * (refSize / boardSize);
    canvas.height = boardSize * cellSizeTotal + labelHeight + padding * 2;
    updateBoardLayout();
  }

  function updateBoardLayout() {
    boardLayout = [];
    const boardWidth = boardSize * cellSizeTotal;
    const startX = padding;
    const startY = padding;

    for (let z = 0; z < boardSize; z++) {
      boardLayout.push({
        xOffset: startX + z * (boardWidth + padding),
        yOffset: startY,
        z,
      });
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getCellFromClickInternal(clickX: number, clickY: number): { x: number; y: number; z: number } | null {
    const gridGap = Math.max(1, Math.floor(cellSizeTotal * 0.1));
    const cellSize = cellSizeTotal - gridGap;
    const cellWithGap = cellSize + gridGap;

    for (const layout of boardLayout) {
      const boardLeft = layout.xOffset;
      const boardTop = layout.yOffset + labelHeight;
      const boardRight = boardLeft + boardSize * cellWithGap;
      const boardBottom = boardTop + boardSize * cellWithGap;

      if (clickX >= boardLeft && clickX < boardRight && clickY >= boardTop && clickY < boardBottom) {
        const x = Math.floor((clickX - boardLeft) / cellWithGap);
        const y = boardSize - 1 - Math.floor((clickY - boardTop) / cellWithGap);
        if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
          return { x, y, z: layout.z };
        }
      }
    }
    return null;
  }

  function drawArrow(x1: number, y1: number, x2: number, y2: number, color: string, headSize: number) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headSize * Math.cos(angle - Math.PI / 6), y2 - headSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headSize * Math.cos(angle + Math.PI / 6), y2 - headSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  return {
    render(board: BoardState, currentPlayer: Player, validMoves: Set<string>) {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gridGap = Math.max(1, Math.floor(cellSizeTotal * 0.1));
      const cellSize = cellSizeTotal - gridGap;
      const boardWidth = boardSize * cellSizeTotal;
      const startX = padding;
      const startY = padding + labelHeight;

      for (let z = 0; z < boardSize; z++) {
        const xOffset = startX + z * (boardWidth + padding);
        const yOffset = startY;

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(xOffset - 5, yOffset - labelHeight, boardWidth + 10, boardWidth + labelHeight + 5);

        for (let y = 0; y < boardSize; y++) {
          for (let x = 0; x < boardSize; x++) {
            const cx = xOffset + x * (cellSize + gridGap);
            const cy = yOffset + (boardSize - 1 - y) * (cellSize + gridGap);
            const cell = board[z][y][x];
            const key = `${x},${y},${z}`;

            ctx.fillStyle = '#222244';
            if (validMoves.has(key) && cell === 0) {
              ctx.fillStyle = currentPlayer === Player.GREEN ? '#226622' : '#662222';
            }
            ctx.fillRect(cx, cy, cellSize, cellSize);

            if (cell !== 0) {
              ctx.beginPath();
              ctx.arc(cx + cellSize / 2, cy + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2);
              ctx.fillStyle = PLAYER_COLORS[cell as Player];
              ctx.fill();
            }
          }
        }
      }

      // Draw coordinate axes
      const refCellSize = cellSizeTotal * boardSize / 8;
      const headSize = Math.max(5, Math.floor(refCellSize * 0.5));
      const shortLen = Math.round(2.5 * refCellSize);
      const totalSpan = (boardSize - 1) * (boardWidth + padding) + boardWidth;
      const zArrowY = padding + Math.floor(labelHeight / 2);
      const labelFont = `bold ${Math.max(9, Math.floor(refCellSize * 0.75))}px Courier New`;

      ctx.font = labelFont;
      ctx.textBaseline = 'middle';

      drawArrow(startX, zArrowY, startX + totalSpan, zArrowY, '#4466ff', headSize);
      ctx.fillStyle = '#4466ff';
      ctx.fillText('Z', startX + totalSpan + 5, zArrowY);

      const originX = startX;
      const originY = startY + boardSize * cellSizeTotal;

      drawArrow(originX, originY, originX + shortLen, originY, '#ff4444', headSize);
      ctx.fillStyle = '#ff4444';
      ctx.textBaseline = 'middle';
      ctx.fillText('X', originX + shortLen + 5, originY);

      drawArrow(originX, originY, originX, originY - shortLen, '#44ff44', headSize);
      ctx.fillStyle = '#44ff44';
      ctx.textBaseline = 'top';
      ctx.fillText('Y', originX + 5, originY - shortLen - 5);
    },

    getCellFromClick(clickX: number, clickY: number) {
      return getCellFromClickInternal(clickX, clickY);
    },

    dispose() {
      window.removeEventListener('resize', resizeCanvas);
    },
  };
}
