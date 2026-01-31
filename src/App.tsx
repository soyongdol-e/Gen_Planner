import { useState, useEffect } from "react";
import { MonthView } from "./components/MonthView";
import YearView from "./components/views/YearView";
import WeekView from "./components/views/WeekView";
import DayView from "./components/views/DayView";
import type { ViewType } from "./types";
import { initializeSampleData } from "./utils/sampleData";

export default function App() {
  const [currentView, setCurrentView] =
    useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(),
  );

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);

  const handleYearClick = () => {
    setCurrentView("year");
  };

  const handleMonthClick = (year?: number, month?: number) => {
    if (year !== undefined && month !== undefined) {
      setSelectedDate(new Date(year, month, 1));
    }
    setCurrentView("month");
  };

  const handleWeekClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView("week");
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView("day");
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      {currentView === "year" && (
        <YearView onMonthClick={handleMonthClick} />
      )}

      {currentView === "month" && (
        <MonthView
          onYearClick={handleYearClick}
          onWeekClick={handleWeekClick}
          onDayClick={handleDayClick}
        />
      )}

      {currentView === "week" && (
        <WeekView
          initialDate={selectedDate}
          onMonthClick={() => handleMonthClick()}
          onDayClick={handleDayClick}
        />
      )}

      {currentView === "day" && (
        <DayView
          initialDate={selectedDate}
          onMonthClick={() => handleMonthClick()}
        />
      )}
    </div>
  );
}
