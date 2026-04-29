import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Sparkles, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatOverlayProps {
  isFocusMode: boolean;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendMessage: () => void;
  isChatLoading: boolean;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
  isFocusMode,
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isChatLoading
}) => {
  if (isFocusMode || !isChatOpen) return null;

  return (
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
              <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Companion Mode</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                <h3 className="font-medium text-gray-900 italic serif text-xl">Where are you arriving from right now?</h3>
                <p className="text-sm text-gray-500 max-w-[240px] mx-auto">Take a breath before you begin — no rush. I'm here to listen.</p>
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
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white shadow-md rounded-tr-none'
                  : 'bg-white border border-black/5 text-gray-800 shadow-sm rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className={`text-[9px] mt-2 block opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-black/5">
          <div className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
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
  );
};
