// @flow
import chai from "chai";
import { newBoard, placeDisc } from "./board";
import { RED, YELLOW } from "./types";

const { expect } = chai;

describe("newBoard", () => {
  it("returns a board of specified size", () => {
    const board = newBoard({ width: 7, height: 6 });
    expect(board.width).to.equal(7);
    expect(board.height).to.equal(6);
  });

  it("is initially blank", () => {
    const board = newBoard({ width: 8, height: 5 });
    expect(board.column(3)).to.be.empty;
  });
});

describe("placeDisc", () => {
  it("places a disc in the specified column", () => {
    const board0 = newBoard({ width: 8, height: 5 });
    const board1 = placeDisc(RED, 4, board0);
    expect(board1.column(4)).to.deep.equal([RED]);
  });

  it("does not modify the input board", () => {
    const board0 = newBoard({ width: 8, height: 5 });
    const board1 = placeDisc(RED, 4, board0);
    expect(board1).not.to.equal(board0);
  });

  it("can place multiple discs in the same column", () => {
    const board0 = newBoard({ width: 8, height: 5 });
    const board1 = placeDisc(RED, 4, board0);
    const board2 = placeDisc(YELLOW, 4, board1);
    expect(board2.column(4)).to.deep.equal([RED, YELLOW]);
  });
});