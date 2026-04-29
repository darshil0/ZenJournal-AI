import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Calendar,
  BookOpen,
  Flame,
  Settings,
  BarChart3,
  ChevronLeft,
  Info,
  Sparkles
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { JournalEntry } from '../types';
import { HighlightText } from '../utils/helpers';
import { MOODS } from '../constants/moods';

interface SidebarProps {
  isFocusMode: boolean;
  isSidebarOpen: boolean;
  isMobile: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  streak: number;
  createNewEntry: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: { start: Date | null, end: Date | null }) => void;
  dateRange: { start: Date | null, end: Date | null };
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  allTags: string[];
  filteredEntries: JournalEntry[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setShowSettings: (show: boolean) => void;
  handleSeedData: () => void;
  handleGenerateSummary: () => void;
  isSummaryLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isFocusMode,
  isSidebarOpen,
  isMobile,
  setIsSidebarOpen,
  streak,
  createNewEntry,
  searchQuery,
  setSearchQuery,
  setDateRange,
  dateRange,
  selectedTags,
  setSelectedTags,
  allTags,
  filteredEntries,
  selectedId,
  setSelectedId,
  setShowSettings,
  handleSeedData,
  handleGenerateSummary,
  isSummaryLoading
}) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isFocusMode && isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isFocusMode && isSidebarOpen && (
          <motion.aside
            initial={{ x: isMobile ? -320 : 0, width: isMobile ? 320 : 0, opacity: 0 }}
            animate={{ x: 0, width: 320, opacity: 1 }}
            exit={{ x: isMobile ? -320 : 0, width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed lg:relative flex flex-col border-r border-black/5 bg-[#F7F5F2] dark:bg-[#1A1A1A] dark:border-white/5 overflow-hidden h-full z-[90]`}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
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
                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-black/5 text-emerald-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 mb-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reflections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 bg-white/50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="relative">
                      <Info className="w-3.5 h-3.5 text-gray-300 hover:text-emerald-500 cursor-help transition-colors peer" />
                      <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-white rounded-xl shadow-xl border border-black/5 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all z-[100] pointer-events-none">
                        <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-2">Search Tips</p>
                        <ul className="space-y-1.5 text-[10px] text-gray-500">
                          <li className="flex gap-2">
                            <span className="font-mono text-emerald-600">"phrase"</span>
                            <span>Exact match</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-mono text-emerald-600">-word</span>
                            <span>Exclude word</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-mono text-emerald-600">#tag</span>
                            <span>Include tag</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-mono text-emerald-600">-#tag</span>
                            <span>Exclude tag</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      if (date) {
                        setDateRange({ start: date, end: date });
                      } else {
                        setDateRange({ start: null, end: null });
                      }
                    }}
                    className="w-10 h-10 pl-10 bg-white/50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 cursor-pointer"
                    title="Jump to date"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setDateRange({ start: null, end: null })}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                    !dateRange.start
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white/50 text-gray-500 hover:bg-white'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setDateRange({ start: subDays(new Date(), 7), end: new Date() })}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                    dateRange.start && format(dateRange.start, 'yyyy-MM-dd') === format(subDays(new Date(), 7), 'yyyy-MM-dd')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white/50 text-gray-500 hover:bg-white'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setDateRange({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) })}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                    dateRange.start && format(dateRange.start, 'yyyy-MM-dd') === format(startOfMonth(new Date()), 'yyyy-MM-dd')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white/50 text-gray-500 hover:bg-white'
                  }`}
                >
                  This Month
                </button>
              </div>

              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTags([])}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                      selectedTags.length === 0
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white/50 text-gray-500 hover:bg-white'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag)
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white/50 text-gray-500 hover:bg-white'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
              {filteredEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group relative ${
                    selectedId === entry.id
                      ? 'bg-white shadow-md border border-black/5 ring-1 ring-emerald-500/10'
                      : 'hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        {new Date(entry.journaledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {entry.mood && <span className="text-xs">{MOODS.find(m => m.label === entry.mood)?.emoji}</span>}
                    </div>
                    {entry.insight && <Sparkles className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <h3 className={`font-medium text-sm truncate ${selectedId === entry.id ? 'text-black' : 'text-gray-600'}`}>
                    <HighlightText text={entry.title || 'Untitled Reflection'} query={searchQuery} />
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                    <HighlightText text={entry.content.replace(/<[^>]*>/g, ' ') || 'No content yet...'} query={searchQuery} />
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTags(prev => prev.includes(tag) ? prev : [...prev, tag]);
                          }}
                          className="text-[9px] px-1.5 py-0.5 bg-black/5 dark:bg-white/5 text-gray-500 rounded-md hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="text-[9px] text-gray-400">+{entry.tags.length - 3}</span>
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

            <div className="px-4 mt-auto pb-6 space-y-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-black/10 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleSeedData}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-black/10 text-gray-600 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Seed 20 Entries
              </button>
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSummaryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                {isSummaryLoading ? 'Generating...' : 'Weekly Summary'}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

// Internal Loader2 icon since lucide-react is imported
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
