
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAirdropMessage(value: number, discordRoles: string): Promise<string> {
  const roleInfo = discordRoles.trim() ? `They hold key roles in our Discord, such as: "${discordRoles}".` : "They are a valued member of our community.";
  
  const prompt = `
    You are the official AI for Irys XYZ, a cutting-edge web3 project. Your tone is futuristic, encouraging, and slightly mysterious.

    A user has just checked their potential airdrop eligibility and their calculated value is ${value} IRYS tokens. ${roleInfo}

    Generate a short, exciting message (2-3 sentences) for them. Congratulate them on their eligibility and potential airdrop. If they listed Discord roles, acknowledge their contribution to the community. Do not repeat the token amount.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "Congratulations! Your engagement with the Irys ecosystem has been recognized. The future is bright.";
  }
}
