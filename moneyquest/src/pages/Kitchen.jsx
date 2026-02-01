// import { INGREDIENTS } from "../data/ingredients";
// import { hasAllIngredients, ownedCount } from "../logic/rules";

// export default function Kitchen({ state, setPage }) {
//   const count = ownedCount(state, INGREDIENTS);
//   const done = hasAllIngredients(state, INGREDIENTS);

//   const stageEmoji =
//     count === 0 ? "🍽️" :
//     count === 1 ? "🍞" :
//     count === 2 ? "🍞🟥" :
//     count === 3 ? "🍞🟥🟨" :
//     "🍕";

//   return (
//     <div className="page-kitchen" style={{ padding: 16 }}>
//       <h2 className="title">Kitchen 🍕</h2>
//       <div style={{ fontSize: 42, marginTop: 12 }}>{stageEmoji}</div>
//       <p >Ingredients owned: {count}/{INGREDIENTS.length}</p>

//       {!done ? (
//         <p>Buy all ingredients to unlock “Make Pizza”.</p>
//       ) : (
//         <div style={{ marginTop: 12 }}>
//           <button onClick={() => setPage("final")}>Make Pizza 🎉</button>
//         </div>
//       )}

//       <div style={{ marginTop: 12 }}>
//         <button onClick={() => setPage("home")}>Back</button>
//       </div>
//     </div>
//   );
// }
import { INGREDIENTS } from "../data/ingredients";
import { hasAllIngredients, ownedCount } from "../logic/rules";

export default function Kitchen({ state, setPage }) {
  const count = ownedCount(state, INGREDIENTS);
  const done = hasAllIngredients(state, INGREDIENTS);

  // Sort by stage so sauce is under cheese etc.
  const layers = [...INGREDIENTS].sort((a, b) => a.stage - b.stage);

  return (
    <div className="page-kitchen">
      <h2 className="title">Kitchen 🍕</h2>

      <div className="kitchen-ui">
        <div className="pizza-frame">
          {/* optional base plate */}
          {/* <img className="pizza-plate" src="/pizza/plate.png" alt="" /> */}

          {layers.map((ing) => {
            const owned = state.inventory.includes(ing.id);

            return (
              <img
                key={ing.id}
                src={`/pizza/i-${ing.id}.png`}
                alt={ing.name}
                className={`pizza-layer ${owned ? "show" : "hide"}`}
                style={{ zIndex: ing.stage }}
                draggable={false}
              />
            );
          })}
        </div>

        <div className="kitchen-info">
          <p>Ingredients owned: {count}/{INGREDIENTS.length}</p>

          {!done ? (
            <p>Buy all ingredients to unlock “Make Pizza”.</p>
          ) : (
            <button className="make-btn" onClick={() => setPage("final")}>
              Make Pizza 🎉
            </button>
          )}

          <button className="back-btn" onClick={() => setPage("home")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
