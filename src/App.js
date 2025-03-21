import React, { useState } from "react";
import axios from "axios";
import "./Board.css";

const boardSize = 10;
const cellSize = 50;
const snakes = { 98: 78, 95: 56, 93: 73, 87: 36, 64: 60, 49: 11, 26: 10 };
const ladders = { 2: 38, 7: 14, 8: 31, 21: 42, 28: 84, 51: 67, 71: 91 };

const getPosition = (num) => {
  const row = Math.floor((num - 1) / boardSize);
  const col = row % 2 === 0 ? (num - 1) % boardSize : boardSize - 1 - ((num - 1) % boardSize);
  return {
    x: col * cellSize + cellSize / 2,
    y: (boardSize - 1 - row) * cellSize + cellSize / 2,
  };
};

const SnakeLadderBoard = () => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceRoll, setDiceRoll] = useState(null);

  const rollDice = async () => {
    try {
      const response = await axios.post("http://localhost:4000/roll", { player: "player1" });
      setDiceRoll(response.data.diceRoll);
      setPlayerPosition(response.data.newPosition);
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const renderBoard = () => {
    let cells = [];
    let toggle = true;
    for (let row = boardSize; row > 0; row--) {
      let rowCells = [];
      for (let col = 0; col < boardSize; col++) {
        let num = toggle ? row * boardSize - col : (row - 1) * boardSize + col + 1;
        rowCells.push(
          <div key={num} className={`cell ${snakes[num] ? "snake" : ""} ${ladders[num] ? "ladder" : ""}`}>
            {num}
            {playerPosition === num && <div className="player">.</div>}
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
    <div className="board-container" style={{ position: "relative", width: boardSize * cellSize, height: boardSize * cellSize }}>
      <div className="board">{renderBoard()}</div>
      <svg className="lines-container" width={boardSize * cellSize} height={boardSize * cellSize} style={{ position: "absolute", top: 0, left: 0 }}>
        {Object.entries(snakes).map(([start, end]) => {
          const startPos = getPosition(parseInt(start));
          const endPos = getPosition(end);
          return <line key={start} x1={startPos.x} y1={startPos.y} x2={endPos.x} y2={endPos.y} stroke="red" strokeWidth="4" strokeLinecap="round" />;
        })}
        {Object.entries(ladders).map(([start, end]) => {
          const startPos = getPosition(parseInt(start));
          const endPos = getPosition(end);
          return <line key={start} x1={startPos.x} y1={startPos.y} x2={endPos.x} y2={endPos.y} stroke="green" strokeWidth="4" strokeLinecap="round" />;
        })}
      </svg>
      <button className="roll-btn" onClick={rollDice}>Roll Dice</button>
      {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
    </div>
  );
};

export default SnakeLadderBoard;
