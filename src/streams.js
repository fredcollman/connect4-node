// borrowed from http://2ality.com/2018/04/async-iter-nodejs.html
async function* chunksToLines(chunksAsync: AsyncIterator<string>) {
  let previous = "";
  for await (const chunk of chunksAsync) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf("\n")) >= 0) {
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

export { chunksToLines };
