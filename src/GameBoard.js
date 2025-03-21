import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const BOARD_SIZE = 10;
const snakes = { 27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41 };
const ladders = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92 };

const GameBoard = () => {
    const [positions, setPositions] = useState({ 1: 0, 2: 0 });
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [diceRoll, setDiceRoll] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        const res = await axios.post("http://localhost:4000/reset");
        setPositions({ 1: 0, 2: 0 });
        setWinner(null);
    };

    const rollDice = async () => {
        if (winner) return;

        const res = await axios.post("http://localhost:4000/roll");
        setDiceRoll(res.data.roll);
        setPositions((prev) => ({
            ...prev,
            [currentPlayer]: res.data.position,
        }));
        setCurrentPlayer(res.data.player);
        if (res.data.winner) setWinner(res.data.winner);
    };

    // Create the snaking board layout
    const generateBoard = () => {
        let board = [];
        let count = 100;
        let reverse = false;
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            let row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                let cell = reverse ? count - j : count - (BOARD_SIZE - 1 - j);
                row.push(cell);
            }
            reverse = !reverse;
            count -= BOARD_SIZE;
            board.push(row);
        }
        return board;
    };

    return (
        <div className="game-container">
            <h1>Snakes & Ladders</h1>
            {winner ? <h2>Player {winner} Wins!</h2> : <h2>Player {currentPlayer}'s Turn</h2>}
            <h3>Dice Roll: {diceRoll}</h3>
            <button onClick={rollDice} disabled={winner}>Roll Dice</button>
            <button onClick={fetchPositions}>Reset Game</button>
            
            <div className="board">
                {generateBoard().map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell) => (
                            <div key={cell} className="cell">
                                {positions[1] === cell && <span className="player p1">P1</span>}
                                {positions[2] === cell && <span className="player p2">P2</span>}
                                {snakes[cell] && <div className="snake"></div>}
                                {ladders[cell] && <div className="ladder"></div>}
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
