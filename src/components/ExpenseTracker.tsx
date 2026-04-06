import React, { useState } from 'react';
import { Expense, Wallet } from '../types';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Plus, Trash2, DollarSign, Calendar as CalendarIcon, PieChart, CreditCard, Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { name: 'Entertainment', icon: '🎮', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { name: 'Bills', icon: '💡', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { name: 'Health', icon: '🏥', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { name: 'Other', icon: '✨', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
];

// ── Credit Modal ──────────────────────────────────────────────────────────────
interface CreditModalProps {
  wallets: Wallet[];
  onClose: () => void;
  onCredit: (walletId: string, amount: number, note: string) => void;
}

const CreditModal: React.FC<CreditModalProps> = ({ wallets, onClose, onCredit }) => {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedWallet) return;
    onCredit(selectedWallet, parseFloat(amount), note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowDownLeft className="text-emerald-500" size={28} /> Credit Money
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wallet selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Credit to Account</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {wallets.map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWallet(w.id)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left',
                    selectedWallet === w.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                  )}
                >
                  <span className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                    <CreditCard size={16} className={selectedWallet === w.id ? 'text-emerald-500' : 'text-gray-400'} />
                    {w.name}
                  </span>
                  <span className={cn('font-bold text-sm', selectedWallet === w.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500')}>
                    ${w.balance.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-3 font-bold text-lg focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Salary, Freelance payment..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 rounded-2xl px-4 py-3 font-medium focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <ArrowDownLeft size={22} strokeWidth={3} /> Add Credit
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('zenith_expenses', []);
  const [wallets, setWallets] = useLocalStorage<Wallet[]>('zenith_wallets', []);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');
  const [expenseDate, setExpenseDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedWalletId, setSelectedWalletId] = useState('');

  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletBalance, setNewWalletBalance] = useState('');

  const [showCreditModal, setShowCreditModal] = useState(false);

  React.useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  const addWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName || !newWalletBalance) return;
    const newWallet: Wallet = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: newWalletName,
      balance: parseFloat(newWalletBalance),
      createdAt: new Date().toISOString()
    };
    setWallets([...wallets, newWallet]);
    setNewWalletName('');
    setNewWalletBalance('');
    if (!selectedWalletId) setSelectedWalletId(newWallet.id);
  };

  const handleCredit = (walletId: string, creditAmount: number, creditNote: string) => {
    setWallets(wallets.map(w =>
      w.id === walletId ? { ...w, balance: w.balance + creditAmount } : w
    ));
    // Add a credit entry to expenses list (negative = credit)
    const creditEntry: Expense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      uid: 'local_user',
      walletId,
      amount: -creditAmount, // negative marks it as a credit
      category: '💰 Credit',
      notes: creditNote || 'Money credited',
      date: format(new Date(), 'yyyy-MM-dd'),
      createdAt: new Date().toISOString()
    };
    setExpenses([creditEntry, ...expenses]);
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedWalletId) return;

    const parsedAmount = parseFloat(amount);

    const newExpense: Expense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      uid: 'local_user',
      walletId: selectedWalletId,
      amount: parsedAmount,
      category,
      notes,
      date: expenseDate,
      createdAt: new Date().toISOString()
    };

    setWallets(wallets.map(w => w.id === selectedWalletId ? { ...w, balance: w.balance - parsedAmount } : w));
    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setNotes('');
    setExpenseDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    if (expenseToDelete && expenseToDelete.walletId) {
      // Reverse the effect: if it was a credit (negative), subtract it back; if expense, add back
      setWallets(wallets.map(w =>
        w.id === expenseToDelete.walletId
          ? { ...w, balance: w.balance - expenseToDelete.amount }
          : w
      ));
    }
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteWallet = (id: string) => {
    setWallets(wallets.filter(w => w.id !== id));
    if (selectedWalletId === id) {
      const remaining = wallets.filter(w => w.id !== id);
      setSelectedWalletId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const totalToday = expenses
    .filter(e => e.date === format(new Date(), 'yyyy-MM-dd') && e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showCreditModal && wallets.length > 0 && (
        <CreditModal
          wallets={wallets}
          onClose={() => setShowCreditModal(false)}
          onCredit={handleCredit}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400">Expense Tracker</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreditModal(true)}
            disabled={wallets.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:scale-105"
          >
            <ArrowDownLeft size={18} strokeWidth={3} /> Credit Money
          </button>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur px-5 py-2.5 rounded-2xl shadow-sm border border-white/40 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Spent Today: </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 ml-2">${totalToday.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Wallets & Accounts Section */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <WalletIcon className="text-purple-500" size={24} /> My Wallets / Accounts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {wallets.map(wallet => (
            <div key={wallet.id} className="relative group p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-500" /> {wallet.name}
                </span>
                <button
                  onClick={() => deleteWallet(wallet.id)}
                  className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm"
                  title="Delete Wallet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
                ${wallet.balance.toFixed(2)}
              </div>
              {/* Quick Credit button per wallet */}
              <button
                onClick={() => { setShowCreditModal(true); }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowDownLeft size={13} /> Credit
              </button>
            </div>
          ))}

          <form onSubmit={addWallet} className="flex flex-col gap-3 p-5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl justify-center">
            <input
              type="text"
              placeholder="Wallet Name (e.g. Bank)"
              value={newWalletName}
              onChange={e => setNewWalletName(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Initial Amount"
                value={newWalletBalance}
                onChange={e => setNewWalletBalance(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-3 py-2 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <form onSubmit={addExpense} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40 dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <ArrowUpRight className="text-rose-500" size={20} />
          <span className="font-bold text-gray-700 dark:text-gray-300">Add Expense</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Amount</label>
            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-rose-500 rounded-2xl pl-12 pr-4 py-3 font-semibold focus:ring-4 focus:ring-rose-500/20 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-rose-500 rounded-2xl px-4 py-3 font-semibold focus:ring-4 focus:ring-rose-500/20 outline-none transition-all cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Wallet / Account</label>
            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-rose-500 rounded-2xl px-4 py-3 font-semibold focus:ring-4 focus:ring-rose-500/20 outline-none transition-all cursor-pointer disabled:opacity-50"
              required
              disabled={wallets.length === 0}
            >
              {wallets.length === 0 ? (
                <option value="">No wallets yet</option>
              ) : (
                wallets.map(wallet => (
                  <option key={wallet.id} value={wallet.id}>{wallet.name} (${wallet.balance.toFixed(2)})</option>
                ))
              )}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Date</label>
            <div className="relative group">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-rose-500 rounded-2xl pl-12 pr-4 py-3 font-semibold focus:ring-4 focus:ring-rose-500/20 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Notes (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was this for?"
            className="w-full bg-gray-50/80 dark:bg-gray-800/80 border border-transparent focus:border-rose-500 rounded-2xl px-5 py-3 font-medium focus:ring-4 focus:ring-rose-500/20 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        {wallets.length === 0 && (
          <div className="text-rose-500 text-sm font-bold px-2">
            * Please create a wallet above before adding an expense.
          </div>
        )}
        <button
          type="submit"
          disabled={wallets.length === 0}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/50 flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <Plus size={22} strokeWidth={3} /> Add Expense
        </button>
      </form>

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <PieChart className="text-rose-500" size={24} /> Recent Transactions
        </h3>
        {expenses.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur rounded-3xl border border-white/20 dark:border-gray-800">
            <p className="text-lg font-medium text-gray-500">No transactions recorded yet.</p>
          </div>
        ) : (
          expenses.map(expense => {
            const isCredit = expense.amount < 0;
            const catInfo = isCredit
              ? { icon: '💰', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' }
              : (CATEGORIES.find(c => c.name === expense.category) || CATEGORIES[CATEGORIES.length - 1]);
            const walletInfo = wallets.find(w => w.id === expense.walletId);
            return (
              <div
                key={expense.id}
                className="group flex items-center gap-5 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner", catInfo.color)}>
                  {catInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate flex items-center gap-2">
                      {isCredit ? 'Credit' : expense.category}
                      {walletInfo && (
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 px-2.5 py-1 rounded-md ml-2 border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                          <CreditCard size={12} /> {walletInfo.name}
                        </span>
                      )}
                    </h4>
                    <span className={cn(
                      "font-black text-lg px-3 py-1 rounded-xl",
                      isCredit
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                        : "text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                    )}>
                      {isCredit ? '+' : '-'}${Math.abs(expense.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-medium text-gray-500 truncate max-w-[60%] bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                      {expense.notes || 'No notes'}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
