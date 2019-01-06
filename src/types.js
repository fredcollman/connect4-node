//@flow
type Player = "RED" | "YELLOW";
type Result = "Red wins" | "Yellow wins" | "Draw" | null;
type Board = (?Player)[][];
type Column = number;
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
