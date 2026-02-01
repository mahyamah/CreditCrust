import { useState, useEffect, useRef } from "react";
import { useGameState } from "./state/useGameState";
import { getInnerVoiceAdvice } from "./logic/geminiService";

import StatusBar from "./components/StatusBar";
import PayCreditModal from "./components/PayCreditModal";
import Home from "./pages/Home";
import GamesHub from "./pages/GamesHub";
import Grocery from "./pages/Grocery";
import Kitchen from "./pages/Kitchen";
import TicTacToe from "./games/tictactoe/TicTacToe";
import MemoryGame from "./games/MemoryGame/MemoryGame";

import { GAMES } from "./data/gamesList";
import { earnCoins } from "./logic/rules";
import QuickMath from "./games/quickmath/QuickMath";

export default function App() {
  const { state, setState, reset } = useGameState();
  const [page, setPage] = useState("home");
  const [payOpen, setPayOpen] = useState(false);

  // --- GEMINI STATE ---
  const [aiMessage, setAiMessage] = useState("Let's get cooking! We need coins and a good credit score for this pizza.");
  const [isTyping, setIsTyping] = useState(false);
  const prevState = useRef(state);

  // --- GEMINI TRIGGER LOGIC ---
  useEffect(() => {
    const triggerAi = async (action) => {
      setIsTyping(true);
      const msg = await getInnerVoiceAdvice(action, state);
      setAiMessage(msg);
      setIsTyping(false);
    };

    if (state.inventory.length > prevState.current.inventory.length) {
      triggerAi("Bought a new pizza ingredient using credit!");
    } else if (state.creditDebt < prevState.current.creditDebt) {
      triggerAi("Paid off some credit card debt!");
    } else if (state.creditDebt >= state.creditLimit && state.creditDebt > 0) {
      triggerAi("Our credit card is maxed out! We can't buy more until we pay it off.");
    }

    prevState.current = state;
  }, [state]);

  const playing = page.startsWith("play:");
  const gameId = playing ? page.split(":")[1] : null;
  const game = gameId ? GAMES.find(g => g.id === gameId) : null;

  return (
      <div>
        <StatusBar state={state} onOpenPay={() => setPayOpen(true)} />

        <div className="page-wrapper">
          {/* Pages only show when NOT playing a mini-game */}
          {!playing && (
              <>
                {page === "home" && <Home setPage={setPage} />}
                {page === "games" && <GamesHub state={state} setPage={setPage} />}
                {page === "grocery" && <Grocery state={state} setState={setState} setPage={setPage} />}
                {page === "kitchen" && <Kitchen state={state} setPage={setPage} />}
              </>
          )}

          {/* --- MINI GAMES (Moved INSIDE page-wrapper) --- */}

          {playing && gameId === "quickmath" && game && (
              <QuickMath
                  reward={game.reward}
                  onFinish={async (numCorrect) => {
                    const earned = Math.round((numCorrect / 5) * game.reward);
                    setState(s => earnCoins(s, earned));
                    setPage("games");
                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(`Finished QuickMath and earned ${earned} coins!`, state);
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {/* Memory Game */}
          {playing && gameId === "memory" && game && (
              <MemoryGame
                  reward={game.reward}
                  onFinish={async (earned) => {
                    setState(s => earnCoins(s, earned));
                    setPage("games");

                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(
                        `I matched all the pizza ingredients in Memory Match and earned ${earned} coins!`,
                        state
                    );
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {playing && gameId === "tictactoe" && game && (
              <TicTacToe
                  reward={game.reward}
                  onFinish={async (moves, winner) => {
                    let earned = winner === "X" ? game.reward : (winner === "Draw" ? Math.round(game.reward / 2) : 0);
                    setState(s => earnCoins(s, earned));
                    setPage("games");
                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(winner === "X" ? "Won TicTacToe!" : "Played a tough game of TicTacToe!", state);
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {/* --- GEMINI UI BUBBLE --- */}
          <div className="inner-voice-container">
            <div className="bubble">
              {isTyping ? "Thinking..." : aiMessage}
            </div>
            <div className="avatar-circle">🧠</div>
          </div>
        </div>

        {page === "final" && (
            <div className="win-screen-overlay">
              <h2>Pizza Complete! 🎉🍕</h2>
              <p>Elle used credit responsibly and reached her goal.</p>
              <p><strong>Credit Score:</strong> {state.creditScore}</p>
              <button onClick={() => { setPage("home"); reset(); }}>Back to Home</button>
            </div>
        )}

        {payOpen && (
            <PayCreditModal
                state={state}
                setState={setState}
                onClose={() => setPayOpen(false)}
            />
        )}
      </div>
  );
}