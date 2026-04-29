import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Check,
  Copy,
  Clock,
  BookOpen,
  Plus,
  X,
  ArrowUpRight
} from 'lucide-react';
import { AIInsight, WeeklySummary } from '../types';
import { MOODS } from '../constants/moods';

interface AIInsightViewProps {
  isFocusMode: boolean;
  parsedInsight: AIInsight | null;
  selectedEntryInsight: string | undefined;
  handleCopyPrompt: (text: string) => void;
  copied: boolean;
  showJsonPreview: boolean;
  setShowJsonPreview: (show: boolean) => void;
  onAnswerReflection: (prompt: string) => void;
}

export const AIInsightView: React.FC<AIInsightViewProps> = ({
  isFocusMode,
  parsedInsight,
  selectedEntryInsight,
  handleCopyPrompt,
  copied,
  showJsonPreview,
  setShowJsonPreview,
  onAnswerReflection
}) => {
  if (isFocusMode || !parsedInsight) return null;

  return (
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
            onClick={() => handleCopyPrompt(selectedEntryInsight || '')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 border ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white hover:bg-emerald-100 text-emerald-600 border-emerald-200'
            }`}
            title="Copy AI JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Summary</h4>
          </div>
          <p className="text-emerald-900/80 leading-relaxed italic">
            "{parsedInsight.entry_summary}"
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Insight of the Day</h4>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            {parsedInsight.insight_of_the_day}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Reflection</h4>
          <p className="text-sm text-emerald-900/70 leading-relaxed bg-white/30 p-4 rounded-2xl border border-emerald-100/50">
            {parsedInsight.reflection}
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Follow-up Prompt</h4>
            <button
              onClick={() => onAnswerReflection(parsedInsight.follow_up_prompt)}
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

        {/* JSON Preview Toggle */}
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
  );
};

interface WeeklySummaryOverlayProps {
  isSummaryOpen: boolean;
  setIsSummaryOpen: (open: boolean) => void;
  isSummaryLoading: boolean;
  weeklySummary: WeeklySummary | null;
}

export const WeeklySummaryOverlay: React.FC<WeeklySummaryOverlayProps> = ({
  isSummaryOpen,
  setIsSummaryOpen,
  isSummaryLoading,
  weeklySummary
}) => {
  if (!isSummaryOpen) return null;

  return (
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
            <h2 className="text-3xl font-light tracking-tight serif italic">Weekly Reflection</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">Insights & Patterns</p>
          </div>
          <button
            onClick={() => setIsSummaryOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {isSummaryLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 italic">Gathering your thoughts...</p>
            </div>
          ) : weeklySummary ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Avg Mood</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light">{weeklySummary.avgMood.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">/10</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Sessions</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light">{weeklySummary.sessionCount}</span>
                    <span className="text-xs text-gray-400">this week</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Top Mood</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-light">
                      {MOODS.find(m => m.label === weeklySummary.topMood)?.emoji} {weeklySummary.topMood}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Trend</p>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-xl font-medium">{weeklySummary.trend}</span>
                  </div>
                </div>
              </div>

              {/* Mood Distribution */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Mood Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(weeklySummary.moodDistribution).map(([mood, count]) => (
                    <div key={mood} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-700">
                          {MOODS.find(m => m.label === mood)?.emoji} {mood}
                        </span>
                        <span className="text-gray-400">{count} sessions</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / weeklySummary.sessionCount) * 100}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recurring Themes */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Recurring Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {weeklySummary.recurringThemes.map(theme => (
                    <span key={theme} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium border border-emerald-100">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No summary available yet. Keep journaling!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
