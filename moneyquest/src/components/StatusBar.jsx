export default function StatusBar({ state, onOpenPay }) {
  return (
    <div className="status-bar">
      <div>💰 Wallet: {state.walletCoins}</div>
      <div>⭐ Credit Score: {state.creditScore}</div>
      <div>💳 Limit: {state.creditLimit}</div>
      <div>⚠ Debt: {state.creditDebt}</div>
      <button className="pay-btn" onClick={onOpenPay}>Pay Credit</button>
    </div>
  );
}
