import React from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Tag,
  X,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { JournalEntry } from '../types';
import { MOODS } from '../constants/moods';

interface EditorSectionProps {
  selectedEntry: JournalEntry;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  handleRestoreVersion: (id: string, version: { content: string, title: string }) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  historyDropdownRef: React.RefObject<HTMLDivElement | null>;
  editor: Editor | null;
  tagInput: string;
  setTagInput: (input: string) => void;
  handleAddTag: (e: React.KeyboardEvent) => void;
  removeTag: (tag: string) => void;
  setLink: () => void;
  addImage: () => void;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  selectedEntry,
  updateEntry,
  handleRestoreVersion,
  showHistory,
  setShowHistory,
  historyDropdownRef,
  editor,
  tagInput,
  setTagInput,
  handleAddTag,
  removeTag,
  setLink,
  addImage
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            onClick={() => updateEntry(selectedEntry.id, { mood: mood.label })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedEntry.mood === mood.label
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
            }`}
          >
            <span>{mood.emoji}</span>
            {mood.label}
          </button>
        ))}
        <div className="ml-auto relative" ref={historyDropdownRef}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-black/5 hover:bg-gray-50 text-gray-500"
          >
            <Clock className="w-3.5 h-3.5" />
            History
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/5 z-[60] overflow-hidden"
              >
                <div className="p-4 border-b border-black/5 bg-gray-50">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Version History</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {selectedEntry.history && selectedEntry.history.length > 0 ? (
                    selectedEntry.history.map((version, i) => (
                      <button
                        key={i}
                        onClick={() => handleRestoreVersion(selectedEntry.id, {
                          content: version.content,
                          title: version.title
                        })}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-black/5 last:border-0 transition-colors"
                      >
                        <p className="text-xs font-medium text-gray-700">
                          {format(new Date(version.timestamp), 'MMM d, HH:mm')}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {version.title || 'Untitled'}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-gray-400">No previous versions</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input
        type="text"
        value={selectedEntry.title}
        onChange={(e) => updateEntry(selectedEntry.id, { title: e.target.value })}
        placeholder="Reflection Title"
        className="w-full text-4xl font-bold tracking-tight border-none focus:ring-0 placeholder:text-gray-200"
      />

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
        {selectedEntry.tags.length > 0 && (
          <button
            onClick={() => updateEntry(selectedEntry.id, { tags: [] })}
            className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tag..."
          className="bg-transparent border-none focus:ring-0 text-xs text-gray-500 placeholder:text-gray-300 w-24"
        />
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] overflow-hidden">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-[0.5px] border-black/10 px-4 py-2 flex items-center gap-1">
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

        <div
          className="px-6 py-5 font-sans leading-[1.8] max-w-[680px] mx-auto"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const result = event.target?.result as string;
                editor?.chain().focus().setImage({ src: result }).run();
              };
              reader.readAsDataURL(file);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
