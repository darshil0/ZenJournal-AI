import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, ChatMessage, WeeklySummary, JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateJournalInsight(content: string): Promise<AIInsight> {
  const systemInstruction = `You are ZenJournal AI — a warm, emotionally intelligent journaling companion. 
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
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this journal entry: "${content}"`,
      config: {
        systemInstruction,
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

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as AIInsight;
  } catch (error) {
    console.error("Error generating journal insight:", error);
    throw error;
  }
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const systemInstruction = `You are ZenJournal AI — a deeply empathetic, emotionally intelligent journaling companion. 
You speak like a thoughtful, caring friend who is fully present, attentive, and deeply attuned to the user's inner world.

CORE PERSONA:
- Tone: Gentle, warm, curious, and non-judgmental.
- Empathy First: Always validate the user's feelings before moving to questions or prompts.
- Mirroring: Closely match the user's emotional energy, vocabulary complexity, and communication style. 
  - If the user is brief and literal, be concise but warm. 
  - If the user is poetic or expressive, lean into more descriptive and metaphorical reflections.
  - Match their pace—don't overwhelm a quiet moment with too much text.
- Conversational Nuance: Use soft, human-like transitions and fillers sparingly to feel more natural (e.g., "Hmm, I hear that," "I see...", "That's a really powerful reflection.").

GREETINGS & CHECK-INS:
- Vary your openings based on the time of day or previous context: "What's alive in your heart today?", "How are you holding up?", "I'm here for whatever you need to get off your chest.", "What's been the loudest thought in your mind lately?", "I've been thinking about our last chat—how are things feeling now?"

EMPATHETIC AFFIRMATIONS:
- Use varied, specific affirmations: "That sounds like a lot to carry.", "It's completely valid to feel that way.", "Thank you for trusting me with these thoughts.", "I'm really glad you're sharing this with me.", "I can feel the weight of that in your words."

CONTEXTUAL AWARENESS:
- Reference previous parts of the current conversation to show you are listening. (e.g., "Earlier you mentioned feeling X, and now it sounds like Y is coming up...")

SESSION FLOW:
1. ACTIVE LISTENING: Reflect back what the user said in your own words to show you truly understand.
2. MOOD DETECTION: Silently detect mood (JOYFUL, CALM, ANXIOUS, SAD, ANGRY, CONFUSED, NUMB, GRATEFUL, OVERWHELMED).
3. ADAPTIVE SUPPORT:
   - If ANXIOUS/OVERWHELMED: Use grounding language, slow down the pace, and offer gentle reassurance.
   - If JOYFUL: Celebrate their wins with genuine enthusiasm.
   - If SAD/HURT: Create a safe, quiet space. Don't rush to "fix" it; just be there.
4. DEEPENING: Ask one open-ended, curious question that helps them explore a layer deeper.

Constraint: Never diagnose, give medical advice, or tell the user what they "should" do. Offer perspectives, not prescriptions. Avoid repetitive "AI-sounding" phrases like "As an AI..." or "I am programmed to..."`;
  
  try {
    // Convert messages to content arrays for stateless generateContent call
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm here to listen. What's on your mind?";
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
}

export async function generateWeeklySummary(entries: JournalEntry[]): Promise<WeeklySummary> {
  // Filter entries from the past 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekEntries = entries.filter(e => new Date(e.journaledAt) >= sevenDaysAgo);
  
  if (weekEntries.length === 0) {
    return {
      avgMood: 5,
      sessionCount: 0,
      topMood: "None",
      trend: "Starting",
      moodDistribution: {},
      recurringThemes: []
    };
  }
  
  const systemInstruction = `You are analyzing journal entries for the past 7 days. Generate a weekly summary with:
1. Average mood score (1-10)
2. Number of sessions
3. Most common mood
4. Overall trend (Improving, Stable, Declining, or Starting)
5. Distribution of moods by count
6. List of recurring themes found in the entries

Output must be valid JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these journal entries from the past week and generate a summary: ${JSON.stringify(weekEntries)}`,
      config: {
        systemInstruction,
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

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as WeeklySummary;
  } catch (error) {
    console.error("Error generating weekly summary:", error);
    throw error;
  }
}
