import React, { useState, useEffect } from "react";
import "./TicTacToe.css";

export default function TicTacToe({ reward, onFinish }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [status, setStatus] = useState("Your turn! Get 3 in a row.");
    const [gameOver, setGameOver] = useState(false);

    // Check for winner
    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.includes(null) ? null : "Draw";
    };

    // AI Logic: Smart Move
    const getComputerMove = (currentBoard) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // 1. CHANCE TO BE "DUMB" (30% chance)
        // This ensures the player can actually win rather than just drawing.
        const isFeelingSilly = Math.random() < 0.3;

        if (!isFeelingSilly) {
            // 2. Try to WIN
            for (let line of lines) {
                const [a, b, c] = line;
                const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
                if (vals.filter(v => v === "O").length === 2 && vals.filter(v => v === null).length === 1) {
                    return line[vals.indexOf(null)];
                }
            }

            // 3. Try to BLOCK Player
            for (let line of lines) {
                const [a, b, c] = line;
                const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
                if (vals.filter(v => v === "X").length === 2 && vals.filter(v => v === null).length === 1) {
                    return line[vals.indexOf(null)];
                }
            }

            // 4. Take Center (if smart)
            if (!currentBoard[4]) return 4;
        }

        // 5. PICK RANDOM (The "Fallthrough" move)
        const available = currentBoard
            .map((v, i) => (v === null ? i : null))
            .filter((v) => v !== null);
        return available[Math.floor(Math.random() * available.length)];
    };

    const handleClick = (i) => {
        if (gameOver || board[i] || !isPlayerTurn) return;

        const newBoard = [...board];
        newBoard[i] = "X";
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const winner = checkWinner(newBoard);
        if (winner) {
            endGame(winner);
        }
    };

    useEffect(() => {
        if (!isPlayerTurn && !gameOver) {
            setStatus("Computer is thinking...");
            setTimeout(() => {
                const move = getComputerMove(board);
                const newBoard = [...board];
                newBoard[move] = "O";
                setBoard(newBoard);
                setIsPlayerTurn(true);
                setStatus("Your turn!");

                const winner = checkWinner(newBoard);
                if (winner) endGame(winner);
            }, 600);
        }
    }, [isPlayerTurn, gameOver, board]);

    const endGame = (winner) => {
        setGameOver(true);
        if (winner === "X") {
            setStatus(`You won! +${reward} coins!`);
        } else if (winner === "O") {
            setStatus("Computer won! Better luck next time.");
        } else {
            setStatus("It's a draw!");
        }
    };

    return (
        <div className="ttt-overlay">
            <div className="ttt-container">
                <h2>Pizza Tic-Tac-Toe</h2>
                <p className="ttt-status">{status}</p>

                <div className="ttt-grid">
                    {board.map((val, i) => (
                        <div key={i} className={`ttt-cell ${val}`} onClick={() => handleClick(i)}>
                            {val}
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <button className="ttt-done-btn" onClick={() => onFinish(board.filter(x => x === "X").length, checkWinner(board))}>
                        Collect Reward & Exit
                    </button>
                )}
            </div>
        </div>
    );
}