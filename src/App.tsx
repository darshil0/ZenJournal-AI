/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag,
  X,
  Save,
  Copy,
  Check,
  Plus,
  Search,
  Calendar,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Settings,
  Loader2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  MessageCircle,
  BarChart3,
  Send,
  Bot,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { JournalEntry, AIInsight, ChatMessage, WeeklySummary } from './types';
import { generateJournalInsight, chatWithAI, generateWeeklySummary } from './services/ai';
import { SEED_ENTRIES } from './data/seedEntries';

const MOODS = [
  { label: 'Joyful', emoji: '😊', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { label: 'Calm', emoji: '😌', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Anxious', emoji: '😰', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { label: 'Sad', emoji: '😔', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Angry', emoji: '😠', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  { label: 'Confused', emoji: '😕', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { label: 'Numb', emoji: '😶', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
  { label: 'Grateful', emoji: '🙏', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Overwhelmed', emoji: '🤯', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
];

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Copied to clipboard');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    theme: 'system',
    autosave: true
  });

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Summary State
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Start writing your thoughts...' }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (selectedId) {
        setEntries(prev =>
          prev.map(e =>
            e.id === selectedId ? { ...e, content: html, updatedAt: new Date().toISOString() } : e
          )
        );
      }
    },
  });

  const selectedEntry = useMemo(
    () => entries.find(e => e.id === selectedId),
    [entries, selectedId]
  );

  // Sync editor content when selected entry changes without jumping the cursor
  useEffect(() => {
    if (editor && selectedEntry) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedEntry.content) {
        editor.commands.setContent(selectedEntry.content, { emitUpdate: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, editor]);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zenjournal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load entries', e);
      }
    }
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zenjournal_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, []);

  const entriesRef = React.useRef(entries);
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // Persist entries to localStorage with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('zenjournal_entries', JSON.stringify(entries));
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [entries]);

  // Flush changes on unmount
  useEffect(() => {
    return () => {
      localStorage.setItem('zenjournal_entries', JSON.stringify(entriesRef.current));
    };
  }, []);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('zenjournal_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach(e => e.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter(e => {
        const plainContent = e.content.replace(/<[^>]*>/g, '').toLowerCase();
        const matchesSearch =
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plainContent.includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || e.tags.includes(selectedTag);

        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
          const entryDate = new Date(e.journaledAt);
          matchesDate = isWithinInterval(entryDate, {
            start: startOfDay(dateRange.start),
            end: endOfDay(dateRange.end)
          });
        }

        return matchesSearch && matchesTag && matchesDate;
      })
      .sort((a, b) => new Date(b.journaledAt).getTime() - new Date(a.journaledAt).getTime());
  }, [entries, searchQuery, selectedTag, dateRange]);

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;

    const dates = entries
      .map(e => new Date(e.journaledAt).toLocaleDateString('en-CA'))
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b.localeCompare(a));

    const today = new Date().toLocaleDateString('en-CA');
    const yesterday = new Date(Date.now() - 86_400_000).toLocaleDateString('en-CA');

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

  const createNewEntry = () => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      journaledAt: now,
      title: 'Untitled Reflection',
      content: '',
      tags: []
    };
    setEntries(prev => [newEntry, ...prev]);
    setSelectedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    );
  };

  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleSave = () => {
    if (!selectedEntry) return;
    setIsSaving(true);
    updateEntry(selectedEntry.id, {});
    setTimeout(() => setIsSaving(false), 2000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `zenjournal-export-${new Date().toISOString().split('T')[0]}.json`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', exportFileName);
    link.click();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
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

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToastMessage('Copied to clipboard');
    setToastType('success');
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
      id: crypto.randomUUID(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);
    setChatError(null);

    try {
      const response = await chatWithAI(updatedMessages);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error', error);
      setChatError('Failed to send message. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setIsSummaryOpen(true);
    setSummaryError(null);
    try {
      const summary = await generateWeeklySummary(entries);
      setWeeklySummary(summary);
    } catch (error) {
      console.error('Summary error', error);
      setSummaryError('Failed to generate weekly summary. Please ensure you have enough entries.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!selectedEntry || !selectedEntry.content.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const insight = await generateJournalInsight(selectedEntry.content);
      updateEntry(selectedEntry.id, { insight: JSON.stringify(insight) });
    } catch (error) {
      console.error(error);
      alert('Failed to generate insights. Please try again.');
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

  return (
    <div className="flex h-screen overflow-hidden font-sans dark:bg-[#0C0C0C]">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border-r border-black/5 bg-[#F7F5F2] dark:bg-[#161616] dark:border-white/5 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2 dark:text-white">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  ZenJournal AI
                </h1>
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      {streak} Day Streak
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={createNewEntry}
                className="p-2 bg-white dark:bg-[#2A2A2A] dark:text-emerald-500 rounded-full shadow-sm hover:shadow-md transition-all border border-black/5 dark:border-white/10 text-emerald-600"
                aria-label="Create new journal entry"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 mb-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reflections..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:text-white"
                />
              </div>

              {/* Date filters */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All Time', start: null, end: null },
                  { label: 'Last 7 Days', start: startOfDay(subDays(new Date(), 6)), end: new Date() },
                  { label: 'This Month', start: startOfMonth(new Date()), end: endOfMonth(new Date()) }
                ].map(({ label, start, end }) => {
                  const isActive =
                    start === null
                      ? !dateRange.start
                      : dateRange.start &&
                        format(dateRange.start, 'yyyy-MM-dd') === format(start, 'yyyy-MM-dd');
                  return (
                    <button
                      key={label}
                      onClick={() => setDateRange({ start, end })}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Tag filters */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                      selectedTag === null
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Entry list */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
              {filteredEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group relative ${
                    selectedId === entry.id
                      ? 'bg-white dark:bg-[#2A2A2A] shadow-md border border-black/5 dark:border-white/5 ring-1 ring-emerald-500/10'
                      : 'hover:bg-white dark:hover:bg-[#2A2A2A] hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {new Date(entry.journaledAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {entry.mood && (
                        <span className="text-xs">
                          {MOODS.find(m => m.label === entry.mood)?.emoji}
                        </span>
                      )}
                    </div>
                    {entry.insight && <Sparkles className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <h3
                    className={`font-medium text-sm truncate ${
                      selectedId === entry.id ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {entry.title || 'Untitled Reflection'}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                    {entry.content.replace(/<[^>]*>/g, '') || 'No content yet...'}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 bg-black/5 text-gray-500 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="text-[9px] text-gray-400">
                          +{entry.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-400">No entries found</p>
                </div>
              )}
            </div>

            {/* Sidebar footer */}
            <div className="px-4 mt-auto pb-6 space-y-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-2xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleSeedData}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-2xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                <Plus className="w-4 h-4" />
                Seed 20 Entries
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-white dark:bg-[#0C0C0C] relative overflow-hidden transition-colors">
        {/* Header */}
        <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-500"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {selectedEntry && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedEntry.journaledAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-[10px] text-gray-300 font-mono">
                  Created: {new Date(selectedEntry.createdAt).toLocaleTimeString()} | Updated:{' '}
                  {new Date(selectedEntry.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Companion
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={isSummaryLoading}
              className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummaryLoading ? (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              )}
              {isSummaryLoading ? 'Analyzing...' : 'Stats'}
            </button>
            <div className="w-px h-4 bg-black/5 mx-2" />
            {selectedEntry && (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Entry
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerateInsight}
                  disabled={isGenerating || !selectedEntry.content.trim()}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {selectedEntry.insight ? 'Refresh Insights' : 'Get AI Insights'}
                </button>
                <button
                  onClick={() => deleteEntry(selectedEntry.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            {selectedEntry ? (
              <div className="space-y-8">
                {/* Mood picker */}
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => updateEntry(selectedEntry.id, { mood: mood.label })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedEntry.mood === mood.label
                          ? `bg-white dark:bg-[#1A1A1A] ${mood.color} border-2 ${mood.border} shadow-sm scale-105`
                          : 'bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{mood.emoji}</span>
                      {mood.label}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <input
                  type="text"
                  value={selectedEntry.title}
                  onChange={e => updateEntry(selectedEntry.id, { title: e.target.value })}
                  placeholder="Reflection Title"
                  className="w-full text-4xl font-bold tracking-tight border-none focus:ring-0 placeholder:text-gray-200"
                />

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {selectedEntry.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium group"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag..."
                    className="bg-transparent border-none focus:ring-0 text-xs text-gray-500 placeholder:text-gray-300 w-24"
                  />
                </div>

                {/* Rich-text editor card */}
                <div className={`bg-white dark:bg-[#1A1A1A] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 ${
                  selectedEntry.mood
                    ? MOODS.find(m => m.label === selectedEntry.mood)?.border + ' dark:border-white/20'
                    : 'border-black/[0.02] dark:border-white/10'
                } overflow-hidden ${
                  settings.fontSize === 'small' ? 'text-sm' :
                  settings.fontSize === 'large' ? 'text-xl' : 'text-base'
                }`}>
                  {/* Toolbar */}
                  <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b-[0.5px] border-black/10 dark:border-white/10 px-4 py-2 flex items-center gap-1 flex-wrap">
                    {/* Undo / Redo */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={!editor?.can().undo()}
                        className="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={!editor?.can().redo()}
                        className="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-[1px] h-4 bg-black/10 mx-1" />

                    {/* Text formatting */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('underline') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Underline (Ctrl+U)"
                      >
                        <UnderlineIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-[1px] h-4 bg-black/10 mx-1" />

                    {/* Lists */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('orderedList') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor?.chain().focus().toggleTaskList().run()}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('taskList') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Task List"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-[1px] h-4 bg-black/10 mx-1" />

                    {/* Link & Image */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={setLink}
                        className={`p-2 rounded-lg transition-colors ${editor?.isActive('link') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Insert Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={addImage}
                        className="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                        title="Insert Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor content */}
                  <div className="px-6 py-5 font-sans leading-[1.8] max-w-[680px] mx-auto">
                    <EditorContent editor={editor} />
                  </div>
                </div>

                {/* AI Insight Panel */}
                <AnimatePresence>
                  {parsedInsight && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-6 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                          <Sparkles className="w-5 h-5" />
                          AI Reflection Insights
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyJson(selectedEntry.insight || '')}
                            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 border ${
                              copied
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                            }`}
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {copied ? 'Copied!' : 'Copy JSON'}
                            </span>
                          </button>
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Score: {parsedInsight.mood_score}/10
                          </div>
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Mood: {parsedInsight.mood_label}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
                            Summary
                          </h4>
                          <p className="text-emerald-900/80 leading-relaxed italic">
                            "{parsedInsight.entry_summary}"
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
                            Insight of the Day
                          </h4>
                          <p className="text-sm text-emerald-900/70 leading-relaxed">
                            {parsedInsight.insight_of_the_day}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
                            Reflection
                          </h4>
                          <p className="text-sm text-emerald-900/70 leading-relaxed bg-white/30 p-4 rounded-2xl border border-emerald-100/50">
                            {parsedInsight.reflection}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-emerald-100">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                              Follow-up Prompt
                            </h4>
                            <button
                              onClick={() => {
                                if (editor) {
                                  const currentContent = editor.getHTML();
                                  editor.commands.setContent(
                                    currentContent +
                                      `<p><br/></p><p><strong>Reflecting on:</strong> ${parsedInsight.follow_up_prompt}</p><p><em>[Add your thoughts here...]</em></p>`
                                  );
                                  editor.commands.focus();
                                }
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                              Answer Reflection
                            </button>
                          </div>
                          <p className="text-sm text-emerald-900/70 font-medium">
                            {parsedInsight.follow_up_prompt}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600/60 font-medium uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {parsedInsight.session_duration_mins} mins
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600/60 font-medium uppercase tracking-wider">
                            <BookOpen className="w-3 h-3" />
                            {parsedInsight.word_count} words
                          </div>
                        </div>

                        {/* Raw JSON toggle */}
                        <div className="pt-4 border-t border-emerald-100/50">
                          <button
                            onClick={() => setShowJsonPreview(!showJsonPreview)}
                            className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/40 hover:text-emerald-600 transition-colors flex items-center gap-1"
                          >
                            {showJsonPreview ? 'Hide Raw JSON' : 'Show Raw JSON'}
                          </button>
                          <AnimatePresence>
                            {showJsonPreview && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <pre className="mt-4 p-4 bg-black/5 rounded-xl text-[10px] font-mono text-emerald-900/60 overflow-x-auto">
                                  {JSON.stringify(parsedInsight, null, 2)}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-32">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Select a reflection</h2>
                  <p className="text-gray-500">
                    Choose an entry from the sidebar or create a new one to start journaling.
                  </p>
                </div>
                <button
                  onClick={createNewEntry}
                  className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  New Entry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {selectedEntry && (
          <footer className="h-10 border-t border-black/5 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm text-[10px] text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedEntry.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}{' '}
                words
              </span>
              <span>
                Last saved:{' '}
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-bold">
              <Save className="w-3 h-3" />
              Private &amp; Local
            </div>
          </footer>
        )}
      </main>

      {/* ── Toast ─────────────────────────────────────────────────────────────── */}
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

      {/* ── Chat Companion ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F7F5F2] shadow-2xl z-50 flex flex-col border-l border-black/5"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">ZenJournal AI</h2>
                    <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                      Companion Mode
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close companion"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 italic text-xl">
                        Where are you arriving from right now?
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[240px] mx-auto">
                        Take a breath before you begin — no rush. I'm here to listen.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                      <button
                        onClick={() => setChatInput("I'm feeling a bit reflective today.")}
                        className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                      >
                        "I'm feeling a bit reflective today."
                      </button>
                      <button
                        onClick={() => setChatInput("I've had a busy day and need to unwind.")}
                        className="px-4 py-2 bg-white border border-black/5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                      >
                        "I've had a busy day and need to unwind."
                      </button>
                    </div>
                  </div>
                )}
                {chatMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white shadow-md rounded-tr-none'
                          : 'bg-white border border-black/5 text-gray-800 shadow-sm rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span
                        className={`text-[9px] mt-2 block opacity-50 ${
                          msg.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-black/5">
                <div className="relative">
                  <textarea
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Share your thoughts..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 resize-none min-h-[50px] max-h-[150px]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-2 bottom-2 p-2 bg-emerald-600 text-white rounded-xl shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Weekly Summary Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSummaryOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSummaryOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-light tracking-tight italic">Weekly Reflection</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">
                    Insights &amp; Patterns
                  </p>
                </div>
                <button
                  onClick={() => setIsSummaryOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close summary"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {isSummaryLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-sm text-gray-500 italic">Gathering your thoughts...</p>
                  </div>
                ) : weeklySummary ? (
                  <>
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          label: 'Avg Mood',
                          value: weeklySummary.avgMood.toFixed(1),
                          unit: '/10'
                        },
                        {
                          label: 'Sessions',
                          value: weeklySummary.sessionCount,
                          unit: 'this week'
                        },
                        { label: 'Top Mood', value: weeklySummary.topMood, unit: '' },
                        { label: 'Trend', value: weeklySummary.trend, unit: '' }
                      ].map(({ label, value, unit }) => (
                        <div
                          key={label}
                          className="p-6 bg-gray-50 rounded-3xl border border-black/5"
                        >
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                            {label}
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light">{value}</span>
                            {unit && <span className="text-xs text-gray-400">{unit}</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mood distribution */}
                    {Object.keys(weeklySummary.moodDistribution).length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                          Mood Distribution
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(weeklySummary.moodDistribution).map(([mood, count]) => (
                            <div key={mood} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-gray-700">{mood}</span>
                                <span className="text-gray-400">{count} sessions</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(count / weeklySummary.sessionCount) * 100}%`
                                  }}
                                  className="h-full bg-emerald-500 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recurring themes */}
                    {weeklySummary.recurringThemes.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                          Recurring Themes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {weeklySummary.recurringThemes.map(theme => (
                            <span
                              key={theme}
                              className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium border border-emerald-100"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No summary available yet. Keep journaling!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Settings Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light tracking-tight italic">Settings</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                    Personalize your experience
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="fontSize" className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                      <select
                        id="fontSize"
                        value={settings.fontSize}
                        onChange={e =>
                          setSettings(prev => ({ ...prev, fontSize: e.target.value }))
                        }
                        className="text-sm bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 dark:text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                      <select
                        id="theme"
                        value={settings.theme}
                        onChange={e => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                        className="text-sm bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 dark:text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Data Management
                  </h3>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Export Journal</p>
                        <p className="text-[10px] text-gray-400">Download all entries as JSON</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-black/5">
                <p className="text-[10px] text-center text-gray-400 leading-relaxed">
                  ZenJournal AI stores your data locally in your browser.
                  <br />
                  Export regularly to keep your reflections safe.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
