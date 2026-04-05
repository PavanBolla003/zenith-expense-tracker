import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Book, Save, Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export const Journal: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('zenith_notes', []);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  // Load note for the selected date
  useEffect(() => {
    const existingNote = notes.find(n => n.date === date);
    if (existingNote) {
      setContent(existingNote.content);
      setIsEditing(false);
    } else {
      setContent('');
      setIsEditing(true);
    }
  }, [date, notes]);

  const saveNote = () => {
    const noteId = `note_${date}`;
    const newNote: Note = {
      id: noteId,
      uid: 'local_user',
      content,
      date,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => {
      const filtered = prev.filter(n => n.date !== date);
      return [...filtered, newNote];
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
            <Book size={24} />
          </div>
          Journal
        </h2>
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm border border-white/40 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
          <CalendarIcon size={20} className="text-indigo-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none outline-none text-base font-bold text-gray-700 dark:text-gray-200 cursor-pointer tracking-wide"
          />
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-md border border-white/40 dark:border-gray-800 overflow-hidden min-h-[500px] flex flex-col transition-all">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50">
          <span className="text-sm font-bold uppercase tracking-widest text-indigo-500">
            {isEditing ? 'Drafting Details' : 'Reading Reflection'}
          </span>
          <button
            onClick={() => isEditing ? saveNote() : setIsEditing(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 transition-all hover:-translate-y-0.5"
          >
            {isEditing ? <><Save size={18} strokeWidth={2.5} /> Save Entry</> : <><Edit3 size={18} strokeWidth={2.5} /> Edit Entry</>}
          </button>
        </div>

        <div className="flex-1 p-8">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? (Markdown is supported)"
              className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none text-gray-800 dark:text-gray-200 font-medium text-lg leading-relaxed placeholder:text-gray-400 placeholder:font-normal"
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 marker:text-indigo-500 prose-headings:font-black prose-a:text-indigo-500">
              <ReactMarkdown>{content || '*No reflection for this day.*'}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
