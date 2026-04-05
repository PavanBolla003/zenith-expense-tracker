import React, { useState } from 'react';
import { Habit } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Flame, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { format, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('zenith_habits', []);
  const [newName, setNewName] = useState('');

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      uid: 'local_user',
      name: newName,
      streak: 0,
      lastCompleted: '',
      history: [],
      createdAt: new Date().toISOString()
    };

    setHabits([...habits, newHabit]);
    setNewName('');
  };

  const completeHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      if (habit.lastCompleted === today) return habit;

      let newStreak = habit.streak;
      const lastDate = habit.lastCompleted ? parseISO(habit.lastCompleted) : null;
      
      if (!lastDate || isYesterday(lastDate)) {
        newStreak += 1;
      } else if (differenceInDays(new Date(), lastDate) > 1) {
        newStreak = 1;
      }

      return {
        ...habit,
        streak: newStreak,
        lastCompleted: today,
        history: [...habit.history, today]
      };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400">Habit Streaks</h2>
      </div>

      <form onSubmit={addHabit} className="flex gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="What habit do you want to build? (e.g. Meditate)"
          className="flex-1 bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-orange-500 rounded-2xl px-5 py-3 font-semibold focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-inner placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-2xl transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/50 hover:scale-105"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </form>

      {habits.length === 0 && (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-3xl border border-white/20 dark:border-gray-800 mt-6">
          <Flame size={56} className="mx-auto mb-4 text-orange-400/50" />
          <p className="text-lg font-medium text-gray-500">No habits tracked yet. Start building one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {habits.map(habit => {
          const isDoneToday = habit.lastCompleted === format(new Date(), 'yyyy-MM-dd');
          return (
            <div 
              key={habit.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "p-4 rounded-2xl transition-all duration-500 shadow-inner",
                  isDoneToday ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-200 dark:shadow-orange-900/40" : "bg-gray-100 dark:bg-gray-800 text-gray-400 grayscale"
                )}>
                  <Flame size={28} className={isDoneToday ? "animate-pulse" : ""} fill={isDoneToday ? "currentColor" : "none"} strokeWidth={isDoneToday ? 2 : 2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">{habit.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                      {habit.streak} day streak
                    </span>
                    {habit.streak >= 3 && <span className="text-sm">🔥</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => completeHabit(habit.id)}
                  disabled={isDoneToday}
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-300",
                    isDoneToday 
                      ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 cursor-default scale-110" 
                      : "text-gray-300 hover:text-white hover:bg-orange-500 bg-gray-50 dark:bg-gray-800 shadow-sm hover:scale-110"
                  )}
                >
                  <CheckCircle2 size={28} strokeWidth={isDoneToday ? 3 : 2} />
                </button>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
