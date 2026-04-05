import React, { useState, useEffect } from 'react';
import { Task, Priority, Recurrence } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Plus, Check, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('zenith_tasks', []);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newRecurrence, setNewRecurrence] = useState<Recurrence>('none');

  useEffect(() => {
    checkAndResetTasks();
  }, []);

  const checkAndResetTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let changed = false;
    
    const updatedTasks = tasks.map(task => {
      if (task.recurrence !== 'none' && task.completed && task.lastReset !== today) {
        if (checkIfShouldReset(task, today)) {
          changed = true;
          return { ...task, completed: false, lastReset: today };
        }
      }
      return task;
    });

    if (changed) {
      setTasks(updatedTasks);
    }
  };

  const checkIfShouldReset = (task: Task, today: string) => {
    const dayOfWeek = new Date().getDay(); // 0-6
    switch (task.recurrence) {
      case 'daily': return true;
      case 'weekdays': return dayOfWeek >= 1 && dayOfWeek <= 5;
      case 'weekends': return dayOfWeek === 0 || dayOfWeek === 6;
      case 'custom': return task.customDays?.includes(dayOfWeek);
      default: return false;
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      uid: 'local_user',
      title: newTitle,
      priority: newPriority,
      recurrence: newRecurrence,
      completed: false,
      date: format(new Date(), 'yyyy-MM-dd'),
      lastReset: format(new Date(), 'yyyy-MM-dd'),
      createdAt: new Date().toISOString() as any,
    };

    // Prepend new tasks
    setTasks([newTask, ...tasks]);
    setNewTitle('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Daily Checklist</h2>
        <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 shadow-sm border border-white/20 dark:border-gray-700">
          {format(new Date(), 'EEEE, MMMM do')}
        </div>
      </div>

      <form onSubmit={addTask} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-white/40 dark:border-gray-800 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-indigo-500 rounded-2xl px-5 py-3 font-medium focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:scale-105"
          >
            <Plus size={24} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500">Priority:</span>
            <select 
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500">Repeat:</span>
            <select 
              value={newRecurrence}
              onChange={(e) => setNewRecurrence(e.target.value as Recurrence)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
            </select>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-3xl border border-white/20 dark:border-gray-800">
            <Clock size={56} className="mx-auto mb-4 text-indigo-400/50" />
            <p className="text-lg font-medium text-gray-500">No tasks for today. Add one above!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id}
              className={cn(
                "group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300",
                task.completed 
                  ? "bg-gray-50/50 dark:bg-gray-900/30 border-transparent opacity-60 scale-[0.99]" 
                  : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-white/60 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700"
              )}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all",
                  task.completed 
                    ? "bg-gradient-to-tr from-emerald-400 to-teal-500 border-transparent text-white scale-110" 
                    : "border-gray-300 dark:border-gray-600 hover:border-indigo-500 bg-white dark:bg-gray-800"
                )}
              >
                {task.completed && <Check size={16} strokeWidth={3} />}
              </button>
              
              <div className="flex-1">
                <h3 className={cn(
                  "font-semibold text-lg transition-colors",
                  task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white"
                )}>
                  {task.title}
                </h3>
                <div className="flex gap-3 mt-1.5 text-xs font-bold">
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg uppercase tracking-wider",
                    task.priority === 'high' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" :
                    task.priority === 'medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  )}>
                    {task.priority}
                  </span>
                  {task.recurrence !== 'none' && (
                    <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      <Calendar size={12} />
                      {task.recurrence}
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
