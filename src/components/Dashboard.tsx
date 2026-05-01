import React, { useState } from 'react';
import { Habit, Expense } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { isDueToday } from './HabitTracker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { TrendingUp, CheckCircle, Wallet, Target, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const [habits] = useLocalStorage<Habit[]>('zenith_habits', []);
  const [expenses] = useLocalStorage<Expense[]>('zenith_expenses', []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const dueHabits = habits.filter(isDueToday);
  const completedHabitsToday = dueHabits.filter(h => h.lastCompleted === todayStr).length;
  const completionRate = dueHabits.length > 0 ? (completedHabitsToday / dueHabits.length) * 100 : 0;

  // Expense by category
  const expenseByCategory = expenses.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expenseByCategory).map(name => ({
    name,
    value: expenseByCategory[name]
  })).sort((a, b) => b.value - a.value);

  // Weekly spending
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();

  const barData = last7Days.map(date => {
    const dailyExpenses = expenses.filter(e => 
      e.date === date && 
      (selectedCategory === 'All' || e.category === selectedCategory)
    );
    return {
      date: format(parseISO(date), 'MMM d'),
      amount: dailyExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  });

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  const pendingHabits = dueHabits.filter(h => h.lastCompleted !== todayStr).slice(0, 5); // show top 5

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Habit Completion</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{completionRate.toFixed(0)}%</h3>
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-1000 ease-out" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 text-rose-600 dark:text-rose-400 rounded-2xl">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Monthly Spend</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Total recorded expenses</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Top Category</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white truncate max-w-[140px]">
                {pieData.length > 0 ? pieData[0].name : 'None'}
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Based on total spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="text-orange-500" /> Pending Habits
          </h3>
          <div className="space-y-3">
            {pendingHabits.length === 0 ? (
              <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                <p className="text-gray-500 font-medium">All caught up! No pending habits.</p>
              </div>
            ) : (
              pendingHabits.map(habit => (
                <div key={habit.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-3 h-3 rounded-full shadow-sm bg-orange-500 shadow-orange-200" />
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200 truncate flex-1">{habit.name}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">🔥 {habit.streak}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-purple-500" /> Weekly Spending
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {Object.keys(expenseByCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 600 }}
                />
                <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
