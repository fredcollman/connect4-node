// @flow
import { type Board, type Column, type Player } from "./types";

type BoardDimensions = { height: number, width: number };

const createBoard = ({ height, width, contents }): Board => {
  return { height, width, column: columnNumber => contents[columnNumber - 1] };
};

const newBoard = ({ height, width }: BoardDimensions): Board => {
  // const
  return createBoard({
    height,
    width,
    contents: Array(width)
      .fill(null)
      .map(() => []),
  });
};
// [...Array(width)].map((_, i) => Array(height).fill(null));

const placeDisc = (player: Player, column: Column, board: Board): Board => {
  const { height, width } = board;
  return createBoard({
    height,
    width,
    contents: Array(width)
      .fill(null)
      .map((col, idx) =>
        column === idx + 1
          ? [...board.column(idx + 1), player]
          : board.column(idx + 1)
      ),
  });
};

export { newBoard, placeDisc };
