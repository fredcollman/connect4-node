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
  console.log(state);
  for await (const line of inputLines) {
    try {
      state = state.flatMap(move(sanitise(line)));
      state.cata(e => console.error(e), g => console.log(g));
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
};

export default main;
