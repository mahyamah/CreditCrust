import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const ICONS = ["🍕", "🧀", "🍅", "💰", "💳", "🐷"];

export default function MemoryGame({ reward, onFinish }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [scores, setScores] = useState({ player: 0, cpu: 0 });

    useEffect(() => {
        const deck = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));
        setCards(deck);
    }, []);

    // CPU TURN LOGIC
    useEffect(() => {
        if (!isPlayerTurn && matched.length < 12) {
            setTimeout(() => {
                // CPU picks two random cards that aren't matched yet
                const available = cards
                    .map((_, i) => i)
                    .filter((i) => !matched.includes(i));

                const firstIdx = available[Math.floor(Math.random() * available.length)];
                const secondIdx = available.filter(i => i !== firstIdx)[Math.floor(Math.random() * (available.length - 1))];

                setFlipped([firstIdx, secondIdx]);

                setTimeout(() => {
                    if (cards[firstIdx].icon === cards[secondIdx].icon) {
                        setMatched((prev) => [...prev, firstIdx, secondIdx]);
                        setScores((s) => ({ ...s, cpu: s.cpu + 1 }));
                        setFlipped([]);
                        // CPU gets another turn if it matches! (Optional)
                        setIsPlayerTurn(false);
                    } else {
                        setFlipped([]);
                        setIsPlayerTurn(true);
                    }
                }, 1200);
            }, 1000);
        }
    }, [isPlayerTurn, matched, cards]);

    const handleFlip = (index) => {
        if (!isPlayerTurn || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].icon === cards[second].icon) {
                setMatched((prev) => [...prev, first, second]);
                setScores((s) => ({ ...s, player: s.player + 1 }));
                setFlipped([]);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setIsPlayerTurn(false); // Switch to CPU
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matched.length === 12) {
            const finalReward = scores.player >= scores.cpu ? reward : Math.round(reward / 2);
            setTimeout(() => onFinish(finalReward), 1000);
        }
    }, [matched, scores, reward, onFinish]);

    return (
        <div className="memory-game-container">
            <div className="memory-score-board">
                <div className={isPlayerTurn ? "active" : ""}>You: {scores.player}</div>
                <div className={!isPlayerTurn ? "active" : ""}>CPU: {scores.cpu}</div>
            </div>

            <div className="memory-grid">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`memory-card ${flipped.includes(index) || matched.includes(index) ? "flipped" : ""}`}
                        onClick={() => handleFlip(index)}
                    >
                        <div className="memory-card-inner">
                            <div className="memory-card-front">?</div>
                            <div className="memory-card-back">{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="turn-indicator">{isPlayerTurn ? "Your Turn!" : "CPU's Turn..."}</p>
        </div>
    );
}