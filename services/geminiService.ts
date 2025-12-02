import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client. 
// Note: In a real production app, you might want to handle missing keys more gracefully in the UI.
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-pro-preview';

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: "You are the AI assistant for 'Simayne Trading (Pty) Ltd', a growing multi-service procurement and supply company in South Africa. The company is young, innovative, and practical. \n\nCORE SERVICES:\n1. Procurement & Supply: Sourcing household goods, beverages, FMCG, and general trade supplies.\n2. Custom Branding: Engraved glasses, merchandise printing, and logo branding.\n3. Product Sourcing: Finding hard-to-find stock, handling tenders, and bulk orders for B2B.\n\nKEY TRAITS: Flexible sourcing, entrepreneurial mindset, and customer-first approach. We serve hospitality, bars, retailers, and individuals.\n\nSimayne also owns 'kasilyfstyle.com'.\n\nYour tone should be professional, solution-oriented, and friendly. Emphasize that Simayne can find almost anything a client needs.",
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt || "Analyze this image. If it is a product, identify what it is and suggest how Simayne Trading could source or supply it in bulk. If it is a design/logo, suggest how it could be applied to merchandise (glass, clothing, etc)."
          }
        ]
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please check your API key and try again.");
  }
};