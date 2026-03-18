# Changelog

All notable changes to ZenJournal AI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-03-18

### Added
- **Mood-Driven UI Themes** — the editor's appearance now dynamically adapts to the selected mood, with custom border colors and subtle background tints (e.g., orange for Joyful, emerald for Calm, rose for Overwhelmed).
- **Full Dark Mode Support** — implemented comprehensive dark mode using Tailwind `dark:` variants across all components, including modals, sidebars, and the rich-text editor.
- **Settings Persistence** — user preferences for font size and theme are now saved to `localStorage` and persist across sessions.
- **Accessibility Enhancements** — added ARIA labels to all icon-only buttons (New Entry, Settings, Sidebar toggle) and ensured all settings inputs have associated semantic `<label>` elements.
- **Improved AI Service Reliability** — integrated `responseSchema` into Gemini API calls for structured outputs, ensuring consistent and valid JSON responses from the model.
- **Automated Verification Suite** — added a Playwright-based visual regression and functional verification script for search, themes, and UI states.
- **Technical Documentation** — authored `Skills.MD` documenting architectural decisions and `FEATURES.md` with a future product roadmap.

### Fixed
- **Search accuracy** — search now ignores HTML tags (e.g., `<p>`, `<strong>`) within the journal content, preventing markup from triggering false positives or cluttering search results.
- **"Last 7 Days" filter** — corrected the date logic to include the full range of the last 7 calendar days including the current day.
- **Debounced Autosave** — implemented a more efficient 1-second debounced save to `localStorage` with a `useRef`-based cleanup to ensure the latest changes are flushed on unmount without redundant intermediate writes.
- **UI Error Handling** — replaced generic `alert()` calls with specific error feedback in the chat and modal states when AI services fail.
- **CSS Import Order** — resolved a build-time warning by moving `@import` statements to the top of `index.css`.

### Changed
- **Typography** — integrated Inter and Cormorant Garamond fonts for a more polished, "journal-like" aesthetic.

---

## [1.0.1] — 2026-03-13

### Fixed

- **Wrong AI model name** — replaced the non-existent `gemini-3-flash-preview` identifier with the correct `gemini-2.0-flash` model across all three AI service calls (insights, chat, summary).
- **Chat companion had no memory** — the companion chat was creating a fresh session on every message, losing all context. Previous messages are now passed as conversation `history` so the AI remembers the full session.
- **Weekly summary schema crash** — removed the unsupported `additionalProperties` field from the Gemini response schema for the mood distribution object, which was causing the summary generation to fail silently.
- **Duplicate toolbar buttons** — Bold, Italic, and Bullet List buttons were rendered twice in the rich-text editor toolbar. The duplicate block has been removed.
- **Word count included HTML tags** — the footer word counter and sidebar entry preview were counting raw HTML tags as words. Fixed by stripping tags with `.replace(/<[^>]*>/g, '')` before counting.
- **Unused imports causing lint warnings** — removed `MoreVertical` and `User` from the lucide-react import block in `App.tsx`.

### Added

- **GitHub Pages deployment workflow** — added `.github/workflows/deploy.yml` with a two-job build-and-deploy pipeline using the official GitHub Pages actions. The workflow injects `GEMINI_API_KEY` from repository secrets and sets `VITE_BASE_PATH` automatically from the repository name.
- **`VITE_BASE_PATH` support in Vite config** — the build base path is now configurable via environment variable, enabling correct asset routing when deployed to a GitHub Pages sub-path.
- **Extended ProseMirror styles** — added missing editor styles for `h1–h3`, `ol`, `li`, `blockquote`, `code`, `pre`, `a`, `img`, `hr`, and task-list checkboxes in `index.css`.

### Changed

- **App name** — renamed from the default AI Studio scaffold name (`react-example`) to **ZenJournal AI** across `package.json`, `index.html`, `metadata.json`, and the GitHub Actions workflow.
- **`package.json` name field** — updated from `react-example` to `zenjournal-ai` to match the product name convention.
- **`package.json` version** — bumped from `0.0.0` to `1.0.0` to mark the first named release.
- **`index.html` title** — updated from `My Google AI Studio App` to `ZenJournal AI`.
- **`index.html`** — added a `<meta name="description">` tag for better SEO and link previews.
- **README** — completely rewritten with feature overview, tech stack table, local setup instructions, GitHub Pages deployment guide, project structure, environment variable reference, and available scripts.

---

## [1.0.0] — 2026-03-10

### Added

- **Journal editor** — full rich-text editing via TipTap v3 with support for bold, italic, underline, ordered and unordered lists, task lists, links, and image embeds.
- **Mood picker** — nine mood states (Joyful, Calm, Anxious, Sad, Angry, Confused, Numb, Grateful, Overwhelmed) selectable per entry.
- **Tag system** — add and remove freeform tags per entry; filter the sidebar list by tag.
- **AI Insights** — powered by Gemini; generates a mood score (1–10), mood label, key themes, entry summary, insight of the day, reflection paragraph, and a follow-up journaling prompt.
- **AI Companion chat** — a side-panel conversational companion with adaptive prompts based on detected emotional state.
- **Weekly Summary modal** — aggregates entries to surface average mood score, session count, top mood, emotional trend, mood distribution bar chart, and recurring themes.
- **Streak tracker** — calculates and displays the current consecutive journaling day streak in the sidebar header.
- **Search and filter** — keyword search across entry titles and content; date range filters for All Time, Last 7 Days, and This Month.
- **Tag filter bar** — one-click filter by any tag that appears across entries.
- **Raw JSON preview** — expandable panel inside the AI Insights section showing the full structured JSON returned by the model.
- **Copy JSON button** — copies the raw AI insight JSON to the clipboard with a toast confirmation.
- **Answer Reflection shortcut** — appends the AI follow-up prompt directly into the editor with a single click.
- **Export** — downloads all entries as a formatted JSON file from the Settings modal.
- **Seed data** — a "Seed 20 Entries" button that loads pre-written sample journal entries covering a range of moods and themes for onboarding and testing.
- **Settings modal** — font size preference, theme selection (Light / Dark / System), and journal export.
- **Persistent storage** — all entries are saved to and loaded from `localStorage` automatically.
- **Responsive sidebar** — collapsible sidebar with animated open/close transition.
- **Footer word count** — live word count for the active entry displayed in the editor footer.
- **Timestamps** — created-at and updated-at timestamps shown in the editor header for the active entry.
