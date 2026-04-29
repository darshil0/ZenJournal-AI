/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Check,
  BookOpen,
  Clock,
  Save,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { JournalEntry, AIInsight, ChatMessage, WeeklySummary } from './types';
import { generateJournalInsight, chatWithAI, generateWeeklySummary, generatePersonalizedPrompt } from './services/ai';
import { SEED_ENTRIES } from './data/seedEntries';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EditorSection } from './components/EditorSection';
import { AIInsightView, WeeklySummaryOverlay } from './components/Insights';
import { ChatOverlay } from './components/ChatOverlay';
import { SettingsModal } from './components/SettingsModal';

// Utils & Constants
import { generateId } from './utils/helpers';
import { MOODS } from './constants/moods';

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    theme: 'system',
    autosave: true,
    aiTone: 'warm'
  });

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Summary State
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Personalized Prompt State
  const [dailyPrompt, setDailyPrompt] = useState<string>("");
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  // Ref for history dropdown to handle click-outside
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside handler for history dropdown
  useEffect(() => {
    if (!showHistory) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHistory]);

  const selectedIdRef = React.useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your thoughts...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const targetId = selectedIdRef.current;
      if (targetId) {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          setEntries(prev => prev.map(e => {
            if (e.id === targetId) {
              const now = new Date().toISOString();
              const history = e.history || [];

              const lastHistory = history[0];
              const shouldAddHistory = !lastHistory || (new Date(now).getTime() - new Date(lastHistory.timestamp).getTime() > 60000);

              const newHistory = shouldAddHistory
                ? [{ timestamp: now, content: e.content, title: e.title }, ...history].slice(0, 10)
                : history;

              return { ...e, content: html, updatedAt: now, history: newHistory };
            }
            return e;
          }));
        }, 1000);
      }
    },
  });

  const selectedEntry = useMemo(() => {
    return entries.find(e => e.id === selectedId);
  }, [entries, selectedId]);

  // Sync editor content when selected entry changes
  useEffect(() => {
    // Clear pending saves when switching entries
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (editor && selectedEntry) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedEntry.content) {
        editor.commands.setContent(selectedEntry.content, { emitUpdate: false });
      }
    }
  }, [selectedId, editor, selectedEntry?.content]);

  // Load entries from local storage
  useEffect(() => {
    const savedEntries = localStorage.getItem('zenjournal_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }

    const savedSettings = localStorage.getItem('zenjournal_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Save entries to local storage
  useEffect(() => {
    localStorage.setItem('zenjournal_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('zenjournal_settings', JSON.stringify(settings));

    const root = window.document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // Initial prompt generation
  useEffect(() => {
    if (entries.length > 0 && !dailyPrompt) {
      const generateInitialPrompt = async () => {
        setIsPromptLoading(true);
        const prompt = await generatePersonalizedPrompt(entries);
        setDailyPrompt(prompt);
        setIsPromptLoading(false);
      };
      generateInitialPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach(e => e.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const parseSearchQuery = (query: string) => {
      const terms = {
        include: [] as string[],
        exclude: [] as string[],
        exact: [] as string[],
        excludeTags: [] as string[],
        includeTags: [] as string[],
      };

      let workingQuery = query;

      const exactMatches = workingQuery.match(/"([^"]+)"/g);
      if (exactMatches) {
        exactMatches.forEach(m => {
          terms.exact.push(m.replace(/"/g, '').toLowerCase());
          workingQuery = workingQuery.replace(m, '');
        });
      }

      const parts = workingQuery.split(/\s+/).filter(Boolean);
      parts.forEach(part => {
        if (part.startsWith('-#')) {
          terms.excludeTags.push(part.slice(2).toLowerCase());
        } else if (part.startsWith('-')) {
          terms.exclude.push(part.slice(1).toLowerCase());
        } else if (part.startsWith('#')) {
          terms.includeTags.push(part.slice(1).toLowerCase());
        } else {
          terms.include.push(part.toLowerCase());
        }
      });

      return terms;
    };

    const searchTerms = parseSearchQuery(searchQuery);

    const fuzzyMatch = (text: string, query: string) => {
      text = text.toLowerCase();
      query = query.toLowerCase();
      if (text.includes(query)) return true;

      let i = 0;
      let j = 0;
      while (i < text.length && j < query.length) {
        if (text[i] === query[j]) j++;
        i++;
      }
      return j === query.length;
    };

    return entries
      .filter(e => {
        const contentText = e.content.replace(/<[^>]*>/g, ' ');
        const fullContent = (e.title + ' ' + contentText).toLowerCase();
        
        const matchesExact = searchTerms.exact.every(phrase => fullContent.includes(phrase));
        const matchesInclude = searchTerms.include.every(word => fuzzyMatch(fullContent, word));
        const matchesExclude = searchTerms.exclude.length === 0 || !searchTerms.exclude.some(word => fullContent.includes(word));
        const matchesIncludeTagsSearch = searchTerms.includeTags.every(tag => e.tags.includes(tag));
        const matchesExcludeTags = searchTerms.excludeTags.length === 0 || !searchTerms.excludeTags.some(tag => e.tags.includes(tag));
        
        const matchesSearch = matchesExact && matchesInclude && matchesExclude && matchesIncludeTagsSearch && matchesExcludeTags;
        const matchesTag = selectedTags.length === 0 || selectedTags.every(tag => e.tags.includes(tag));
        
        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
          const entryDate = new Date(e.journaledAt);
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          matchesDate = entryDate >= start && entryDate <= end;
        }
        
        return matchesSearch && matchesTag && matchesDate;
      })
      .sort((a, b) => new Date(b.journaledAt).getTime() - new Date(a.journaledAt).getTime());
  }, [entries, searchQuery, selectedTags, dateRange]);

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;

    const dates = entries
      .map(e => new Date(e.journaledAt).toLocaleDateString('en-CA'))
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b.localeCompare(a));

    const today = new Date().toLocaleDateString('en-CA');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

    if (dates[0] !== today && dates[0] !== yesterday) return 0;

    let currentStreak = 0;
    const checkDate = new Date(dates[0]);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = checkDate.toLocaleDateString('en-CA');
      if (dates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [entries]);

  const createNewEntry = useCallback(() => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      journaledAt: now,
      title: 'Untitled Reflection',
      content: '',
      tags: []
    };
    setEntries(prev => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      setSelectedId(prev => prev === id ? null : prev);
    }
  }, []);

  const handleSave = useCallback(() => {
    const currentId = selectedIdRef.current;
    if (!currentId || !editor) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setIsSaving(true);
    const html = editor.getHTML();

    setEntries(prev => prev.map(e => {
      if (e.id === currentId) {
        const now = new Date().toISOString();
        const history = e.history || [];
        const lastHistory = history[0];
        const shouldAddHistory = !lastHistory || (new Date(now).getTime() - new Date(lastHistory.timestamp).getTime() > 60000);
        const newHistory = shouldAddHistory
          ? [{ timestamp: now, content: e.content, title: e.title }, ...history].slice(0, 10)
          : history;
        return { ...e, content: html, updatedAt: now, history: newHistory };
      }
      return e;
    }));

    setTimeout(() => setIsSaving(false), 1000);
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewEntry();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search reflections..."]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === 'Escape') {
        setShowSettings(false);
        setIsChatOpen(false);
        setIsSummaryOpen(false);
        setShowHistory(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNewEntry, handleSave]);

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `zenjournal-export-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2000);
  };

  const handleSeedData = () => {
    setEntries(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      const newEntries = SEED_ENTRIES.filter(e => !existingIds.has(e.id));
      return [...newEntries, ...prev];
    });
    if (SEED_ENTRIES.length > 0) {
      setSelectedId(SEED_ENTRIES[0].id);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithAI([...chatMessages, userMessage], settings.aiTone);
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setIsSummaryOpen(true);
    try {
      const summary = await generateWeeklySummary(entries);
      setWeeklySummary(summary);
    } catch (error) {
      console.error("Summary error", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    const contentText = editor?.getText() || '';
    if (!selectedEntry || !contentText.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const insight = await generateJournalInsight(selectedEntry.content);
      updateEntry(selectedEntry.id, { insight: JSON.stringify(insight) });
    } catch (error) {
      console.error(error);
      alert("Failed to generate insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (tag && selectedEntry && !selectedEntry.tags.includes(tag)) {
        updateEntry(selectedEntry.id, { tags: [...selectedEntry.tags, tag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (selectedEntry) {
      updateEntry(selectedEntry.id, { 
        tags: selectedEntry.tags.filter(t => t !== tagToRemove) 
      });
    }
  };

  const parsedInsight = useMemo(() => {
    if (!selectedEntry?.insight) return null;
    try {
      return JSON.parse(selectedEntry.insight) as AIInsight;
    } catch {
      return null;
    }
  }, [selectedEntry]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cleanup pending saves on unmount or before switching
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleAnswerReflection = (prompt: string) => {
    if (editor) {
      const currentContent = editor.getHTML();
      editor.commands.setContent(currentContent + `<p><br/></p><p><strong>Reflecting on:</strong> ${prompt}</p><p><em>[Add your details here...]</em></p>`);
      editor.commands.focus();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans relative">
      <Sidebar
        isFocusMode={isFocusMode}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        setIsSidebarOpen={setIsSidebarOpen}
        streak={streak}
        createNewEntry={createNewEntry}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setDateRange={setDateRange}
        dateRange={dateRange}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        allTags={allTags}
        filteredEntries={filteredEntries}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setShowSettings={setShowSettings}
        handleSeedData={handleSeedData}
        handleGenerateSummary={handleGenerateSummary}
        isSummaryLoading={isSummaryLoading}
      />

      <main className="flex-1 flex flex-col bg-white dark:bg-[#121212] relative overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedEntry={selectedEntry}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
          setIsChatOpen={setIsChatOpen}
          handleGenerateSummary={handleGenerateSummary}
          isSummaryLoading={isSummaryLoading}
          handleSave={handleSave}
          isSaving={isSaving}
          handleGenerateInsight={handleGenerateInsight}
          isGenerating={isGenerating}
          deleteEntry={deleteEntry}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            {selectedEntry ? (
              <div className="space-y-8">
                <EditorSection
                  selectedEntry={selectedEntry}
                  updateEntry={updateEntry}
                  showHistory={showHistory}
                  setShowHistory={setShowHistory}
                  historyDropdownRef={historyDropdownRef}
                  editor={editor}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  handleAddTag={handleAddTag}
                  removeTag={removeTag}
                  setLink={setLink}
                  addImage={addImage}
                />

                <AIInsightView
                  isFocusMode={isFocusMode}
                  parsedInsight={parsedInsight}
                  selectedEntryInsight={selectedEntry.insight}
                  handleCopyPrompt={handleCopyPrompt}
                  copied={copied}
                  showJsonPreview={showJsonPreview}
                  setShowJsonPreview={setShowJsonPreview}
                  onAnswerReflection={handleAnswerReflection}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                <div className="space-y-4 opacity-40">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold dark:text-white">Select a reflection</h2>
                    <p className="text-gray-500">Choose an entry from the sidebar or create a new one to start journaling.</p>
                  </div>
                  <button
                    onClick={createNewEntry}
                    className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    New Entry
                  </button>
                </div>

                {dailyPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md p-8 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 relative group"
                  >
                    <div className="absolute -top-3 left-8 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                      Personalized Prompt
                    </div>
                    <p className="text-emerald-900 dark:text-emerald-400 text-lg serif italic leading-relaxed">
                      "{dailyPrompt}"
                    </p>
                    <button
                      onClick={async () => {
                        setIsPromptLoading(true);
                        const prompt = await generatePersonalizedPrompt(entries);
                        setDailyPrompt(prompt);
                        setIsPromptLoading(false);
                      }}
                      disabled={isPromptLoading}
                      className="mt-6 text-[10px] font-bold text-emerald-600/60 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
                    >
                      {isPromptLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      New Prompt
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedEntry && (
          <footer className="h-10 border-t border-black/5 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm text-[10px] text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedEntry.content.split(/\s+/).filter(Boolean).length} words
              </span>
              <span>
                Last saved: {new Date(selectedEntry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-bold">
              <Save className="w-3 h-3" />
              Private & Local
            </div>
          </footer>
        )}
      </main>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-emerald-600 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <ChatOverlay
        isFocusMode={isFocusMode}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendMessage={handleSendMessage}
        isChatLoading={isChatLoading}
      />

      <WeeklySummaryOverlay
        isSummaryOpen={isSummaryOpen}
        setIsSummaryOpen={setIsSummaryOpen}
        isSummaryLoading={isSummaryLoading}
        weeklySummary={weeklySummary}
      />

      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settings={settings}
        setSettings={setSettings}
        handleExport={handleExport}
      />
    </div>
  );
}
