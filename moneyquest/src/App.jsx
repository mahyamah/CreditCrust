import { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import { useGameState } from "./state/useGameState";
import { getInnerVoiceAdvice } from "./logic/geminiService"; // Import Service

import StatusBar from "./components/StatusBar";
import PayCreditModal from "./components/PayCreditModal";
import Home from "./pages/Home";
import GamesHub from "./pages/GamesHub";
import Grocery from "./pages/Grocery";
import Kitchen from "./pages/Kitchen";
import TicTacToe from "./games/tictactoe/TicTacToe";

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

    // Trigger 1: Bought an ingredient (Inventory grew)
    if (state.inventory.length > prevState.current.inventory.length) {
      triggerAi("Bought a new pizza ingredient using credit!");
    }
    // Trigger 2: Paid Credit (Debt decreased)
    else if (state.creditDebt < prevState.current.creditDebt) {
      triggerAi("Paid off some credit card debt!");
    }
    // Trigger 3: Maxed out Credit (Debt hit limit)
    else if (state.creditDebt >= state.creditLimit && state.creditDebt > 0) {
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
          {page === "home" && <Home setPage={setPage} />}
          {page === "games" && <GamesHub state={state} setPage={setPage} />}
          {page === "grocery" && <Grocery state={state} setState={setState} setPage={setPage} />}
          {page === "kitchen" && <Kitchen state={state} setPage={setPage} />}

          {/* --- GEMINI UI BUBBLE --- */}
          <div className="inner-voice-container">
            <div className="bubble">
              {isTyping ? "Thinking..." : aiMessage}
            </div>
            <div className="avatar-circle">🧠</div>
          </div>
        </div>

        {page === "final" && (
            <div style={{ padding: 16 }}>
              <h2>Pizza Complete! 🎉🍕</h2>
              <p>Elle used credit responsibly and reached her goal.</p>
              <p><strong>Credit Score:</strong> {state.creditScore}</p>
              <button onClick={() => { setPage("home"); reset(); }}>Back to Home</button>
            </div>
        )}

        {playing && gameId === "quickmath" && game && (
            <QuickMath
                reward={game.reward}
                onFinish={async (numCorrect) => { // Made async for Gemini
                  const earned = Math.round((numCorrect / 5) * game.reward);
                  setState(s => earnCoins(s, earned));
                  setPage("games");

                  // Trigger 4: Finished a game
                  setIsTyping(true);
                  const msg = await getInnerVoiceAdvice(`Finished a mini-game and earned ${earned} coins!`, state);
                  setAiMessage(msg);
                  setIsTyping(false);
                }}
            />
        )}
        {/* TIC TAC TOE GAME */}
        {playing && gameId === "tictactoe" && game && (
            <TicTacToe
                reward={game.reward}
                onFinish={async (moves, winner) => {
                  let earned = 0;
                  if (winner === "X") earned = game.reward; // Full reward for win
                  else if (winner === "Draw") earned = Math.round(game.reward / 2); // Half for draw

                  setState(s => earnCoins(s, earned));
                  setPage("games");

                  // Trigger Gemini Voice
                  setIsTyping(true);
                  const msg = await getInnerVoiceAdvice(
                      winner === "X"
                          ? `I just crushed the computer at Tic Tac Toe and earned ${earned} coins!`
                          : `I played Tic Tac Toe but it was a ${winner}. I earned ${earned} coins.`,
                      state
                  );
                  setAiMessage(msg);
                  setIsTyping(false);
                }}
            />
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