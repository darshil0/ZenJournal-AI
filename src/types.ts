export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  journaledAt: string;
  content: string;
  title: string;
  insight?: string;
  mood?: string;
  tags: string[];
}

export interface AIInsight {
  date: string;
  mood_score: number;
  mood_label: string;
  key_themes: string[];
  entry_summary: string;
  insight_of_the_day: string;
  reflection: string;
  follow_up_prompt: string;
  word_count: number;
  session_duration_mins: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mood?: string;
}

export interface WeeklySummary {
  avgMood: number;
  sessionCount: number;
  topMood: string;
  trend: string;
  moodDistribution: Record<string, number>;
  recurringThemes: string[];
}
