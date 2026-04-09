# ZenJournal AI

A minimalist, privacy-first AI journaling app for daily reflections and personalized insights powered by Google Gemini AI.

## 🌿 Vision

ZenJournal AI is designed to be a sanctuary for your thoughts. It combines the simplicity of a traditional journal with the power of modern AI to help you uncover patterns, process emotions, and cultivate mindfulness — all while keeping your data completely private and under your control.

## ✨ Features

### Writing & Expression
- **Mindful Writing Environment:** A clean, distraction-free editor with support for rich text formatting
- **Rich Text Editor:** Bold, italic, underline, links, images, lists (bullet and numbered), and task lists
- **Image Support:** Drag-and-drop image insertion directly into entries
- **Focus Mode:** Hide all distractions and immerse yourself in pure writing
- **Auto-save:** Debounced saving prevents lag while you write

### AI-Powered Insights
- **Instant Reflections:** Get AI-generated insights with every entry including:
  - Mood score (1-10) with mood label detection
  - Key themes and patterns in your writing
  - One-sentence summary of your entry
  - Daily insight and deeper reflection
  - Follow-up prompts to encourage deeper exploration
  - Word count and session duration tracking
- **Answer Reflection:** Directly respond to AI follow-up prompts within your entry
- **Copy Insights:** Export AI analysis as JSON for external use

### Emotional Intelligence
- **Mood Tracking:** Select your mood from 9 emotional states (Joyful, Calm, Anxious, Sad, Angry, Confused, Numb, Grateful, Overwhelmed)
- **Weekly Summaries:** Visualize your emotional trends and recurring themes over time:
  - Average mood score
  - Session count
  - Top mood of the week
  - Overall trend (Improving, Stable, Declining, Starting)
  - Mood distribution breakdown
  - Recurring themes identified across entries
- **Streak Tracking:** Build and maintain a journaling streak to encourage consistency

### AI Companion Mode
- **Chat Companion:** A warm, non-judgmental AI companion to help you process thoughts:
  - Emotionally intelligent responses
  - Active listening and reflection
  - Mood-adaptive conversations
  - Session-based chat with full message history
  - Real-time error handling with graceful fallbacks

### Organization & Discovery
- **Smart Search:** Search through your entire journal history by title and content
- **Tag System:** Create custom tags for entries and filter by multiple tags simultaneously
- **Date Navigation:** Jump to specific dates using an integrated calendar picker
- **Date Range Filtering:** View entries from "Last 7 Days" or "This Month"
- **Sidebar Organization:** Well-organized entry list with metadata (date, mood emoji, AI insight indicator)

### Data Management
- **Privacy First:** All entries are stored locally in your browser using localStorage
- **No Cloud Sync:** Your data never leaves your device unless you explicitly export it
- **Export Functionality:** Download your entire journal as a JSON file for backup or external analysis
- **Local Storage Persistence:** Entries are automatically saved to browser storage

### Customization
- **Settings Panel:** Personalize font size, theme, and auto-save preferences
- **Dark Mode Ready:** Theme-aware styling (Light, Dark, or System default)
- **Responsive Design:** Fully responsive on mobile, tablet, and desktop
- **Sidebar Toggle:** Hide/show sidebar to maximize editor space

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS 4.1 |
| **Rich Text Editor** | Tiptap 3.20 |
| **Animations** | Framer Motion 12.23 |
| **AI Integration** | Google Gemini API (@google/genai 1.29) |
| **Icons** | Lucide React 0.546 |
| **Date Handling** | date-fns 4.1 |
| **Server** | Express 4.21 |
| **Package Manager** | npm |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Google Gemini API key (get one free at [AI Studio](https://aistudio.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zenjournal-ai.git
   cd zenjournal-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```
zenjournal-ai/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles and Tailwind config
│   ├── types.ts                # TypeScript interfaces
│   ├── services/
│   │   └── ai.ts              # Google Gemini API integration
│   └── data/
│       └── seedEntries.ts     # Sample data (20 entries) for exploration
├── public/
│   └── index.html             # HTML entry point
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── CHANGELOG.md               # Version history
└── LICENSE                    # Apache 2.0 License

```

## 🔐 Privacy & Security

### Data Storage
- **Browser-Local Only:** All journal entries are stored exclusively in your browser's localStorage
- **No Server Transmission:** Your entries never leave your device unless you explicitly export them
- **Export-Only Cloud:** Only exported JSON files would be stored externally (you control this)
- **Clearable Data:** You can clear all data at any time through browser settings

### API Usage
- **Gemini API Keys:** Your API key is required only for AI features (insights, chat, summaries)
- **Minimal Data Transmission:** Only selected entry text is sent to Gemini for analysis
- **Session-Based:** No persistent data is stored in external services
- **Error Handling:** Graceful failures if API key is missing or API calls fail

### Best Practices
1. **Secure Your API Key:** Never commit `.env` to version control
2. **Regular Backups:** Export your journal regularly as JSON for backup
3. **Browser Cleanup:** Clear browser data if using a shared device
4. **API Key Rotation:** Regenerate your Gemini API key periodically

## 📖 Usage Guide

### Writing Your First Entry

1. **Create Entry:** Click the "+" button in the sidebar or the "New Entry" button in the empty state
2. **Set Mood:** Select your current emotional state from the mood selector
3. **Add Title:** Enter a reflection title in the title field
4. **Write Content:** Use the editor with rich text formatting tools
5. **Add Tags:** Press Enter or comma to add tags for organization
6. **Generate Insights:** Click "Get AI Insights" when you're done writing

### Using AI Features

#### Journal Insights
- Automatically analyzes your entry for mood, themes, and patterns
- Provides one-sentence summary and deeper reflection
- Generates a follow-up prompt to encourage continued reflection
- Click "Answer Reflection" to respond directly in your entry

#### AI Companion Chat
- Click "Companion" in the header to open the chat panel
- Type your thoughts and send messages
- AI responds with emotional intelligence and active listening
- Full conversation history maintained during session
- Closes when you close the panel

#### Weekly Summaries
- Click "Weekly Summary" or "Stats" button
- View mood trends for the past 7 days
- See mood distribution breakdown
- Identify recurring themes in your writing
- Useful for spotting patterns and emotional trends

### Organization Tips

**Using Tags Effectively:**
- Create consistent tag names for better filtering
- Use tags for contexts (e.g., "work", "health", "relationship")
- Combine multiple tags to narrow down entries

**Date Range Filtering:**
- "All Time" - View entire journal history
- "Last 7 Days" - Focus on recent reflections
- "This Month" - Monthly review and analysis
- Custom dates - Pick specific dates with calendar picker

**Search Tips:**
- Search is case-insensitive
- Searches both titles and content
- Results update in real-time
- Combine with tag filters for precise results

### Focus Mode

Click the maximize icon to enter Focus Mode:
- Hides sidebar completely
- Maximizes editor space
- Removes distractions
- Perfect for deep writing sessions
- Exit by clicking the minimize icon

## 🎨 Customization

### Appearance Settings

Access settings via the "Settings" button in the sidebar:

**Font Size Options:**
- Small - For compact view
- Medium - Default comfortable reading
- Large - Enhanced readability

**Theme Options:**
- Light - Bright, clean appearance
- Dark - Reduces eye strain in low light
- System - Matches your OS preference

### Data Export

Export your complete journal as JSON:
1. Click "Settings" button in sidebar
2. Click "Export Journal"
3. Download automatically saves as `zenjournal-export-[DATE].json`
4. Import later by reconstructing localStorage entries

## 🧪 Testing the App

### Seed Data

To quickly explore the app's features:
1. Click "Seed 20 Entries" button in sidebar
2. Loads 20 sample entries across different moods
3. Includes AI insights for each entry
4. Perfect for testing search, filters, and summaries

### Manual Testing Checklist

- [ ] Create and save a new entry
- [ ] Add mood to entry
- [ ] Test rich text formatting (bold, italic, lists)
- [ ] Add tags and filter by tags
- [ ] Test search functionality
- [ ] Generate AI insights
- [ ] Send message to AI Companion
- [ ] Generate weekly summary
- [ ] Test Focus Mode
- [ ] Test date range filtering
- [ ] Export journal as JSON
- [ ] Test on mobile/tablet

## 🐛 Error Handling

The app includes comprehensive error handling for:

- **Missing API Key:** Clear message prompts to set GEMINI_API_KEY
- **Chat Errors:** Graceful error message in chat panel
- **Summary Generation Failures:** Alert notification with retry prompt
- **API Timeouts:** Error messages with fallback defaults
- **Parse Errors:** Graceful handling of malformed API responses

## ⚡ Performance Optimizations

- **Debounced Saving:** Auto-save every 500ms prevents lag during typing
- **Memoized Computations:** Filtered entries and tags computed efficiently
- **Lazy Rendering:** Chat and summary panels only render when needed
- **Optimized Re-renders:** React.useMemo prevents unnecessary updates
- **Local Storage Only:** No network latency for entry access

## 📚 API Reference

### generateJournalInsight(content: string)
Analyzes a journal entry and returns AI insights.

**Response:**
```typescript
{
  date: string;
  mood_score: 1-10;
  mood_label: string;
  key_themes: string[];
  entry_summary: string;
  insight_of_the_day: string;
  reflection: string;
  follow_up_prompt: string;
  word_count: number;
  session_duration_mins: number;
}
```

### chatWithAI(messages: ChatMessage[])
Sends a message to the AI companion and returns response.

**Request:**
```typescript
[
  { id: string; role: 'user' | 'assistant'; content: string; timestamp: string; },
  ...
]
```

**Response:**
```typescript
string // AI companion response
```

### generateWeeklySummary(entries: JournalEntry[])
Generates a summary of the past 7 days of entries.

**Response:**
```typescript
{
  avgMood: number;
  sessionCount: number;
  topMood: string;
  trend: 'Improving' | 'Stable' | 'Declining' | 'Starting';
  moodDistribution: Record<string, number>;
  recurringThemes: string[];
}
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear commit messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Test features before submitting PR
- Update documentation as needed
- Ensure TypeScript types are complete
- Run `npm run lint` for type checking

## 📋 Roadmap

### Planned Features
- Cloud sync with encryption option
- Custom themes and color schemes
- Voice-to-text journaling
- PDF export with formatting
- Shared journals with permissions
- Mobile app version (React Native)
- Dark mode theme variations
- Entry templates for guided journaling
- Sentiment analysis charts
- Integration with calendar app

### Future Enhancements
- Advanced search with regex support
- Custom tag hierarchies
- Entry reminders and notifications
- Collaborative journaling
- Journaling prompts library
- Performance analytics
- Memory lane / year in review feature

## 🐛 Known Issues & Limitations

### Current Limitations
- No cloud backup (local storage only)
- Limited to browser storage capacity (~5-10MB)
- No collaborative features
- No voice input
- Summary generation limited to past 7 days

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

ZenJournal AI is open source and available under the Apache License 2.0. See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tiptap](https://tiptap.dev/) - Excellent rich text editor
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Google Gemini API](https://deepmind.google/technologies/gemini/) - AI capabilities
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## 📞 Support & Contact

For issues, questions, or feedback:

- **GitHub Issues:** [Open an issue](https://github.com/yourusername/zenjournal-ai/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/zenjournal-ai/discussions)
- **Email:** support@zenjournal.dev

## 💡 Tips for Better Journaling

1. **Be Consistent:** Write at the same time each day
2. **Be Honest:** Your journal is for you, be truthful
3. **Be Detailed:** More detail helps AI generate better insights
4. **Review Patterns:** Check your weekly summary for insights
5. **Use AI Prompts:** Answer the follow-up questions for depth
6. **Tag Consistently:** Use the same tags for better filtering
7. **Export Regularly:** Backup your journal weekly
8. **Reflect on Trends:** Look at mood patterns over time

---

**Version:** 1.1.1  
**Last Updated:** April 9, 2026  
**Status:** Production Ready

Made with 🌱 for mindful reflection.
