// @flow
import chai from "chai";
import R from "ramda";
import { Either } from "monet";
import { newGame, RED, YELLOW, placeDisc, move } from "./game";

const { expect } = chai;

describe("newGame", () => {
  it("initially is Red's turn", () => {
    const game = newGame();
    expect(game.player).to.equal(RED);
  });

  it("initially has no discs", () => {
    const game = newGame();
    expect(game.board).to.deep.equal([[], [], [], [], [], [], []]);
  });
});

describe("placeDisc", () => {
  it("places a disc in the board", () => {
    const board = [[], [], []];
    expect(placeDisc(RED, 1, board)).to.deep.equal(
      Either.right([[RED], [], []])
    );
  });

  it("places a disc in the correct column", () => {
    const board = [[], [], [], []];
    expect(placeDisc(RED, 3, board)).to.deep.equal(
      Either.right([[], [], [RED], []])
    );
  });

  it("allows multiple discs to be placed", () => {
    const doPlaceDisc = board => board.flatMap(placeDisc(RED, 1));
    const doPlaceFourDiscs = R.compose(...R.repeat(doPlaceDisc, 4));
    const finalBoard = doPlaceFourDiscs(Either.right([[], [], []]));
    expect(finalBoard).to.deep.equal(
      Either.right([[RED, RED, RED, RED], [], []])
    );
  });

  it("fails if column is out of bounds", () => {
    const result = placeDisc(RED, 9, [[], [], []]);
    expect(result).to.deep.equal(Either.left("Column 9 out of bounds"));
  });

  it("fails if the column is full", () => {
    const fullColumn = R.repeat(RED, 6);
    const result = placeDisc(RED, 2, [[], fullColumn, []]);
    expect(result).to.deep.equal(Either.left("Column 2 is full"));
  });
});

describe("move", () => {
  it("switches from RED to YELLOW", () => {
    const game = newGame();
    const result = move(1, game);
    expect(result.right().player).to.equal(YELLOW);
  });

  it("switches back to RED after a second move", () => {
    const result = move(1, newGame()).flatMap(move(1));
    expect(result.right().player).to.equal(RED);
  });

  it("places a disc in the board", () => {
    const game = newGame();
    const result = move(1, newGame());
    expect(result.right().board).to.deep.equal([[RED], [], [], [], [], [], []]);
  });

  it("places the current player's disc in the board", () => {
    const result = move(1, newGame()).flatMap(move(1));
    expect(result.right().board).to.deep.equal([
      [RED, YELLOW],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);
  });

  it("fails if column is out of bounds", () => {
    const result = move(19, newGame());
    expect(result).to.deep.equal(Either.left("Column 19 out of bounds"));
  });

  it("fails if the column is full", () => {
    const result = move(1, newGame())
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1))
      .flatMap(move(1));
    expect(result).to.deep.equal(Either.left("Column 1 is full"));
  });
});
