# Changelog

All notable changes to ZenJournal AI will be documented in this file.
 
## [1.1.2] - 2026-04-17
 
### Fixed
- **CI/CD Pipeline (`.github/workflows/deploy.yml`):** Added `VITE_BASE_PATH` and `GEMINI_API_KEY` to the build process. Correctly configured the workflow to handle sub-path deployments on GitHub Pages, enabled `cancel-in-progress`, and added `fetch-depth: 0` to the checkout step for improved metadata retrieval and build resilience.
- **Sub-path Hosting Compatibility (`index.html`, `public/sw.js`):** Converted absolute paths for `manifest.json`, `sw.js`, and the main script bundle to relative paths. This ensures the application loads correctly and the Service Worker caches the right assets when hosted in a sub-folder (like a GitHub repository page).

## [1.1.1] - 2026-04-17

### Fixed
- **AI Model Name (`src/services/ai.ts`):** Corrected invalid Gemini model identifier `"gemini-3-flash-preview"` to `"gemini-2.0-flash"` across all AI service calls (`generateJournalInsight`, `chatWithAI`, `generateWeeklySummary`, `generatePersonalizedPrompt`). The previous string caused all AI features to fail at runtime.
- **Duplicate Toolbar Buttons (`src/App.tsx`):** Removed redundant Bold, Italic, and Bullet List buttons that were rendered twice in the editor toolbar. The duplication caused visual clutter and confusing active-state behavior.
- **Stale Closures in Keyboard Shortcuts (`src/App.tsx`):** Refactored `createNewEntry`, `updateEntry`, `deleteEntry`, and `handleSave` into `useCallback` hooks. The `useEffect` registering keyboard shortcuts (`Ctrl+N`, `Ctrl+S`, `Escape`) now correctly lists these stable callbacks in its dependency array, preventing stale closure bugs where actions could silently operate on outdated state.
- **`handleSave` State Mutation (`src/App.tsx`):** Rewrote `handleSave` to use a functional state update pattern (`setEntries` with updater function) rather than closing over the `selectedEntry` memo value, ensuring it always saves against the current entry regardless of render timing.
- **History Dropdown Click-Outside (`src/App.tsx`):** Added a `useRef` + `mousedown` event listener to close the Version History dropdown when clicking outside of it. Previously, the dropdown could only be closed via the Escape key or by selecting a version.
- **`window.innerWidth` in Animation Props (`src/App.tsx`):** Replaced inline `window.innerWidth < 1024` calls inside `motion` component `initial`/`animate`/`exit` props with a reactive `isMobile` state variable backed by a `resize` event listener. The previous approach evaluated viewport width only once at initial render, causing incorrect sidebar slide-in direction after window resize.
- **Footer "Last Saved" Timestamp (`src/App.tsx`):** Changed footer timestamp source from `new Date()` (always showing current clock time) to `new Date(selectedEntry.updatedAt)` so it correctly reflects when the entry was last persisted.
- **AI Payload Bloat (`src/services/ai.ts`):** Stripped `history` arrays, raw `insight` JSON blobs, and full HTML content from entries before sending to `generatePersonalizedPrompt` and `generateWeeklySummary`. Entry content is now plain-text and capped at 500 characters per entry, significantly reducing token usage and preventing context-window errors on large journals.
- **Missing ProseMirror Styles (`src/index.css`):** Added CSS rules for heading levels (h1–h3), ordered lists, blockquotes, inline code, code blocks, links, images, horizontal rules, and task-list checkboxes. Previously, Tiptap extensions like `TaskList`, `Link`, and `Image` rendered without any styling.

## [1.1.0] - 2026-04-09

### Added
- **Advanced Search:** Support for complex queries including exact phrase matching (`"phrase"`), word exclusion (`-word`), tag inclusion (`#tag`), and tag exclusion (`-#tag`).
- **Tagging Enhancements:** Multi-tag filtering (AND logic), clickable tags in the entry list, and a "Clear all" button in the editor.
- **Entry Editing:** Full support for loading and updating existing entries directly from the sidebar.
- **Search Tips:** Added an info icon in the search bar that displays helpful search shortcuts on hover.
- **Focus Mode:** Introduced a distraction-free writing environment that hides sidebars and AI insights.
- **Jump to Date:** Added a calendar-based navigation tool to quickly find entries by date.
- **Image Drag & Drop:** Support for dragging images directly into the editor.
- **Settings Modal:** New interface for personalizing font size, theme, and managing data exports.
- **Export Functionality:** Ability to download the entire journal as a JSON file.
- **Metadata Fields:** Added `createdAt`, `updatedAt`, and `journaledAt` to all journal entries.
- **Formatting Tools:** Expanded editor toolbar with Underline, Task Lists, Links, and Image support.
- **Seed Data:** Added a "Seed 20 Entries" feature to help new users explore the app.

### Changed
- **Editor Sync:** Refined editor-to-entry synchronization using React refs to ensure reliable saving when switching entries.
- **Performance:** Implemented debounced saving to reduce lag in long entries.
- **UI/UX:** Refined sidebar layout with better filtering options (Last 7 Days, This Month).
- **AI Integration:** Enhanced AI insights with "Answer Reflection" functionality to directly respond to prompts.
- **Streak Logic:** Improved streak calculation to handle timezones and missing days more accurately.

### Fixed
- **Cursor Jump:** Resolved the issue where the cursor would jump to the end of the editor during updates.
- **Search Reliability:** Fixed search filtering to correctly match titles and content.
- **Responsive Design:** Improved sidebar behavior on smaller screens.

## [1.0.0] - 2026-03-13

### Added
- Initial release of ZenJournal AI.
- Basic rich text editing with Tiptap.
- AI-generated insights and mood tracking.
- Local storage persistence.
- Weekly summary generation.
- Basic tag and search system.
