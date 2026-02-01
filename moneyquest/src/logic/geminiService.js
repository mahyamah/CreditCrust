import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCDx4Gz3ACIg5DSXxaoYFZAOJfm6G9r4lw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getInnerVoiceAdvice(action, state) {
    const prompt = `
    You are the "Inner Voice" of ${state.playerName} in a game called Credit Crust. 
    Your goal: Help them make pizza by managing credit responsibly.
    
    Current Stats:
    - Wallet: ${state.walletCoins} coins
    - Credit Score: ${state.creditScore}
    - Credit Debt: $${state.creditDebt}
    - Credit Limit: $${state.creditLimit}
    
    The player just did this: ${action}

    Rules:
    1. Respond in 1 short, witty sentence. 
    2. Use pizza puns (crust, dough, cheesy, toppings).
    3. If they paid credit, celebrate their score/limit growth.
    4. If they earned coins, suggest paying off debt.
    5. If they bought ingredients, mention the pizza progress.
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        return "Keep cooking, chef! We're making progress!";
    }
}