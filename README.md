<div align="center">
  <img width="1200" height="475" alt="ZenJournal AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>ZenJournal AI</h1>
  <p>A minimalist, privacy-first AI journaling app for daily reflections and personalized insights.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/License-Apache_2.0-green" alt="License" />
  </p>
</div>

---

## Overview

ZenJournal AI is a calm, focused journaling experience powered by Google's Gemini AI. Write freely, track your mood, and receive thoughtful AI-generated reflections — all stored privately in your browser with no account required.

### Key Features

- **Rich-text editor** — Bold, italic, underline, lists, task lists, links, and image embeds via TipTap
- **Mood tracking** — Tag each entry with one of nine mood states (Joyful, Calm, Anxious, and more)
- **AI Insights** — Get a mood score, entry summary, personal reflection, and a follow-up journaling prompt powered by Gemini
- **AI Companion** — A conversational chat companion that adapts to your emotional state in real time
- **Weekly Summary** — Analyse patterns across your entries: average mood, top themes, mood distribution, and trend
- **Streak tracker** — Encourages daily journaling with a consecutive-day streak counter
- **Search & filter** — Filter entries by keyword, tag, or date range (last 7 days, this month, or all time)
- **Export** — Download all your entries as a JSON file at any time
- **Privacy-first** — All data lives in your browser's `localStorage`. Nothing is sent to a server


---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Editor | TipTap v3 (ProseMirror) |
| AI | Google Gemini 2.0 Flash via `@google/genai` |
| Animations | Motion (Framer Motion) |
| Date utilities | date-fns |
| Build tool | Vite 6 |
| Deployment | GitHub Pages via GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- A [Google AI Studio](https://aistudio.google.com/) API key

### Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/zenjournal-ai.git
   cd zenjournal-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set your API key**

   Create a `.env.local` file in the project root:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Deploying to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

### One-time setup

1. **Add your API key as a repository secret**
   - Go to your repo → **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`, Value: your Gemini API key

2. **Enable GitHub Pages**
   - Go to **Settings → Pages**
   - Under **Source**, select **GitHub Actions**

3. **Push to `main`**

   The workflow will automatically build and deploy. Your app will be live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

### Manual deploy

You can also trigger a deploy from the **Actions** tab using the **Run workflow** button.

---

## Project Structure

```
zenjournal-ai/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD
├── src/
│   ├── data/
│   │   └── seedEntries.ts      # 20 sample journal entries
│   ├── services/
│   │   └── ai.ts               # Gemini API calls (insights, chat, summary)
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles + TipTap/ProseMirror overrides
│   ├── main.tsx                # React entry point
│   └── types.ts                # TypeScript interfaces
├── index.html                  # HTML shell
├── metadata.json               # App metadata (used by AI Studio)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Google AI Studio API key |
| `VITE_BASE_PATH` | CI only | Base path for GitHub Pages (e.g. `/zenjournal-ai/`). Set automatically by the workflow |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server on port 3000 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove the `dist/` directory |

---

## Privacy

ZenJournal AI stores all journal entries exclusively in your browser's `localStorage`. No data is transmitted to any server, and no account is required. Use the **Export** feature in Settings to back up your entries as a JSON file.

---

## License

Licensed under the [Apache 2.0 License](LICENSE).
