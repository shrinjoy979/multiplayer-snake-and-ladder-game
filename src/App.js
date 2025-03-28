import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Board.css";

const boardSize = 10;
const cellSize = 50;
const socket = io("http://localhost:4000");

const snakes = { 98: 78, 95: 56, 93: 73, 87: 36, 64: 60, 49: 11, 26: 10 };
const ladders = { 2: 38, 7: 14, 8: 31, 21: 42, 28: 84, 51: 67, 71: 91 };

const getPosition = (num) => {
  const row = Math.floor((num - 1) / boardSize);
  const col =
    row % 2 === 0
      ? (num - 1) % boardSize
      : boardSize - 1 - ((num - 1) % boardSize);
  return {
    x: col * cellSize + cellSize / 2,
    y: (boardSize - 1 - row) * cellSize + cellSize / 2,
  };
};

const SnakeLadderBoard = () => {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [positions, setPositions] = useState({});
  const [diceRoll, setDiceRoll] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("gameCreated", ({ gameId }) => {
      setGameId(gameId);
      setPlayerId(socket.id);
    });

    socket.on("startGame", ({ players }) => {
      setPlayers(players);
    });

    socket.on("updateGame", ({ positions, diceRoll, currentTurn, winner }) => {
      setPositions(positions);
      setDiceRoll(diceRoll);
      setCurrentTurn(currentTurn);
      setWinner(winner);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("startGame");
      socket.off("updateGame");
    };
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

  const joinGame = () => {
    const code = prompt("Enter Game Code:");
    if (code) {
      socket.emit("joinGame", code);
      setGameId(code);
      setPlayerId(socket.id);
    }
  };

  const rollDice = () => {
    if (gameId && players[currentTurn] === playerId && !winner) {
      socket.emit("rollDice", { gameId, player: playerId });
    }
  };

  const renderBoard = () => {
    let cells = [];
    let toggle = true;
    for (let row = boardSize; row > 0; row--) {
      let rowCells = [];
      for (let col = 0; col < boardSize; col++) {
        let num = toggle
          ? row * boardSize - col
          : (row - 1) * boardSize + col + 1;
        rowCells.push(
          <div
            key={num}
            className={`cell ${snakes[num] ? "snake" : ""} ${
              ladders[num] ? "ladder" : ""
            }`}
          >
            {num}
            {Object.keys(positions).map((player) =>
              positions[player] === num ? (
                <div key={player} className="player" />
              ) : null
            )}
          </div>
        );
      }
      toggle = !toggle;
      cells.push(
        <div key={row} className="row">
          {rowCells}
        </div>
      );
    }
    return cells;
  };

  return (
    <div>
      {!gameId ? (
        <div>
          <button onClick={createGame}>Create Game</button>
          <button onClick={joinGame}>Join Game</button>
        </div>
      ) : (
        <div className="board-container">
          <div className="board">{renderBoard()}</div>
          <p>
            Game Code: <strong>{gameId}</strong>
          </p>
          <svg
            className="lines-container"
            width={boardSize * cellSize}
            height={boardSize * cellSize}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {Object.entries(snakes).map(([start, end]) => {
              const startPos = getPosition(parseInt(start));
              const endPos = getPosition(end);
              return (
                <line
                  key={start}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="red"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
            {Object.entries(ladders).map(([start, end]) => {
              const startPos = getPosition(parseInt(start));
              const endPos = getPosition(end);
              return (
                <line
                  key={start}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="green"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <button
            className="roll-btn"
            onClick={rollDice}
            disabled={players[currentTurn] !== playerId || winner}
          >
            Roll Dice
          </button>
          {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
          {winner && <p>Winner: {winner}</p>}
        </div>
      )}
    </div>
  );
};

export default SnakeLadderBoard;
