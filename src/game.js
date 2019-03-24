// @flow
import R, { type CurriedFunction3, type CurriedFunction2 } from "ramda";
import { Either } from "monet";

opaque type Player = "RED" | "YELLOW";
export const RED: Player = "RED";
export const YELLOW: Player = "YELLOW";

type Board = (?Player)[][];
export type Game = { player: Player, board: Board };

const HEIGHT = 6;
const WIDTH = 7;

export const newGame = (): Game => ({
  player: RED,
  board: R.times(() => [], WIDTH),
});

export const newState = (): Either<string, Game> => Either.of(newGame());

const isValidColumn = (index, count) =>
  index >= 1 && index <= count && Math.floor(index) === index;

const outOfBounds = column => Either.left(`Column ${column} out of bounds`);

const placeDiscSafe = (player, column, board) =>
  R.adjust(column - 1, col => [...col, player], board);

const columnIsFull = (column, board) => board[column - 1].length >= HEIGHT;

const _placeDisc = (
  player: Player,
  column: number,
  board: Board
): Either<string, Board> => {
  if (!isValidColumn(column, board.length)) {
    return Either.left(`Column ${column} out of bounds`);
  }
  if (columnIsFull(column, board)) {
    return Either.left(`Column ${column} is full`);
  }
  return Either.right(placeDiscSafe(player, column, board));
};

export const placeDisc: CurriedFunction3<*, *, *, *> = R.curry(_placeDisc);

const _move = (column: number, game: Game): Either<string, Game> =>
  placeDisc(game.player, column, game.board).map(board => ({
    player: game.player === RED ? YELLOW : RED,
    board,
  }));

export const move: CurriedFunction2<*, *, *> = R.curry(_move);
