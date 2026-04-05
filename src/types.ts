export type Priority = 'low' | 'medium' | 'high';
export type Recurrence = 'none' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  theme: 'light' | 'dark';
  monthlyBudget: number;
  productivityGoal: number;
  createdAt: any;
}

export interface Task {
  id: string;
  uid: string;
  title: string;
  priority: Priority;
  recurrence: Recurrence;
  customDays?: number[];
  completed: boolean;
  date: string; // YYYY-MM-DD
  lastReset: string; // YYYY-MM-DD
  createdAt: any;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  createdAt: any;
}

export interface Expense {
  id: string;
  uid: string;
  walletId?: string;
  amount: number;
  category: string;
  notes: string;
  date: string; // YYYY-MM-DD
  createdAt: any;
}

export interface Habit {
  id: string;
  uid: string;
  name: string;
  streak: number;
  lastCompleted: string; // YYYY-MM-DD
  history: string[]; // dates
  createdAt: any;
}

export interface Note {
  id: string;
  uid: string;
  content: string;
  date: string; // YYYY-MM-DD
  createdAt: any;
}
