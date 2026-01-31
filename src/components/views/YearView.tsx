import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '../../types';
import {
  getToday,
  isSameDay,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
} from '../../utils/dateUtils';
import { getEvents } from '../../utils/storage';
import { cn } from '../ui/utils';

interface YearViewProps {
  onMonthClick?: (year: number, month: number) => void;
}

export function YearView({ onMonthClick }: YearViewProps) {
  const [currentYear, setCurrentYear] = useState(getToday().getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    setEvents(getEvents());
  }, []);
  
  const today = getToday();
  const prevYear = currentYear - 1;
  const nextYear = currentYear + 1;
  
  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };
  
  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };
  
  const handleYearClick = (year: number) => {
    setCurrentYear(year);
  };
  
  // Get events for a specific date
  const getEventsForDate = (date: Date): Event[] => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };
  
  // Render mini calendar for a month
  const renderMiniMonth = (month: number) => {
    const firstDay = getFirstDayOfMonth(currentYear, month);
    const daysInMonth = getDaysInMonth(currentYear, month);
    const daysInPrevMonth = month === 0 
      ? getDaysInMonth(currentYear - 1, 11) 
      : getDaysInMonth(currentYear, month - 1);
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? currentYear - 1 : currentYear;
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Next month days to fill grid
    const remainingDays = 35 - days.length; // 5 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? currentYear + 1 : currentYear;
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }
    
    return (
      <button
        onClick={() => onMonthClick?.(currentYear, month)}
        className="w-full text-left"
      >
        <h3 className="text-heading-sm mb-4 text-center text-gray-900">
          {month + 1}월
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers - abbreviated */}
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div
              key={day}
              className={cn(
                'text-body-xs text-center font-medium mb-1',
                idx === 0 && 'text-[#FF5B45]',
                idx === 6 && 'text-[#358BFB]',
                idx > 0 && idx < 6 && 'text-gray-900'
              )}
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, idx) => {
            const isToday = isSameDay(day.date, today);
            const hasEvents = getEventsForDate(day.date).length > 0;
            
            return (
              <div
                key={idx}
                className={cn(
                  'text-body-xs text-center py-1',
                  isToday && 'bg-black text-white rounded-full font-semibold',
                  !isToday && day.isCurrentMonth && 'text-gray-900',
                  !isToday && !day.isCurrentMonth && 'text-gray-300',
                  !isToday && day.isCurrentMonth && day.date.getDay() === 0 && 'text-[#FF5B45]',
                  !isToday && day.isCurrentMonth && day.date.getDay() === 6 && 'text-[#358BFB]'
                )}
              >
                {day.date.getDate()}
                {hasEvents && !isToday && (
                  <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </button>
    );
  };
  
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 px-6 py-8 border-b">
        <button
          onClick={handlePrevYear}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ChevronLeft className="size-6" />
        </button>
        
        <button
          onClick={() => handleYearClick(prevYear)}
          className="text-heading-lg text-gray-300 hover:text-gray-400 transition-colors px-4"
        >
          {prevYear}
        </button>
        
        <div className="text-display-lg px-8">
          {currentYear}
        </div>
        
        <button
          onClick={() => handleYearClick(nextYear)}
          className="text-heading-lg text-gray-300 hover:text-gray-400 transition-colors px-4"
        >
          {nextYear}
        </button>
        
        <button
          onClick={handleNextYear}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
      
      {/* 12 Month Grid */}
      <div className="flex-1 overflow-auto p-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-12">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}>
                {renderMiniMonth(i)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
