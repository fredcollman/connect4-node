// @flow
import { chunksToLines } from "./streams";
import { type Game } from "./constants";
import { newState, move } from "./game";
import { formatGame } from "./format";

const sanitise = line => {
  const result = Number.parseInt(line, 10);
  if (result >= 1 && result <= 7) {
    return result;
  }
  throw new Error(`Bad input: ${line}`);
};

const printState = state => state.map(formatGame).forEach(console.log);

const main = async () => {
  // $FlowFixMe - asyncIterator still behind a flag
  const inputLines = chunksToLines(process.stdin);
  let state = newState();
  printState(state);
  for await (const line of inputLines) {
    state = state.flatMap(move(sanitise(line))).catchMap(e => {
      console.error(e);
      return state;
    });
    printState(state);
  }
};

export default main;
