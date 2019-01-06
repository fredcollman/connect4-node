// @flow
import { type Board, type Column, type Player } from "./types";

type BoardDimensions = { height: number, width: number };

const createBoard = ({ height, width, contents }): Board => {
  return {
    height,
    width,
    column: columnNumber => contents[columnNumber - 1],
    placeDisc: function(player, column) {
      return createBoard({
        height,
        width,
        contents: Array(width)
          .fill(null)
          .map((col, idx) =>
            column === idx + 1
              ? [...this.column(idx + 1), player]
              : this.column(idx + 1)
          ),
      });
    },
  };
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

export { newBoard };
