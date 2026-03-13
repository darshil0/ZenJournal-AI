import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, ChatMessage, WeeklySummary, JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MODEL = "gemini-2.0-flash";

export async function generateJournalInsight(content: string): Promise<AIInsight> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Analyze this journal entry and return a JSON object: "${content}"`,
    config: {
      systemInstruction: `You are ZenJournal AI — a warm, emotionally intelligent journaling companion.
Your goal is to help users reflect, process emotions, and grow through mindful writing.
You are gentle, curious, and non-judgmental.

Analyze the provided journal entry and return ONLY a valid JSON object with these fields:
- date (string, today's ISO date)
- mood_score (number 1-10)
- mood_label (string, e.g. "Calm", "Anxious", "Joyful")
- key_themes (array of 2-4 strings)
- entry_summary (one sentence string)
- insight_of_the_day (one sentence string)
- reflection (full paragraph string)
- follow_up_prompt (gentle question string)
- word_count (number)
- session_duration_mins (estimated number)`,
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
  const systemInstruction = `You are ZenJournal AI — a warm, emotionally intelligent journaling companion.
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
If SAD, create space and validate.`;

  // Build conversation history for all messages except the last one
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.content }]
  }));

  const chat = ai.chats.create({
    model: MODEL,
    history,
    config: {
      systemInstruction,
    }
  });

  const lastMessage = messages[messages.length - 1];
  const response = await chat.sendMessage({ message: lastMessage.content });
  return response.text || "I'm here to listen. What's on your mind?";
}

export async function generateWeeklySummary(entries: JournalEntry[]): Promise<WeeklySummary> {
  // Limit entries to avoid token overflow
  const recentEntries = entries.slice(0, 20);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Analyze these journal entries and return a JSON summary.
Entries: ${JSON.stringify(recentEntries)}

Return ONLY a JSON object with:
- avgMood: average mood score (number 1-10, based on entry content if not explicit)
- sessionCount: total number of entries analyzed (number)
- topMood: the most frequently occurring mood (string)
- trend: overall emotional trend (string, e.g. "Improving", "Stable", "Declining")
- moodDistribution: object mapping mood names to their count (e.g. {"Calm": 3, "Anxious": 2})
- recurringThemes: array of 3-6 common themes across entries`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const raw = response.text || "{}";
    const parsed = JSON.parse(raw);
    // Ensure moodDistribution is a plain object of string->number
    if (!parsed.moodDistribution || typeof parsed.moodDistribution !== 'object') {
      parsed.moodDistribution = {};
    }
    return parsed as WeeklySummary;
  } catch (e) {
    console.error("Failed to parse weekly summary", e);
    throw new Error("Failed to generate weekly summary");
  }
}
