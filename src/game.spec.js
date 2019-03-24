// @flow
import chai from "chai";
import R from "ramda";
import { Either } from "monet";
import { newState, RED, YELLOW, placeDisc, move, checkWin } from "./game";

const { expect } = chai;

describe("newState", () => {
  it("initially is Red's turn", () => {
    const game = newState().right();
    expect(game.player).to.equal(RED);
  });

  it("initially has no discs", () => {
    const game = newState().right();
    expect(game.board).to.deep.equal([[], [], [], [], [], [], []]);
  });

  it("initially has no winner", () => {
    const game = newState().right();
    expect(game.winner).to.be.null;
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

describe("checkWin", () => {
  it("is false for an empty board", () => {
    const board = [[RED], [], []];
    expect(checkWin(board, 0)).to.be.false;
  });

  it("is true for simple column win", () => {
    const winColumn = R.repeat(RED, 4);
    const board = [winColumn, [], []];
    expect(checkWin(board, 0)).to.be.true;
  });

  it("is true for a win in any column", () => {
    const winColumn = R.repeat(YELLOW, 4);
    const board = [[], [], winColumn, []];
    expect(checkWin(board, 2)).to.be.true;
  });

  it("only checks the last play", () => {
    const winColumn = R.repeat(RED, 4);
    const board = [[], [YELLOW], winColumn, []];
    expect(checkWin(board, 1)).to.be.false;
  });

  it("is not a win if there is a gap", () => {
    const noWin = [RED, RED, RED, YELLOW, RED];
    const board = [noWin, [], []];
    expect(checkWin(board, 0)).to.be.false;
  });

  it("can be a horizontal win", () => {
    const board = [[RED], [RED], [RED], [RED], [], [], []];
    expect(checkWin(board, 3)).to.be.true;
  });

  it("can be a horizontal win on either side", () => {
    const board = [[RED], [RED], [RED], [RED], [], [], []];
    expect(checkWin(board, 1)).to.be.true;
  });

  it("begins looking in the right column", () => {
    const board = [[YELLOW], [], [RED], [RED], [RED], [RED], []];
    expect(checkWin(board, 3)).to.be.true;
  });

  it("requires four in a row for horizontal win", () => {
    const board = [[YELLOW], [], [RED], [RED], [RED], [], []];
    expect(checkWin(board, 3)).to.be.false;
  });

  it("is not a horizontal win if there is a gap", () => {
    const board = [[RED], [RED], [RED], [YELLOW], [RED], [], [], []];
    expect(checkWin(board, 1)).to.be.false;
  });

  it("does not loop around", () => {
    const board = [[RED], [RED], [], [], [], [], [RED], [RED]];
    expect(checkWin(board, 0)).to.be.false;
  });
});

describe("move", () => {
  it("switches from RED to YELLOW", () => {
    const result = newState().flatMap(move(1));
    expect(result.right().player).to.equal(YELLOW);
  });

  it("switches back to RED after a second move", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(1));
    expect(result.right().player).to.equal(RED);
  });

  it("places a disc in the board", () => {
    const result = newState().flatMap(move(1));
    expect(result.right().board).to.deep.equal([[RED], [], [], [], [], [], []]);
  });

  it("places the current player's disc in the board", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(1));
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
    const result = newState().flatMap(move(19));
    expect(result).to.deep.equal(Either.left("Column 19 out of bounds"));
  });

  it("fails if the column is full", () => {
    const result = newState()
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

  it("can be a column win for RED", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1));
    expect(result.right().winner).to.equal(RED);
  });

  it("can be a column win for YELLOW", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(3))
      .flatMap(move(2));
    expect(result.right().winner).to.equal(YELLOW);
  });

  it("may not have a winner yet", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1));
    expect(result.right().winner).to.be.null;
  });

  it("prevents further moves after winner decided", () => {
    const result = newState()
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2))
      .flatMap(move(1))
      .flatMap(move(2));
    expect(result).to.deep.equal(Either.left("RED has already won"));
  });
});
