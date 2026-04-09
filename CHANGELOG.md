# Changelog

All notable changes to ZenJournal AI will be documented in this file.

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
