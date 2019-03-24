// @flow
import R, { type CurriedFunction3, type CurriedFunction2 } from "ramda";
import { Either } from "monet";
import {
  RED,
  YELLOW,
  HEIGHT,
  WIDTH,
  type Player,
  type Board,
  type Game,
} from "./constants";

const newGame = (): Game => ({
  player: RED,
  board: R.times(() => [], WIDTH),
  winner: null,
  remainingMoves: WIDTH * HEIGHT,
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

const _move = (column: number, game: Game): Either<string, Game> => {
  if (game.winner) return Either.left(`${game.winner} has already won`);
  if (!game.remainingMoves) return Either.left(`Game ended in a draw`);
  return placeDisc(game.player, column, game.board).map(
    (board): Game => ({
      player: game.player === RED ? YELLOW : RED,
      board,
      winner: checkWin(board, column - 1) ? game.player : null,
      remainingMoves: game.remainingMoves - 1,
    })
  );
};

export const move: CurriedFunction2<*, *, *> = R.curry(_move);

export const checkWin = (board: Board, idx: number) => {
  const rowIdx = board[idx].length - 1;
  const position = [idx, board[idx].length - 1];
  const rowExtent =
    extent(board, [0, -1], position) + extent(board, [0, 1], position) - 1;
  const colExtent = extent(board, [-1, 0], position);
  const upwardsExtent =
    extent(board, [1, 1], position) + extent(board, [-1, -1], position) - 1;
  const downwardsExtent =
    extent(board, [1, -1], position) + extent(board, [-1, 1], position) - 1;
  return R.any(R.lte(4), [
    colExtent,
    rowExtent,
    upwardsExtent,
    downwardsExtent,
  ]);
};

const extent = (board, direction, initial) => {
  const [up, right] = direction;
  let [col, row] = initial;
  let compareTo = board[col][row];
  let count = 0;
  while ((board[col] || [])[row] === compareTo) {
    count++;
    col += right;
    row += up;
  }
  return count;
};
