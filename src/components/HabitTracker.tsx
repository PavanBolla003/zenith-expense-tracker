import React, { useState } from 'react';
import { Habit, HabitFrequency } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Flame, Plus, Trash2, CheckCircle2, Calendar, RotateCcw } from 'lucide-react';
import { format, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function isDueToday(habit: Habit): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (habit.frequency === 'daily') return true;

  if (habit.frequency === 'specific_days') {
    return (habit.specificDays ?? []).includes(dayOfWeek);
  }

  if (habit.frequency === 'every_n_days') {
    const interval = habit.intervalDays ?? 2;
    if (!habit.lastCompleted) return true;
    const last = parseISO(habit.lastCompleted);
    const diff = differenceInDays(today, last);
    return diff >= interval;
  }

  return true;
}

function getFrequencyLabel(habit: Habit): string {
  if (habit.frequency === 'daily') return 'Every day';
  if (habit.frequency === 'specific_days') {
    const days = (habit.specificDays ?? []).map(d => DAY_LABELS[d]).join(', ');
    return days || 'No days set';
  }
  if (habit.frequency === 'every_n_days') {
    const n = habit.intervalDays ?? 2;
    return n === 2 ? 'Every other day' : `Every ${n} days`;
  }
  return '';
}

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('zenith_habits', []);
  const [newName, setNewName] = useState('');
  const [newFrequency, setNewFrequency] = useState<HabitFrequency>('daily');
  const [newSpecificDays, setNewSpecificDays] = useState<number[]>([]);
  const [newIntervalDays, setNewIntervalDays] = useState(2);

  const toggleSpecificDay = (day: number) => {
    setNewSpecificDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (newFrequency === 'specific_days' && newSpecificDays.length === 0) return;

    const newHabit: Habit = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      uid: 'local_user',
      name: newName,
      streak: 0,
      lastCompleted: '',
      history: [],
      frequency: newFrequency,
      specificDays: newFrequency === 'specific_days' ? newSpecificDays : undefined,
      intervalDays: newFrequency === 'every_n_days' ? newIntervalDays : undefined,
      createdAt: new Date().toISOString()
    };

    setHabits([...habits, newHabit]);
    setNewName('');
    setNewSpecificDays([]);
    setNewIntervalDays(2);
  };

  const completeHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      if (habit.lastCompleted === today) return habit;

      let newStreak = habit.streak;
      const lastDate = habit.lastCompleted ? parseISO(habit.lastCompleted) : null;

      if (habit.frequency === 'every_n_days') {
        const interval = habit.intervalDays ?? 2;
        if (!lastDate) {
          newStreak = 1;
        } else {
          const diff = differenceInDays(new Date(), lastDate);
          // Allow completing within the window (interval or interval+1 days for flexibility)
          if (diff <= interval + 1) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }
      } else {
        if (!lastDate || isYesterday(lastDate)) {
          newStreak += 1;
        } else if (differenceInDays(new Date(), lastDate) > 1) {
          newStreak = 1;
        }
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

      {/* Add Habit Form */}
      <form onSubmit={addHabit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800 space-y-4">
        <div className="flex gap-3">
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
        </div>

        {/* Frequency selector */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5"><Calendar size={14}/> Schedule:</span>
          {(['daily', 'specific_days', 'every_n_days'] as HabitFrequency[]).map(freq => (
            <button
              key={freq}
              type="button"
              onClick={() => setNewFrequency(freq)}
              className={cn(
                'px-4 py-1.5 rounded-xl text-sm font-semibold transition-all',
                newFrequency === freq
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
              )}
            >
              {freq === 'daily' ? 'Every Day' : freq === 'specific_days' ? 'Specific Days' : 'Every N Days'}
            </button>
          ))}
        </div>

        {/* Specific days picker */}
        {newFrequency === 'specific_days' && (
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map((day, idx) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleSpecificDay(idx)}
                className={cn(
                  'w-12 h-12 rounded-xl text-sm font-bold transition-all',
                  newSpecificDays.includes(idx)
                    ? 'bg-orange-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                )}
              >
                {day}
              </button>
            ))}
            {newSpecificDays.length === 0 && (
              <span className="text-xs text-rose-500 font-semibold mt-1 self-center">* Select at least one day</span>
            )}
          </div>
        )}

        {/* Every N days picker */}
        {newFrequency === 'every_n_days' && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-500">Every</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setNewIntervalDays(Math.max(2, newIntervalDays - 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">−</button>
              <span className="text-2xl font-black text-orange-500 w-8 text-center">{newIntervalDays}</span>
              <button type="button" onClick={() => setNewIntervalDays(Math.min(30, newIntervalDays + 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">+</button>
            </div>
            <span className="text-sm font-semibold text-gray-500">days</span>
            {newIntervalDays === 2 && <span className="text-xs text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">Alternate Days</span>}
          </div>
        )}
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
          const dueToday = isDueToday(habit);
          const canComplete = dueToday && !isDoneToday;

          return (
            <div
              key={habit.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-500 shadow-inner",
                    isDoneToday ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-200 dark:shadow-orange-900/40" : "bg-gray-100 dark:bg-gray-800 text-gray-400 grayscale"
                  )}>
                    <Flame size={28} className={isDoneToday ? "animate-pulse" : ""} fill={isDoneToday ? "currentColor" : "none"} strokeWidth={isDoneToday ? 2 : 2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">{habit.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                        {habit.streak} day streak
                      </span>
                      {habit.streak >= 3 && <span className="text-sm">🔥</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => completeHabit(habit.id)}
                    disabled={!canComplete}
                    title={isDoneToday ? 'Done today!' : !dueToday ? 'Not due today' : 'Mark complete'}
                    className={cn(
                      "p-3 rounded-2xl transition-all duration-300",
                      isDoneToday
                        ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 cursor-default scale-110"
                        : !dueToday
                        ? "text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50"
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

              {/* Schedule info */}
              <div className="flex items-center gap-2 text-xs">
                <RotateCcw size={12} className="text-orange-400 shrink-0" />
                <span className="font-semibold text-gray-500">{getFrequencyLabel(habit)}</span>
                {habit.frequency === 'specific_days' && (
                  <div className="flex gap-1 ml-1">
                    {DAY_LABELS.map((d, i) => (
                      <span key={d} className={cn(
                        'w-6 h-6 rounded-md text-[10px] flex items-center justify-center font-bold',
                        (habit.specificDays ?? []).includes(i)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      )}>{d[0]}</span>
                    ))}
                  </div>
                )}
                {!dueToday && !isDoneToday && (
                  <span className="ml-auto text-gray-400 italic">Not due today</span>
                )}
                {isDoneToday && (
                  <span className="ml-auto text-emerald-500 font-bold">✓ Done today!</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
