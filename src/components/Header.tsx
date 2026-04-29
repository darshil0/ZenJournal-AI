import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Calendar,
  Maximize2,
  Minimize2,
  Search,
  MessageCircle,
  BarChart3,
  Loader2,
  Save,
  Sparkles,
  Trash2
} from 'lucide-react';
import { JournalEntry } from '../types';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  selectedEntry: JournalEntry | undefined;
  isFocusMode: boolean;
  setIsFocusMode: (focus: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  handleGenerateSummary: () => void;
  isSummaryLoading: boolean;
  handleSave: () => void;
  isSaving: boolean;
  handleGenerateInsight: () => void;
  isGenerating: boolean;
  deleteEntry: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedEntry,
  isFocusMode,
  setIsFocusMode,
  setIsChatOpen,
  handleGenerateSummary,
  isSummaryLoading,
  handleSave,
  isSaving,
  handleGenerateInsight,
  isGenerating,
  deleteEntry
}) => {
  return (
    <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-500"
        >
          <span className="hidden lg:block">
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </span>
          <span className="lg:hidden">
            <Menu className="w-5 h-5" />
          </span>
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
              Created: {new Date(selectedEntry.createdAt).toLocaleTimeString()} | Updated: {new Date(selectedEntry.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 lg:gap-2">
        <button
          onClick={() => {
            setIsSidebarOpen(true);
            setTimeout(() => {
              (document.querySelector('input[placeholder="Search reflections..."]') as HTMLInputElement)?.focus();
            }, 100);
          }}
          className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`p-2 rounded-lg transition-colors ${isFocusMode ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
        >
          {isFocusMode ? <Minimize2 className="w-4 lg:w-5 h-4 lg:h-5" /> : <Maximize2 className="w-4 lg:w-5 h-4 lg:h-5" />}
        </button>
        <div className="hidden sm:block w-px h-4 bg-black/5 mx-1" />
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-2 lg:px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Companion</span>
        </button>
        <button
          onClick={handleGenerateSummary}
          disabled={isSummaryLoading}
          className="flex items-center gap-2 px-2 lg:px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSummaryLoading ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          ) : (
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          )}
          <span className="hidden sm:inline">{isSummaryLoading ? 'Analyzing...' : 'Stats'}</span>
        </button>
        <div className="w-px h-4 bg-black/5 mx-2" />
        {selectedEntry && (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-2 lg:px-4 py-1.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <span className="hidden lg:inline ml-1">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Save Entry</span>
                </>
              )}
            </button>
            <button
              onClick={handleGenerateInsight}
              disabled={isGenerating || !selectedEntry.content.trim()}
              className="flex items-center gap-2 px-2 lg:px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="hidden lg:inline ml-1">{selectedEntry.insight ? 'Refresh Insights' : 'Get AI Insights'}</span>
            </button>
            <button
              onClick={() => deleteEntry(selectedEntry.id)}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
