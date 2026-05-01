import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { HabitTracker } from './components/HabitTracker';
import { Journal } from './components/Journal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'expenses': return <ExpenseTracker />;
      case 'habits': return <HabitTracker />;
      case 'journal': return <Journal />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
