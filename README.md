# ZenJournal AI

> A minimalist, privacy-first AI journaling app for daily reflections and personalized insights.

[![Deploy to GitHub Pages](https://github.com/darshil0/ZenJournal-AI/actions/workflows/deploy.yml/badge.svg)](https://github.com/darshil0/ZenJournal-AI/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)

[Live Demo](https://darshil0.github.io/ZenJournal-AI/) | [Report Bug](https://github.com/darshil0/ZenJournal-AI/issues) | [Request Feature](https://github.com/darshil0/ZenJournal-AI/issues)

---

## 🌿 Vision

ZenJournal AI is designed to be a sanctuary for your thoughts. It combines the simplicity of a traditional journal with the power of modern AI to help you uncover patterns, process emotions, and cultivate mindfulness. Your entries stay completely private — stored locally in your browser — while AI insights help you gain deeper self-awareness.

## ✨ Features

### 📝 Core Journaling
- **Rich Text Editor:** Built with Tiptap, supporting bold, italic, underline, lists, task lists, links, images, and more
- **Mood Tracking:** Log your emotional state with 9 preset moods (Joyful, Calm, Anxious, Sad, Angry, Confused, Numb, Grateful, Overwhelmed)
- **Smart Tagging:** Organize entries with custom tags and multi-tag filtering (AND logic)
- **Version History:** Auto-saved snapshots of your entries with one-click rollback
- **Advanced Search:** Support for exact phrases (`"phrase"`), word exclusion (`-word`), tag inclusion (`#tag`), and tag exclusion (`-#tag`)

### 🤖 AI-Powered Insights
- **Entry Analysis:** Get instant mood scores (1-10), key themes, summaries, and reflective insights for each entry
- **Weekly Summaries:** Visualize emotional trends, mood distribution, and recurring themes over the past 7 days
- **AI Companion:** Warm, empathetic chat companion to help process thoughts in real-time
- **Personalized Prompts:** Daily writing prompts generated from your journal history and patterns
- **Follow-up Questions:** AI-generated prompts to deepen reflection and explore emotions further

### 🎨 User Experience
- **Focus Mode:** Distraction-free writing environment that hides all sidebars and UI chrome
- **Dark Mode:** Full dark theme support with system preference detection
- **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices
- **Keyboard Shortcuts:** 
  - `Ctrl/Cmd + N` - New entry
  - `Ctrl/Cmd + S` - Save entry
  - `Ctrl/Cmd + F` - Focus search
  - `Escape` - Close modals
- **Date Navigation:** Jump to specific dates or filter by Last 7 Days, This Month, or custom ranges
- **Writing Streak:** Track your daily journaling consistency with a visible streak counter

### 🔒 Privacy & Data
- **100% Local Storage:** All journal entries stored in browser localStorage — nothing leaves your device
- **Export Functionality:** Download your entire journal as JSON for backup or migration
- **No Account Required:** Start journaling immediately with zero signup friction
- **Offline Capable:** Progressive Web App (PWA) with service worker for offline access

### 🎯 Customization
- **Font Size Control:** Small, Medium, Large options for comfortable reading
- **Theme Selection:** Light, Dark, or System-based theme switching
- **AI Tone Settings:** Choose between Warm & Empathetic, Clinical & Analytical, Poetic & Metaphorical, or Direct & Concise
- **Seed Data:** 20 pre-populated sample entries to explore features immediately

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Version 18 or higher ([Download](https://nodejs.org/))
- **npm:** Version 8 or higher (comes with Node.js)
- **Google Gemini API Key:** Free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/darshil0/ZenJournal-AI.git
   cd ZenJournal-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   **Important:** Replace `your_actual_api_key_here` with your actual Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   The production build will be in the `dist/` directory.

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes | `undefined` |
| `VITE_BASE_PATH` | Base path for deployment (e.g., `/ZenJournal-AI/`) | No | `/` |

---

## 📂 Project Structure

```
ZenJournal-AI/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment workflow
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker for offline support
├── src/
│   ├── data/
│   │   └── seedEntries.ts       # Sample journal entries for demo
│   ├── services/
│   │   └── ai.ts                # Google Gemini API integration
│   ├── App.tsx                  # Main application component
│   ├── types.ts                 # TypeScript interfaces and types
│   ├── index.css                # Global styles and Tailwind config
│   └── main.tsx                 # React entry point
├── .env.example                 # Environment variable template
├── .gitignore                   # Git ignore rules
├── CHANGELOG.md                 # Version history and changes
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── README.md                    # Project documentation (this file)
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite build configuration
```

---

## 🛠 Tech Stack

### Frontend Framework
- **[React 19](https://react.dev/)** - Modern UI library with concurrent features
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 6](https://vitejs.dev/)** - Lightning-fast build tool and dev server

### UI & Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon set

### Rich Text Editing
- **[Tiptap 3](https://tiptap.dev/)** - Headless editor framework
- **[ProseMirror](https://prosemirror.net/)** - Core editing engine
- **Extensions:** StarterKit, Placeholder, Underline, TaskList, TaskItem, Image, Link

### AI Integration
- **[Google Gemini API](https://ai.google.dev/)** - Gemini 2.0 Flash for AI insights
- **[@google/genai](https://www.npmjs.com/package/@google/genai)** - Official Gemini SDK

### Utilities
- **[date-fns](https://date-fns.org/)** - Modern date utility library

### Development Tools
- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript linting
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Vendor prefix automation

---

## 🎨 Key Features Deep Dive

### AI Insights Architecture

ZenJournal uses Google Gemini 2.0 Flash to generate structured JSON insights:

```typescript
interface AIInsight {
  date: string;
  mood_score: number;           // 1-10 scale
  mood_label: string;            // e.g., "Calm", "Anxious"
  key_themes: string[];          // Extracted themes
  entry_summary: string;         // One-sentence summary
  insight_of_the_day: string;    // Key takeaway
  reflection: string;            // Full paragraph analysis
  follow_up_prompt: string;      // Gentle question for deeper reflection
  word_count: number;
  session_duration_mins: number;
}
```

**Token Optimization:**
- HTML is stripped to plain text before sending to API
- Entry content is truncated to 500 characters for summaries
- History and previous insights are excluded from payloads
- Reduces token usage by ~70% compared to sending raw HTML

### Advanced Search Syntax

ZenJournal supports powerful search operators:

| Syntax | Example | Description |
|--------|---------|-------------|
| `"exact phrase"` | `"feeling anxious"` | Match exact phrase |
| `-word` | `-work` | Exclude entries containing "work" |
| `#tag` | `#gratitude` | Include entries tagged "gratitude" |
| `-#tag` | `-#stress` | Exclude entries tagged "stress" |
| Multiple terms | `meditation calm` | Fuzzy match for "meditation" AND "calm" |

**Fuzzy Matching:** Search uses character-sequence matching, so `medittn` will match "meditation".

### Data Persistence

All data is stored in browser `localStorage` under two keys:

1. **`zenjournal_entries`** - Array of journal entries with full history
2. **`zenjournal_settings`** - User preferences (theme, font size, AI tone)

**Auto-save Mechanism:**
- Debounced save with 1-second delay
- Prevents race conditions during rapid entry switching
- Captured entry ID at debounce start ensures correct target

**Version History:**
- Auto-snapshots every 60 seconds when content changes
- Stores up to 10 previous versions per entry
- One-click rollback to any previous version

---

## 🚢 Deployment

### GitHub Pages Deployment (Automated)

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1. **Fork or clone this repository**

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: **GitHub Actions**
   - Branch: **main**

3. **Add your Gemini API key as a repository secret**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your actual API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Push to main branch**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

5. **GitHub Actions will automatically:**
   - Install dependencies
   - Build the project with correct base path
   - Deploy to GitHub Pages

6. **Access your deployed app**
   - URL: `https://[your-username].github.io/ZenJournal-AI/`
   - Deployment typically takes 2-3 minutes

### Manual Deployment

For other hosting platforms (Vercel, Netlify, etc.):

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting platform

3. **Configure environment variables** on your hosting platform:
   - `GEMINI_API_KEY` - Your Gemini API key

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🔧 Configuration

### Vite Configuration

The `vite.config.ts` handles:
- Base path configuration for GitHub Pages subdirectory deployment
- Environment variable injection (`GEMINI_API_KEY`)
- React plugin and Tailwind CSS integration
- HMR (Hot Module Replacement) settings

### Service Worker

Progressive Web App features are provided by `public/sw.js`:
- Offline asset caching
- Dynamic base path detection for deployment flexibility
- Cache-first strategy for faster load times

### TypeScript Configuration

`tsconfig.json` is configured for:
- ES2022 target for modern JavaScript features
- React JSX support
- Strict type checking disabled for flexibility
- Module bundler resolution

---

## 🎯 Usage Guide

### Creating Your First Entry

1. Click the **+ (Plus)** button in the sidebar or press `Ctrl/Cmd + N`
2. Select your current mood from the mood buttons
3. Give your entry a title (or leave as "Untitled Reflection")
4. Start writing in the rich text editor
5. Add tags by typing in the tag input and pressing Enter
6. Click **Save Entry** or press `Ctrl/Cmd + S`

### Getting AI Insights

1. Write at least a few sentences in your entry
2. Click **Get AI Insights** button in the header
3. Wait 2-3 seconds for analysis
4. Review:
   - Mood score (1-10) and label
   - Entry summary and key themes
   - Reflection paragraph
   - Follow-up prompt for deeper exploration
5. Click **Answer Reflection** to add the prompt to your entry

### Using the AI Companion

1. Click **Companion** button in the header
2. Share what's on your mind in the chat
3. The AI will respond with empathy and curiosity
4. Continue the conversation to process thoughts and emotions
5. Choose AI tone in Settings (Warm, Clinical, Poetic, or Direct)

### Generating Weekly Summaries

1. Journal for at least a few days
2. Click **Weekly Summary** or **Stats** button
3. View:
   - Average mood score
   - Session count
   - Top mood and trend (Improving/Stable/Declining)
   - Mood distribution chart
   - Recurring themes across entries

### Advanced Search Tips

**Find entries about "meditation" but not "morning":**
```
meditation -morning
```

**Find entries with exact phrase "feeling anxious" tagged with #work:**
```
"feeling anxious" #work
```

**Exclude all work-related entries:**
```
-#work
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Create new entry |
| `Ctrl/Cmd + S` | Save current entry |
| `Ctrl/Cmd + F` | Focus search bar |
| `Ctrl/Cmd + B` | Bold text |
| `Ctrl/Cmd + I` | Italic text |
| `Ctrl/Cmd + U` | Underline text |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Escape` | Close modals/overlays |

---

## 🐛 Troubleshooting

### AI Features Not Working

**Problem:** AI insights fail with "Failed to generate insights" error

**Solution:**
1. Verify your `GEMINI_API_KEY` is set correctly in `.env`
2. Check API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Ensure you have available quota (free tier: 15 requests/minute)
4. Check browser console for detailed error messages
5. Try with a shorter entry (AI has token limits)

### Blank Screen on GitHub Pages

**Problem:** Deployed site shows blank screen or 404 errors

**Solution:**
1. Verify `VITE_BASE_PATH` is set to `/ZenJournal-AI/` in GitHub Actions workflow
2. Check repository name matches the base path
3. Ensure GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions)
4. Hard refresh browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
5. Check GitHub Actions logs for build errors

### Data Not Persisting

**Problem:** Entries disappear after closing browser

**Solution:**
1. Check if browser is in incognito/private mode (localStorage is cleared on close)
2. Verify browser supports localStorage (all modern browsers do)
3. Check browser storage quota isn't exceeded (usually 5-10MB limit)
4. Try exporting data and importing in a fresh browser
5. Disable browser extensions that might block localStorage

### Service Worker Issues

**Problem:** App doesn't work offline or shows old cached version

**Solution:**
1. Unregister service worker in DevTools: Application → Service Workers → Unregister
2. Clear browser cache: `Ctrl+Shift+Delete` → Clear cached images and files
3. Hard refresh: `Ctrl+Shift+R`
4. Check `public/sw.js` cache version matches your deployment

### Performance Issues

**Problem:** App feels slow with large number of entries

**Solution:**
1. Export old entries and start fresh journal
2. Avoid entries longer than 10,000 words
3. Limit to ~500 total entries for optimal performance
4. Consider using Focus Mode to reduce UI overhead
5. Close browser tabs to free up memory

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check [existing issues](https://github.com/darshil0/ZenJournal-AI/issues) to avoid duplicates
2. Open a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser version and OS

### Suggesting Features

1. Open an issue with tag `enhancement`
2. Describe the feature and use case
3. Explain how it fits ZenJournal's philosophy (privacy-first, minimalist, mindful)

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Update documentation (README, CHANGELOG)
5. Commit with clear messages: `git commit -m "Add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request with detailed description

### Development Guidelines

- **Code Style:** Follow existing TypeScript/React patterns
- **Commits:** Use conventional commits (feat:, fix:, docs:, etc.)
- **Testing:** Test in Chrome, Firefox, Safari, and mobile browsers
- **Documentation:** Update README and CHANGELOG for user-facing changes
- **Privacy:** Never add features that require external data storage or tracking

---

## 📝 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Patent use allowed
- ✅ Private use allowed
- ⚠️ Must include copyright notice
- ⚠️ Must include license text
- ⚠️ Must state changes made

---

## 🙏 Acknowledgments

- **[Google Gemini](https://ai.google.dev/)** - Powering the AI insights and companion features
- **[Tiptap](https://tiptap.dev/)** - Incredible headless rich text editor
- **[Tailwind CSS](https://tailwindcss.com/)** - Beautiful, utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth, performant animations
- **[Lucide](https://lucide.dev/)** - Clean, consistent icon library
- **[React](https://react.dev/)** - The foundation of modern web UIs

---

## 📧 Contact & Support

- **Author:** Darshil
- **GitHub:** [@darshil0](https://github.com/darshil0)
- **LinkedIn:** [darshil-qa-lead](https://linkedin.com/in/darshil-qa-lead)
- **Issues:** [GitHub Issues](https://github.com/darshil0/ZenJournal-AI/issues)

---

## 🗺️ Roadmap

### Planned Features (v1.2.0)
- [ ] **Data Encryption:** Optional password-protected journal encryption
- [ ] **Cloud Sync:** Optional encrypted cloud backup via Google Drive/Dropbox
- [ ] **Import Functionality:** Import journals from JSON, Markdown, or Day One
- [ ] **Custom Themes:** User-created color schemes and font combinations
- [ ] **Voice Journaling:** Speech-to-text entry creation
- [ ] **Habit Tracking:** Track daily habits alongside journal entries

### Under Consideration
- [ ] **Mobile Apps:** Native iOS and Android applications
- [ ] **Collaborative Journals:** Shared journals with partners or therapists
- [ ] **Advanced Analytics:** Sentiment analysis graphs and mood patterns over time
- [ ] **Meditation Timer:** Built-in timer for reflection sessions
- [ ] **Prompt Library:** Curated collection of journaling prompts by theme

### Community Requests
Have an idea? [Open an issue](https://github.com/darshil0/ZenJournal-AI/issues) with the `feature-request` label!

---

## 📊 Project Stats

- **Version:** 1.1.4
- **Total Commits:** 50+
- **Contributors:** 1
- **Stars:** Give us a ⭐ if you find this helpful!
- **License:** Apache-2.0
- **Last Updated:** April 18, 2026

---

## 🌟 Show Your Support

If ZenJournal AI helps you on your mindfulness journey:

1. **⭐ Star this repository** to show your appreciation
2. **🐛 Report bugs** to help improve the app
3. **💡 Suggest features** to shape the roadmap
4. **📣 Share** with friends who journal
5. **🤝 Contribute** code, docs, or ideas

---

<div align="center">

**Made with ❤️ for mindful reflection**

[Live Demo](https://darshil0.github.io/ZenJournal-AI/) • [Report Bug](https://github.com/darshil0/ZenJournal-AI/issues) • [Request Feature](https://github.com/darshil0/ZenJournal-AI/issues)

</div>
