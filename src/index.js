// @flow
import { chunksToLines } from "./streams";
import { newState, move, type Game } from "./game";

const sanitise = line => {
  const result = Number.parseInt(line, 10);
  if (result >= 1 && result <= 7) {
    return result;
  }
  throw new Error(`Bad input: ${line}`);
};

const main = async () => {
  // $FlowFixMe - asyncIterator still behind a flag
  const inputLines = chunksToLines(process.stdin);
  let state = newState();
  state.forEach(console.log);
  for await (const line of inputLines) {
    state = state.flatMap(move(sanitise(line))).catchMap(e => {
      console.error(e);
      return state;
    });
    state.forEach(console.log);
  }
  console.log("Done");
};

export default main;
