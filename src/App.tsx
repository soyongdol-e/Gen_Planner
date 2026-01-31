import { AppProvider, useApp } from './contexts/AppContext';
import MonthView from './components/views/MonthView';
import DayView from './components/views/DayView';
import YearView from './components/views/YearView';
import WeekView from './components/views/WeekView';

function AppContent() {
  const { currentView } = useApp();

  return (
    <>
      {currentView === 'year' && <YearView />}
      {currentView === 'month' && <MonthView />}
      {currentView === 'week' && <WeekView />}
      {currentView === 'day' && <DayView />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
