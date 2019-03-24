// @flow
import R from "ramda";

import { RED, YELLOW, WIDTH, HEIGHT, type Board, type Game } from "./constants";

const formatCell = cell => (cell === RED ? "R" : cell === YELLOW ? "Y" : " ");

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
