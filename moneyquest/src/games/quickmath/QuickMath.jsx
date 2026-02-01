import React, { useState, useEffect, useCallback } from "react";
import "./QuickMath.css";

export default function QuickMath({ onFinish, onBack }) {
    const [problem, setProblem] = useState({ q: "", a: 0 });
    const [userAnswer, setUserAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);

    // Generate problems: 2d*1d, 2d+2d, 2d-1d
    const generateProblem = useCallback(() => {
        const types = ["add", "sub", "mul"];
        const type = types[Math.floor(Math.random() * types.length)];
        let q, a;

        if (type === "add") {
            const n1 = Math.floor(Math.random() * 90) + 10; // 10-99
            const n2 = Math.floor(Math.random() * 90) + 10; // 10-99
            q = `${n1} + ${n2}`;
            a = n1 + n2;
        } else if (type === "sub") {
            const n1 = Math.floor(Math.random() * 90) + 10; // 10-99
            const n2 = Math.floor(Math.random() * 9) + 1;  // 1-9
            q = `${n1} - ${n2}`;
            a = n1 - n2;
        } else {
            const n1 = Math.floor(Math.random() * 90) + 10; // 10-99
            const n2 = Math.floor(Math.random() * 8) + 2;  // 2-9
            q = `${n1} × ${n2}`;
            a = n1 * n2;
        }
        setProblem({ q, a });
    }, []);

    // Initialize
    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    // Timer
    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    const checkAnswer = (e) => {
        const val = e.target.value;
        setUserAnswer(val);
        if (parseInt(val) === problem.a) {
            setScore(s => s + 1);
            setUserAnswer("");
            generateProblem();
        }
    };

    return (
        <div className="math-game-overlay">
            <button className="game-exit-btn" onClick={onBack}>← Exit</button>

            <div className="math-game-container">
                <div className="math-header">
                    <h2>Quick Math</h2>
                    <div className="math-stats">
                        <div className="math-stat-box">TIME: {timeLeft}s</div>
                        <div className="math-stat-box">EARNED: {score * 5} 🪙</div>
                    </div>
                </div>

                {!gameOver ? (
                    <div className="math-body">
                        <div className="math-question">{problem.q} = ?</div>
                        <input
                            type="number"
                            autoFocus
                            className="math-input"
                            value={userAnswer}
                            onChange={checkAnswer}
                            placeholder="Type answer..."
                        />
                        <p className="math-hint">5 coins per correct answer!</p>
                    </div>
                ) : (
                    <div className="math-results">
                        <h3>Time's Up!</h3>
                        <p>You solved {score} problems correctly.</p>
                        <button className="collect-btn" onClick={() => onFinish(score * 5)}>
                            Collect {score * 5} Coins
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}