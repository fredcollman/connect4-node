export const HEIGHT = 6;
export const WIDTH = 7;

export opaque type Player = "RED" | "YELLOW";
export const RED: Player = "RED";
export const YELLOW: Player = "YELLOW";

export type Board = (?Player)[][];

export type Game = {
  player: Player,
  board: Board,
  winner: ?Player,
  remainingMoves: number,
};
