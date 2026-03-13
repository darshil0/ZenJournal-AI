import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, ChatMessage, WeeklySummary, JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateJournalInsight(content: string): Promise<AIInsight> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this journal entry: "${content}"`,
    config: {
      systemInstruction: `You are ZenJournal AI — a warm, emotionally intelligent journaling companion. 
      Your goal is to help users reflect, process emotions, and grow through mindful writing. 
      You are gentle, curious, and non-judgmental.
      
      When analyzing an entry:
      1. Detect the mood score (1-10) and label.
      2. Extract key themes.
      3. Provide a one-sentence summary.
      4. Provide a one-sentence insight of the day.
      5. Write a full reflection paragraph.
      6. Generate a gentle follow-up prompt.
      7. Estimate word count and session duration.
      
      Output the result in the following JSON format:
      {
        "date": "YYYY-MM-DD",
        "mood_score": 1-10,
        "mood_label": "mood state",
        "key_themes": ["theme1", "theme2"],
        "entry_summary": "one sentence",
        "insight_of_the_day": "one sentence",
        "reflection": "full paragraph",
        "follow_up_prompt": "gentle question",
        "word_count": number,
        "session_duration_mins": number
      }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          mood_score: { type: Type.NUMBER },
          mood_label: { type: Type.STRING },
          key_themes: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          entry_summary: { type: Type.STRING },
          insight_of_the_day: { type: Type.STRING },
          reflection: { type: Type.STRING },
          follow_up_prompt: { type: Type.STRING },
          word_count: { type: Type.NUMBER },
          session_duration_mins: { type: Type.NUMBER }
        },
        required: [
          "date", "mood_score", "mood_label", "key_themes", 
          "entry_summary", "insight_of_the_day", "reflection", 
          "follow_up_prompt", "word_count", "session_duration_mins"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AIInsight;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate insights");
  }
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are ZenJournal AI — a warm, emotionally intelligent journaling companion. 
      You speak like a thoughtful, caring friend.
      
      CORE PERSONA:
      - Tone: Gentle, warm, curious, non-judgmental.
      - Never diagnose or give medical advice.
      - Mirror the user's emotional energy.
      - Use "I notice..." and "It sounds like..."
      
      SESSION FLOW:
      1. CHECK-IN: Start with "What's alive in you today?" or similar.
      2. MOOD DETECTION: Silently detect mood (JOYFUL, CALM, ANXIOUS, SAD, ANGRY, CONFUSED, NUMB, GRATEFUL, OVERWHELMED).
      3. ADAPTIVE PROMPTS: Offer a single, focused prompt based on detected mood if they seem stuck.
      4. ACTIVE LISTENING: Reflect what you heard and ask one deepening question.
      
      If the user is ANXIOUS/OVERWHELMED, ground them first.
      If JOYFUL, celebrate with them.
      If SAD, create space and validate.`,
    }
  });

  const lastMessage = messages[messages.length - 1];
  const response = await chat.sendMessage({ message: lastMessage.content });
  return response.text || "I'm here to listen. What's on your mind?";
}

export async function generateWeeklySummary(entries: JournalEntry[]): Promise<WeeklySummary> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze these journal entries from the past week and generate a summary: ${JSON.stringify(entries)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          avgMood: { type: Type.NUMBER },
          sessionCount: { type: Type.NUMBER },
          topMood: { type: Type.STRING },
          trend: { type: Type.STRING },
          moodDistribution: { 
            type: Type.OBJECT,
            additionalProperties: { type: Type.NUMBER }
          },
          recurringThemes: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["avgMood", "sessionCount", "topMood", "trend", "moodDistribution", "recurringThemes"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as WeeklySummary;
  } catch (e) {
    console.error("Failed to parse weekly summary", e);
    throw new Error("Failed to generate weekly summary");
  }
}
