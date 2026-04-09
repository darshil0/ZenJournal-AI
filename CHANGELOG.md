# Changelog

All notable changes to ZenJournal AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.1] - 2026-04-09

### Fixed
- **Critical:** Fixed GitHub Pages auto-deployment and CI/CD pipeline issues
- **Critical:** Removed duplicate toolbar buttons (Bold, Italic, Bullet List) in editor
- **Critical:** Incomplete chat error handling - Added try-catch wrapper with user-friendly error messages
- **High:** Missing summary generation error handling - Added comprehensive try-catch with finally block
- **High:** Improper API message formatting in `chatWithAI()` function - Added validation and error handling
- **High:** Vite config comment encoding issue (special character artifact) - Fixed to proper Unicode
- **Medium:** Missing environment variable validation - Added GEMINI_API_KEY checks in all API functions
- **Medium:** Weekly summary was analyzing all entries instead of just past 7 days - Added date filtering logic
- **Low:** Unused icon imports (`MoreVertical`, `User`) - Removed for cleaner bundle

### Added
- Graceful error messages for API failures in chat interface
- Descriptive error messages for missing API key configuration
- Try-catch blocks in `handleSendMessage()` function
- Try-catch blocks in `handleGenerateSummary()` function
- Try-catch blocks in `handleGenerateInsight()` function
- API key validation at start of `generateJournalInsight()` function
- API key validation at start of `chatWithAI()` function
- API key validation at start of `generateWeeklySummary()` function
- Last message validation in `chatWithAI()` before sending
- 7-day filtering logic for weekly summary generation
- Default summary response for weeks with no entries

### Changed
- Editor toolbar simplified - single organized toolbar instead of duplicated sections
- Chat error handling now displays user-friendly error message in chat panel instead of crashing
- Summary loading state now properly clears even if generation fails
- Weekly summary now only analyzes entries from the past 7 days (was analyzing all entries)
- API functions now throw descriptive errors when GEMINI_API_KEY is missing

### Improved
- Code quality and maintainability
- Type safety in API service functions
- User experience during API failures
- Error messages clarity and usefulness
- Code organization by removing duplicates

### Testing
- Manual testing performed for all error scenarios
- Chat error handling verified
- Summary generation with no entries tested
- API key validation tested
- 7-day filtering verification completed

---

## [1.1.0] - 2026-04-09

### Added
- **Focus Mode:** Distraction-free writing environment that hides sidebars and AI insights
- **Jump to Date:** Calendar-based navigation tool to quickly find entries by date
- **Image Drag & Drop:** Support for dragging images directly into the editor
- **Settings Modal:** New interface for personalizing font size, theme, and managing data exports
- **Export Functionality:** Ability to download the entire journal as a JSON file
- **Metadata Fields:** Added `createdAt`, `updatedAt`, and `journaledAt` timestamps to all entries
- **Formatting Tools:** Expanded editor toolbar with Underline, Task Lists, Links, and Image support
- **Seed Data:** Added "Seed 20 Entries" feature to help new users explore the app
- **Weekly Summary Generation:** AI-powered weekly reflections with mood trends and recurring themes

### Changed
- **Performance:** Implemented debounced saving to reduce lag in long entries
- **UI/UX:** Refined sidebar layout with improved filtering options (Last 7 Days, This Month)
- **AI Integration:** Enhanced AI insights with "Answer Reflection" functionality to directly respond to prompts
- **Streak Logic:** Improved streak calculation to handle timezones and missing days more accurately
- **Editor Experience:** Better visual feedback for active formatting options

### Fixed
- **Cursor Jump Issue:** Resolved the problem where the cursor would jump to the end of the editor during updates
- **Search Reliability:** Fixed search filtering to correctly match titles and content
- **Responsive Design:** Improved sidebar behavior on smaller screens
- **Task List Styling:** Corrected visual appearance of task lists in dark themes
- **Link Handling:** Improved URL validation and link insertion

### Performance
- Added debounced auto-save (500ms) to prevent UI lag
- Optimized entry filtering with React.useMemo
- Improved re-render performance with proper memoization
- Lazy-loaded AI components for faster initial load

### Security
- All entries remain local-only in browser storage
- No external transmission of entry data unless explicitly exported
- API key validation prevents silent failures

---

## [1.0.0] - 2026-03-13

### Added
- Initial release of ZenJournal AI
- Basic rich text editing with Tiptap integration
- AI-generated insights using Google Gemini API
- Mood tracking with 9 emotional states
- Local storage persistence for all entries
- Weekly summary generation with mood analysis
- Basic tag and search system
- Entry metadata (created, updated, journaled timestamps)
- Responsive design for mobile and desktop
- Dark theme support with system detection
- Settings panel with export functionality

### Features in v1.0
- **Rich Text Editor:** Support for bold, italic, bullet lists, numbered lists
- **Mood Tracking:** Quick mood selection from 9 predefined emotions
- **AI Insights:** Automatic analysis with mood scores and themes
- **Search & Filter:** Find entries by text content or tags
- **Weekly Summary:** Visual breakdown of mood trends
- **Privacy First:** All data stored locally in browser
- **Responsive UI:** Works on desktop, tablet, and mobile
- **Export:** Download all entries as JSON for backup

---

## [Unreleased]

### Planned Features
- Cloud sync with end-to-end encryption option
- Custom theme builder with color palette selection
- Voice-to-text journaling input
- PDF export with styling and formatting
- Collaborative journaling with permission controls
- Mobile app (React Native)
- Advanced mood analytics with sentiment analysis
- Entry templates for guided journaling
- Calendar view of all journaling sessions
- Integration with calendar apps
- Journaling prompt suggestions
- Year-in-review retrospectives
- Memory lane random entry picker
- Habit tracking integration
- Export to multiple formats (PDF, Word, ePub)

### Roadmap Features
- **Q2 2026:**
  - Cloud backup feature (optional)
  - Entry templates system
  - Advanced search with regex
  
- **Q3 2026:**
  - Mobile application
  - Voice input support
  - PDF export
  
- **Q4 2026:**
  - Collaborative features
  - Advanced analytics dashboard
  - Custom prompts library

---

## Release Process

This project follows Semantic Versioning:
- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes

### How to Report Issues

Found a bug? Please create a GitHub issue with:
1. Clear description of the problem
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser and OS information
6. Screenshots if applicable

### How to Suggest Features

Have an idea? Please create a GitHub discussion with:
1. Clear title and description
2. Motivation and use case
3. Examples of similar features
4. Any concerns or limitations

---

## Deprecations

### v1.1.0 Deprecations
- None

### v1.1.1 Notes
- No breaking changes
- All existing features remain backward compatible
- Database format unchanged

---

## Migration Guides

### Upgrading from v1.0.0 to v1.1.0
No data migration needed. All existing entries will work as before.

New features available:
- Focus Mode activated via maximize icon in header
- Jump to Date with calendar picker
- Settings panel for customization
- Export functionality in settings

### Upgrading from v1.1.0 to v1.1.1
No user action required. Bug fixes are transparent.

Improvements:
- Better error messages when API calls fail
- Proper chat error handling
- Fixed weekly summary to show only 7-day data

---

## Contributors

This project is maintained by the ZenJournal AI team.

### Contributing
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Support

For issues, questions, or feedback:
- **GitHub Issues:** Report bugs and request features
- **GitHub Discussions:** Ask questions and share ideas
- **Email:** support@zenjournal.dev

---

## License

ZenJournal AI is open source under the Apache License 2.0.

---

## Version History Summary

| Version | Date | Type | Notes |
|---------|------|------|-------|
| 1.1.1 | 2026-04-09 | Patch | Bug fixes and error handling improvements |
| 1.1.0 | 2026-04-09 | Minor | New features: Focus Mode, Export, Weekly Summaries |
| 1.0.0 | 2026-03-13 | Major | Initial public release |

---

## Changelog Categories

Each release is organized by:
- **Added** - New features and functionality
- **Changed** - Changes to existing features
- **Deprecated** - Features marked for removal
- **Removed** - Features that were removed
- **Fixed** - Bug fixes
- **Security** - Security improvements
- **Performance** - Performance improvements

---

**Last Updated:** April 9, 2026

Made with 🌱 for mindful reflection.
