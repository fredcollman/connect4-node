// @flow
import chai from "chai";
import R from "ramda";
import { Either } from "monet";
import { formatBoard, formatGame } from "./format";
import { RED, YELLOW } from "./constants";

const { expect } = chai;

describe("formatBoard", () => {
  it("can draw an empty board", () => {
    const board = R.repeat([], 7);
    const output = [
      "       ",
      "       ",
      "       ",
      "       ",
      "       ",
      "       ",
    ].join("\n");
    expect(formatBoard(board)).to.equal(output);
  });

  it("can draw a red coin", () => {
    const board = [[RED], ...R.repeat([], 6)];
    const output = [
      "       ",
      "       ",
      "       ",
      "       ",
      "       ",
      "R      ",
    ].join("\n");
    expect(formatBoard(board)).to.equal(output);
  });

  it("can draw a yellow coin", () => {
    const board = [[YELLOW], ...R.repeat([], 6)];
    const output = [
      "       ",
      "       ",
      "       ",
      "       ",
      "       ",
      "Y      ",
    ].join("\n");
    expect(formatBoard(board)).to.equal(output);
  });

  it("can draw a full board", () => {
    const board = [
      [RED, RED, YELLOW, RED],
      [YELLOW, YELLOW, YELLOW],
      [],
      [RED],
      [RED, YELLOW, RED, YELLOW, RED, YELLOW],
      [],
      [],
    ];
    const output = [
      "    Y  ",
      "    R  ",
      "R   Y  ",
      "YY  R  ",
      "RY  Y  ",
      "RY RR  ",
    ].join("\n");
    expect(formatBoard(board)).to.equal(output);
  });
});

const redWins = {
  player: YELLOW,
  board: [[RED, RED, RED, RED], [YELLOW, YELLOW, YELLOW], [], [], [], [], []],
  winner: RED,
  remainingMoves: 37,
};

describe("formatGame", () => {
  it("draws the board", () => {
    const output = [
      "       ",
      "       ",
      "R      ",
      "RY     ",
      "RY     ",
      "RY     ",
    ].join("\n");
    expect(formatGame(redWins)).to.include(output);
  });

  it("says who won", () => {
    expect(formatGame(redWins)).to.include("RED wins the game");
  });

  it("says whose turn is next", () => {
    expect(
      formatGame({
        player: RED,
        board: R.repeat([], 7),
        winner: null,
        remainingMoves: 42,
      })
    ).to.include("It's RED's turn");
  });

  it("says when it's a draw", () => {
    expect(
      formatGame({
        player: RED,
        board: R.repeat([], 7),
        winner: null,
        remainingMoves: 0,
      })
    ).to.include("Game has ended in a draw");
  });
});
