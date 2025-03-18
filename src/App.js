import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const boardSize = 100;
const snakes = { 98: 78, 95: 56, 92: 73, 83: 19, 74: 53, 64: 42, 62: 18, 54: 31, 17: 7 };
const ladders = { 2: 38, 7: 14, 8: 31, 15: 26, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94 };

const App = () => {
  const [position, setPosition] = useState(1);
  const [message, setMessage] = useState("");

  const rollDice = async () => {
    try {
      const response = await axios.get("http://localhost:4000/roll");
      let dice = response.data.dice;
      let newPosition = position + dice;

      if (newPosition > boardSize) {
        setMessage(`Rolled a ${dice}, but can't move.`);
      } else {
        newPosition = snakes[newPosition] || ladders[newPosition] || newPosition;
        setMessage(`Rolled a ${dice}, moved to ${newPosition}`);
        setPosition(newPosition);
      }

      if (newPosition === boardSize) {
        setMessage("🎉 You won!");
      }
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const getCellPosition = (cellNumber) => {
    let row = Math.floor((cellNumber - 1) / 10);
    let col = (cellNumber - 1) % 10;
    if (row % 2 === 1) {
      col = 9 - col;
    }
    return { x: col * 50 + 25, y: (9 - row) * 50 + 25 };
  };

  const getGridCells = () => {
    let cells = [];
    for (let i = boardSize; i > 0; i--) {
      cells.push(
        <div key={i} className={`cell ${position === i ? "player" : ""}`}>
          {i}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="container">
      <h1>🐍🎲 Snake & Ladder Game 🎲🪜</h1>
      <div className="board-container">
        <div className="board">{getGridCells()}</div>
        <svg className="board-lines">
          {Object.entries(snakes).map(([start, end]) => {
            const startPos = getCellPosition(Number(start));
            const endPos = getCellPosition(end);
            return (
              <line
                key={`snake-${start}`}
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            );
          })}
          {Object.entries(ladders).map(([start, end]) => {
            const startPos = getCellPosition(Number(start));
            const endPos = getCellPosition(end);
            return (
              <line
                key={`ladder-${start}`}
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke="green"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>
      <button className="roll-button" onClick={rollDice}>
        🎲 Roll Dice
      </button>
      <h3>{message}</h3>
    </div>
  );
};

export default App;
