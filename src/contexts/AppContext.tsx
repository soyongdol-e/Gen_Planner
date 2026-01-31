import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ViewType } from '../types';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  weekStartsOn: 0 | 1;
  timeTableUnit: 5 | 10 | 15 | 30;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStartsOn] = useState<0 | 1>(0); // Sunday = 0, Monday = 1
  const [timeTableUnit] = useState<5 | 10 | 15 | 30>(10); // Default 10 minutes

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedDate,
        setSelectedDate,
        weekStartsOn,
        timeTableUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
