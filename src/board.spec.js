// @flow
import chai from "chai";
import { newBoard } from "./board";
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
    const board = newBoard({ width: 8, height: 5 }).placeDisc(RED, 4);
    expect(board.column(4)).to.deep.equal([RED]);
  });

  it("does not modify the input board", () => {
    const board0 = newBoard({ width: 8, height: 5 });
    const board1 = board0.placeDisc(RED, 4);
    expect(board1).not.to.equal(board0);
  });

  it("can place multiple discs in the same column", () => {
    const board = newBoard({ width: 8, height: 5 })
      .placeDisc(RED, 4)
      .placeDisc(YELLOW, 4);
    expect(board.column(4)).to.deep.equal([RED, YELLOW]);
  });

  it("can place discs in different columns", () => {
    const board = newBoard({ width: 8, height: 5 })
      .placeDisc(RED, 2)
      .placeDisc(YELLOW, 3);
    expect(board.column(2)).to.deep.equal([RED]);
    expect(board.column(3)).to.deep.equal([YELLOW]);
  });

  it("fails if column is already full", () => {
    const board = Array(5)
      .fill(null)
      .reduce(
        board => board.placeDisc(RED, 3),
        newBoard({ width: 8, height: 5 })
      );
    expect(() => board.placeDisc(RED, 3)).to.throw();
  });

  it("fails if column is out of bounds", () => {
    const board = newBoard({ width: 4, height: 6 });
    expect(() => board.placeDisc(RED, 5)).to.throw();
  });
});
