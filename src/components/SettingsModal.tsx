import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, ChevronRight } from 'lucide-react';

interface Settings {
  fontSize: string;
  theme: string;
  autosave: boolean;
  aiTone: string;
}

interface SettingsModalProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  handleExport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  showSettings,
  setShowSettings,
  settings,
  setSettings,
  handleExport
}) => {
  if (!showSettings) return null;

  return (
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
            <h2 className="text-2xl font-light tracking-tight serif italic">Settings</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Personalize your experience</p>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Font Size</span>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="text-sm bg-gray-50 border border-black/5 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                  className="text-sm bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Companion Tone</span>
                <select
                  value={settings.aiTone}
                  onChange={(e) => setSettings(prev => ({ ...prev, aiTone: e.target.value }))}
                  className="text-sm bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="warm">Warm & Empathetic</option>
                  <option value="clinical">Clinical & Analytical</option>
                  <option value="poetic">Poetic & Metaphorical</option>
                  <option value="direct">Direct & Concise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Data Management</h3>
            <div className="space-y-3">
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
        </div>

        <div className="p-8 bg-gray-50 border-t border-black/5">
          <p className="text-[10px] text-center text-gray-400 leading-relaxed">
            ZenJournal AI stores your data locally in your browser.<br />
            Export regularly to keep your reflections safe.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
