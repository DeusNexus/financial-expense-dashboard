// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Common/Sidebar.jsx';
import DashboardPage from './components/Dashboard/DashboardPage.jsx';
import ExpensesPage from './components/Expenses/ExpensesPage.jsx';
import RecurringExpensesPage from './components/Recurring/RecurringExpensesPage.jsx';
import PlannedExpensesPage from './components/Planned/PlannedExpensesPage.jsx';
import GoalsPage from './components/Goals/GoalsPage.jsx';
import ImportExportPage from './components/ImportExport/ImportExportPage.jsx';
import SettingsModal from './components/Settings/SettingsModal.jsx';
import OnboardingTour from './components/Common/OnboardingTour.jsx';
import './styles/App.css';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is new (no data in localStorage)
    const hasExistingData = localStorage.getItem('expenseTrackerData');
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (!hasExistingData && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onSettingsClick={() => setShowSettings(true)}
          />
          
          <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/recurring" element={<RecurringExpensesPage />} />
              <Route path="/planned" element={<PlannedExpensesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/import-export" element={<ImportExportPage />} />
            </Routes>
          </main>

          {showOnboarding && (
            <OnboardingTour onComplete={handleOnboardingComplete} />
          )}

          {showSettings && (
            <SettingsModal 
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;