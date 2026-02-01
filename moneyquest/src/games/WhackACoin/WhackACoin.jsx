import React, { useState, useEffect } from "react";
import "./WhackACoin.css";

export default function WhackACoin({ reward, onFinish, onBack }) {
    const [activeHole, setActiveHole] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); // 15-second round
    const [gameOver, setGameOver] = useState(false);

    // 1. Timer Logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setGameOver(true);
            setActiveHole(null);
        }
    }, [timeLeft]);

    // 2. Coin Popping Logic
    useEffect(() => {
        if (gameOver) return;

        const pop = () => {
            const randomHole = Math.floor(Math.random() * 9);
            setActiveHole(randomHole);

            // Speed up as player scores more
            const stayTime = Math.max(400, 1000 - (score * 5));
            setTimeout(() => setActiveHole(null), stayTime);
        };

        const interval = setInterval(pop, 1100);
        return () => clearInterval(interval);
    }, [gameOver, score]);

    const handleWhack = (index) => {
        if (index === activeHole) {
            setScore(s => s + 10);
            setActiveHole(null); // Coin disappears immediately on hit
        }
    };

    return (
        <div className="whack-game-overlay">
            {/* Back Button */}
            <button className="game-exit-btn" onClick={onBack}>← Exit</button>

            <div className="whack-game-container">
                <div className="whack-ui">
                    <h2>Whack-A-Coin!</h2>
                    <div className="whack-stats">
                        <div className="stat-box">TIME: {timeLeft}s</div>
                        <div className="stat-box">EARNED: {score} 🪙</div>
                    </div>
                </div>

                <div className="whack-grid">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="whack-hole" onClick={() => handleWhack(i)}>
                            <div className={`whack-coin-sprite ${activeHole === i ? "up" : ""}`}>
                                💰
                            </div>
                            <div className="hole-shadow"></div>
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className="whack-results-modal">
                        <h3>Times Up!</h3>
                        <p>You earned {score} coins for your pizza!</p>
                        <button className="collect-btn" onClick={() => onFinish(score)}>
                            Collect & Exit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}