// @flow
import R from "ramda";
import { chunksToLines } from "./streams";

const sanitise = line => {
  const result = Number.parseInt(line, 10);
  if (result >= 1 && result <= 7) {
    return result;
  }
  throw new Error(`Bad input: ${line}`);
};

type Player = "Red" | "Yellow";
type Board = (?Player)[][];
type State = { player: Player, board: Board };
type Position = number;

const initialState = (): State => ({
  player: "Red",
  board: R.times(() => [], 7),
});

const move = (state: State, position: Position): State => ({
  player: state.player === "Red" ? "Yellow" : "Red",
  board: R.adjust(position - 1, col => [...col, state.player], state.board),
});

const main = async () => {
  // $FlowFixMe - asyncIterator still behind a flag
  const inputLines = chunksToLines(process.stdin);
  let state = initialState();
  console.log(state);
  for await (const line of inputLines) {
    try {
      state = move(state, sanitise(line));
      console.log(state);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
};

export default main;
