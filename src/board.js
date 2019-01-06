// @flow
import { type Board, type Column, type Player } from "./types";

type BoardDimensions = { height: number, width: number };

const createBoard = ({ height, width, contents }): Board => {
  return {
    height,
    width,
    column: columnNumber => contents[columnNumber - 1],
    placeDisc: function(player, column) {
      if (column < 0 || column >= width) {
        throw new Error(`Invalid column`);
      }
      const newContents = contents.map((col, idx) => {
        if (column === idx + 1) {
          const existing = contents[idx];
          if (existing.length >= height) {
            throw new Error(`Column ${column} is already full`);
          }
          return [...existing, player];
        }
        return contents[idx];
      });
      return createBoard({ height, width, contents: newContents });
    },
  };
};

const newBoard = ({ height, width }: BoardDimensions): Board =>
  createBoard({
    height,
    width,
    contents: Array(width)
      .fill(null)
      .map(() => []),
  });

export { newBoard };
