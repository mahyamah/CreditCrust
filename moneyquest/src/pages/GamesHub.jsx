import { GAMES } from "../data/gamesList";

export default function GamesHub({ state, setPage }) {
  return (
    <div className="page-game" style={{ padding: 16 }}>
      <h2 className="title">Games</h2>
      <p className="subtitle" style={{color:"black"}}>Play mini-games to earn coins (coins are only for paying credit).</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12 }}>
        {GAMES.map((g, i) => {
          const unlocked = i <= state.unlockedGameIndex;
          return (
            <button
              key={g.id}
              onClick={() => unlocked && setPage(`play:${g.id}`)}
              disabled={!unlocked}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                opacity: unlocked ? 1 : 0.5
              }}
            >
              <div style={{ fontWeight: 700 }}>{g.name}</div>
              <div style={{ fontSize: 12 }}>Reward: +{g.reward} coins</div>
              {!unlocked && <div style={{ marginTop: 6 }}>🔒 Locked</div>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage("home")}>Back</button>
      </div>
    </div>
  );
}
