import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCDx4Gz3ACIg5DSXxaoYFZAOJfm6G9r4lw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getInnerVoiceAdvice(actionType, state) {
    const prompt = `
    Context: You are the witty "Inner Voice" of ${state.playerName} in a financial pizza game.
    Current Stats: 
    - Coins: ${state.walletCoins}
    - Credit Score: ${state.creditScore}
    - Credit Debt: ${state.creditDebt}
    - Credit Limit: ${state.creditLimit}
    - Pizza Progress: ${state.pizzaStage}/4
    
    The player just did: ${actionType}

    Task: Give a 1-sentence reaction. 
    - If they bought something: Mention the ingredient and credit use.
    - If they paid credit: Celebrate the score/limit increase.
    - If they tried to buy but failed: Explain they need to pay debt first to free up their limit.
    - If they earned coins: Encourage them to use it to pay their "crusty" debt.
    
    Tone: Punchy, empowering, and use pizza puns.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        return "Keep cooking, chef! You're doing great.";
    }
}