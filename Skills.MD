# Skills & Learnings - ZenJournal AI

Building and refining ZenJournal AI provided deep insights into modern web development with React 19, Tailwind 4, and the latest Google Gemini 2.0 AI models.

## 1. AI Integration (Gemini 2.0 Flash)
- **Structured Outputs**: Leveraging `responseSchema` with `@google/genai` is crucial for reliable AI features. It forces the model to return valid JSON that conforms to TypeScript interfaces, significantly reducing parsing errors.
- **System Instructions**: Providing clear, persona-driven system instructions helps maintain a consistent tone (e.g., "ZenJournal AI — a warm, emotionally intelligent companion") across different AI endpoints (chat, insights, summary).
- **History Management**: Implementing conversational chat requires careful management of message history, mapping roles correctly between the application and the Gemini API.

## 2. Modern Styling (Tailwind CSS v4)
- **CSS-First Configuration**: Tailwind 4's shift towards `@theme` blocks and CSS variables makes configuration more intuitive and keeps styles closer to the standard CSS ecosystem.
- **Dark Mode Strategy**: Implementing a robust dark mode involves a combination of global body styles and specific `dark:` utility classes. Using a `.dark` class on the root element allows for easy synchronization with system preferences or manual user toggles.
- **Typography Integration**: Properly importing and applying custom serif (Cormorant Garamond) and sans-serif (Inter) fonts is essential for achieving a high-end "minimalist" aesthetic.

## 3. React 19 & Performance
- **Local-First Architecture**: Storing all user data in `localStorage` provides a private, zero-latency experience but requires careful synchronization.
- **Performance Optimization**: For data-heavy local-first apps, debouncing disk writes (like `localStorage.setItem`) is vital to prevent UI lag during intensive tasks like real-time rich-text editing.
- **Dynamic UI**: Using `useMemo` for complex filtering and sorting ensures the UI remains responsive even as the number of journal entries grows.

## 4. Accessibility & UX
- **ARIA Best Practices**: Adding descriptive `aria-label` attributes to icon-only buttons is a small but critical step for accessibility.
- **Robust Error Handling**: Moving from basic `alert()` calls to integrated UI error states (like custom toasts or in-modal error messages) significantly improves the professional feel and reliability of the app.
- **Privacy-First Design**: Clearly communicating that data is "Private & Local" builds user trust, especially in sensitive applications like journaling.
