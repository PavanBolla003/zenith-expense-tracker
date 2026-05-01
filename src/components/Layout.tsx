import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Flame, 
  Book, 
  Moon,
  Sun,
  Menu,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'journal', label: 'Journal', icon: Book },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-800 transition-transform lg:translate-x-0 lg:static lg:block shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col pt-8 pb-6 px-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <CheckSquare size={24} />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">Zenith</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300",
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 scale-105" 
                    : "text-gray-500 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-transparent flex items-center justify-between px-6 lg:px-10 z-10 w-full top-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-500 bg-white/50 backdrop-blur p-2 rounded-xl"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:block text-sm font-semibold text-gray-500 tracking-wide uppercase">
            Workspace
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-gray-800/60 rounded-xl transition-all shadow-sm backdrop-blur"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-900" />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:opacity-90 transition-opacity">
              Z
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 z-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
