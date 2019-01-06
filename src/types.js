//@flow
export opaque type Player = "RED" | "YELLOW";
export const RED: Player = "RED";
export const YELLOW: Player = "YELLOW";

type Result = "Red wins" | "Yellow wins" | "Draw" | null;
export type Column = number;
export type Board = {
  width: number,
  height: number,
  column: Column => Player[],
};
type GameState = {
  board: Board,
  player: Player,
  winner: ?Player,
};

type PlaceDisc = (Column, GameState) => GameState;
type WinCheck = (GameState, Player) => boolean;

type Game = {
  placeDisc: Column => void,
  getResult: () => Result,
  getAvailableMoves: () => Column[],
};
