# ZenJournal AI

A minimalist, privacy-first AI journaling app for daily reflections and personalized insights.

## 🌿 Vision

ZenJournal AI is designed to be a sanctuary for your thoughts. It combines the simplicity of a traditional journal with the power of modern AI to help you uncover patterns, process emotions, and cultivate mindfulness.

## ✨ Features

- **Mindful Writing:** A clean, distraction-free editor with support for rich text, task lists, and images.
- **AI Insights:** Get instant reflections, mood analysis, and gentle follow-up prompts for every entry.
- **Focus Mode:** Hide all distractions and immerse yourself in the writing process.
- **Weekly Summaries:** Visualize your emotional trends and recurring themes over time.
- **Privacy First:** All your entries are stored locally in your browser. No data ever leaves your device unless you choose to export it.
- **Smart Navigation:** Jump to specific dates, filter by tags, or search through your entire history.
- **AI Companion:** A warm, non-judgmental chat companion to help you process specific thoughts or feelings.

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Editor:** Tiptap (Rich Text Framework)
- **Animations:** Framer Motion
- **AI:** Google Gemini API (@google/genai)
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/App.tsx`: Main application logic and UI.
- `src/services/ai.ts`: Integration with Google Gemini API.
- `src/types.ts`: TypeScript interfaces and types.
- `src/data/seedEntries.ts`: Sample data for testing and exploration.
- `src/index.css`: Global styles and Tailwind configuration.

## 📄 License

Apache-2.0
