import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./css/Board.css";
import { TowerControl as GameController, Users } from 'lucide-react';

const boardRowSize = 10;
const cellSize = 50;
const serverURL = process.env.REACT_APP_ENVIRONMENT === 'LOCAL' ? process.env.REACT_APP_LOCAL_SERVER_URL : process.env.REACT_APP_SERVER_URL;
const socket = io(serverURL);

const snakes = { 98: 78, 95: 56, 93: 73, 87: 36, 64: 60, 49: 11, 26: 10 };
const ladders = { 2: 38, 7: 14, 8: 31, 21: 42, 28: 84, 51: 67, 71: 91 };

const getPosition = (num) => {
  const row = Math.floor((num - 1) / boardRowSize);
  const col = row % 2 === 0 ? (num - 1) % boardRowSize : boardRowSize - 1 - ((num - 1) % boardRowSize);
  return {
    x: col * cellSize + cellSize / 2,
    y: (boardRowSize - 1 - row) * cellSize + cellSize / 2,
  };
};

function Game() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({});
  const [diceValue, setDiceValue] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [winner, setWinner] = useState(null);
  
  useEffect(() => {
    socket.on("gameCreated", ({ gameId }) => {
      setGameId(gameId);
      setPlayerId(socket.id);
    });

    socket.on("startGame", ({ players }) => {
      setPlayers(players);

      setPlayerPosition({
        [players[0]]: 0,
        [players[1]]: 0
      });
    });

    socket.on("updateGame", ({ positions, diceRoll, currentTurn }) => {
      setPlayerPosition(positions);
      setDiceValue(diceRoll);
      setCurrentTurn(currentTurn);
    });

    socket.on("gameOver", ({ winner }) => {
      setWinner(winner);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("startGame");
      socket.off("updateGame");
      socket.off("gameOver");
    };
  }, []);

  const handleCreateGame = () => {
    socket.emit("createGame");
  }

  const handleJoinGame = () => {
    const code = prompt("Enter the game code");
    if(code) {
      socket.emit("joinGame", code);
      setGameId(code);
      setPlayerId(socket.id);
    }
  }

  const rollDice = async () => {
    if(gameId && players[currentTurn] === playerId && !winner) {
      socket.emit("rollDice", { gameId, player: playerId });
    }
  }

  const renderBoard = () => {
    let boardCells = [];
    let toggle = true;

    for(let row = boardRowSize; row > 0; row--) {
      let rowCells = [];

      for(let col = 0; col < boardRowSize; col++) {
        let num = toggle ? row * boardRowSize - col : (row - 1) * boardRowSize + col + 1;
        rowCells.push(
          <div key={num} className={`cell ${snakes[num] ? "snake" : "" } ${ladders[num] ? "ladder" : ""}`}>
            {num}
            {Object.keys(playerPosition).map((player, index) =>
              playerPosition[player] === num ? (
                <div 
                  key={player} 
                  className={`player player-${index}`}
                >
                  {index === 0 ? "🔴" : "🟢"}
                </div>
              ) : null
            )}
          </div>
        );
      }

      toggle = !toggle;

      boardCells.push(
        <div key={row} className="row">
          {rowCells}
        </div>
      );
    }   
    return boardCells;
  };

  return (
    <>
      {!gameId ? 
        <>
          <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
            <div className="glass-card rounded-4 p-5 shadow-lg" style={{ maxWidth: '450px' }}>
              <h1 className="display-6 fw-bold text-center text-white mb-4">
                SnakesWin
              </h1>
              
              <div className="d-flex flex-column gap-4">
                <button
                  onClick={handleCreateGame}
                  className="btn btn-custom-purple btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <span className="icon-container">
                    <GameController size={24} />
                  </span>
                  <span>Create Game</span>
                </button>

                <div className="d-flex align-items-center gap-3">
                  <hr className="flex-grow-1 opacity-25" />
                  <span className="text-white-50">OR</span>
                  <hr className="flex-grow-1 opacity-25" />
                </div>

                <button
                  onClick={handleJoinGame}
                  className="btn btn-custom-indigo btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <span className="icon-container">
                    <Users size={24} />
                  </span>
                  <span>Join Game</span>
                </button>
              </div>

              <p className="text-white-50 text-center small mt-4 mb-0">
                Connect with friends and start playing!
              </p>
            </div>
          </div>
        </>
      :
        <div style={{ position: 'relative', width: boardRowSize * cellSize, height: boardRowSize * cellSize }}>
          <div className="board">
            {renderBoard()}
          </div>
          <svg width={boardRowSize * cellSize} height={boardRowSize * cellSize} style={{ position: 'absolute', top: 0, left: 0 }}>
            {Object.entries(snakes).map(([start, end]) => {
              let startPos = getPosition(parseInt(start));
              let endPos = getPosition(parseInt(end));
              return <line key={start} x1={startPos.x} y1={startPos.y} x2={endPos.x} y2={endPos.y} stroke="red" strokeWidth="4" strokeLinecap="round"/>;
            })}
            {Object.entries(ladders).map(([start, end]) => {
              let startPos = getPosition(parseInt(start));
              let endPos = getPosition(parseInt(end));
              return <line key={start} x1={startPos.x} y1={startPos.y} x2={endPos.x} y2={endPos.y} stroke="green" strokeWidth="4" strokeLinecap="round"/>;
            })}
          </svg>
          <p>Game Code: {gameId}</p>
          <button
            onClick={rollDice}
            disabled={players[currentTurn] !== playerId}
          >
            Roll Dice
          </button>
          {diceValue !== null && <p>Dice Value: {diceValue} </p>}
          {winner && <p>Winner: {winner}</p>}
        </div>
      }
    </>
  );
}

export default Game;
