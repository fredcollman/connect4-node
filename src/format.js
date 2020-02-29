// @flow
import R from "ramda";

import { RED, YELLOW, WIDTH, HEIGHT, type Board, type Game } from "./constants";

const reset = "\x1b[0m";
const fgRed = "\x1b[31m";
const fgYellow = "\x1b[33m";

const redCell = `${fgRed}R${reset}`;
const yellowCell = `${fgYellow}Y${reset}`;

const formatCell = cell =>
  cell === RED ? redCell : cell === YELLOW ? yellowCell : " ";

const formatRow = row => row.map(formatCell).join("");

const lengthen = column =>
  [...column, ...Array(HEIGHT).fill(null)].slice(0, HEIGHT);
const expand = board => board.map(lengthen);

export const formatBoard = (board: Board) =>
  R.reverse(R.transpose(expand(board)).map(formatRow)).join("\n");

const formatWinner = game => `${game.winner} wins the game!`;

const formatNextTurn = game => `It's ${game.player}'s turn.`;

const formatDraw = game => `Game has ended in a draw`;

const formatMessage = game =>
  game.remainingMoves
    ? game.winner
      ? formatWinner(game)
      : formatNextTurn(game)
    : formatDraw(game);

export const formatGame = (game: Game) => `
${formatMessage(game)}

${formatBoard(game.board)}`;
