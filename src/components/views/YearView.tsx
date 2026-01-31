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
    
    // Check if we need to remove the last week (all next month days)
    const totalDays = days.length;
    const weeksNeeded = Math.ceil(totalDays / 7);
    const targetDays = weeksNeeded * 7;
    
    // Next month days to fill grid
    const remainingDays = targetDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? currentYear + 1 : currentYear;
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }
    
    // Remove last week if all days are from next month
    const lastWeekStart = days.length - 7;
    const lastWeekAllNextMonth = days.slice(lastWeekStart).every(d => !d.isCurrentMonth);
    if (lastWeekAllNextMonth && days.length > 7) {
      days.splice(lastWeekStart, 7);
    }
    
    return (
      <div
        onClick={() => onMonthClick?.(currentYear, month)}
        className="w-[350px] h-[230px] rounded-[14px] hover:bg-gray-50 transition-colors cursor-pointer p-4"
      >
        {/* Month Title - 24px, Pretendard 700, #111111, Center aligned */}
        <h3 className="text-[24px] font-bold leading-[150%] mb-1 text-center" style={{ color: '#111111' }}>
          {month + 1}월
        </h3>
        
        {/* Week day headers - 17px, Pretendard 500 */}
        <div className="grid grid-cols-7 gap-x-2 mb-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div
              key={day}
              className={cn(
                'text-[17px] font-medium leading-[150%] text-center',
                idx === 0 && 'text-[#FF5B45]',
                idx === 6 && 'text-[#358BFB]',
                idx > 0 && idx < 6 && 'text-[#505050]'
              )}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Divider Line - 350px width, 2px thickness, rounded ends, #E2E2E2 */}
        <div className="w-full h-[2px] bg-[#E2E2E2] rounded-full mb-1" />
        
        {/* Calendar days - 17px, Pretendard 600, 6px vertical gap between weeks */}
        <div className="grid grid-cols-7 gap-x-2 gap-y-[6px]">
          {days.map((day, idx) => {
            const isToday = isSameDay(day.date, today);
            const hasEvents = getEventsForDate(day.date).length > 0;
            
            return (
              <div
                key={idx}
                className={cn(
                  'text-[17px] font-semibold leading-[150%] text-center relative flex items-center justify-center',
                  isToday && 'text-gray-900',
                  !isToday && day.isCurrentMonth && day.date.getDay() === 0 && 'text-[#FF5B45]',
                  !isToday && day.isCurrentMonth && day.date.getDay() === 6 && 'text-[#358BFB]',
                  !isToday && day.isCurrentMonth && day.date.getDay() > 0 && day.date.getDay() < 6 && 'text-[#505050]',
                  !day.isCurrentMonth && 'text-[#999999]'
                )}
              >
                {/* Today highlight circle - 26×26px, #C7F1D4 */}
                {isToday && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[26px] h-[26px] rounded-full" style={{ backgroundColor: '#C7F1D4' }} />
                  </div>
                )}
                
                {/* Date number */}
                <span className="relative z-10">
                  {day.date.getDate()}
                </span>
                
                {/* Event indicator */}
                {hasEvents && !isToday && (
                  <div className="absolute bottom-0 w-1 h-1 bg-gray-400 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navigation */}
      <div className="flex items-center justify-center pt-[30px] pb-6">
        {/* Previous Year - Pretendard Medium */}
        <div
          onClick={() => handleYearClick(prevYear)}
          className="text-[36px] font-medium leading-[150%] transition-colors hover:text-[#505050] cursor-pointer"
          style={{ color: '#E2E2E2' }}
        >
          {prevYear}
        </div>
        
        {/* Left Arrow Icon - 40px gap from previous year */}
        <div
          onClick={handlePrevYear}
          className="ml-[40px] transition-colors hover:text-[#505050] cursor-pointer"
        >
          <ChevronLeft 
            className="size-8" 
            style={{ color: '#999999' }} 
          />
        </div>
        
        {/* Current Year - Pretendard Extrabold - 120px gap from arrow */}
        <div className="text-[60px] font-extrabold leading-[150%] mx-[120px]">
          {currentYear}
        </div>
        
        {/* Right Arrow Icon - 120px gap from current year */}
        <div
          onClick={handleNextYear}
          className="transition-colors hover:text-[#505050] cursor-pointer"
        >
          <ChevronRight 
            className="size-8" 
            style={{ color: '#999999' }} 
          />
        </div>
        
        {/* Next Year - Pretendard Medium - 40px gap from arrow */}
        <div
          onClick={() => handleYearClick(nextYear)}
          className="ml-[40px] text-[36px] font-medium leading-[150%] transition-colors hover:text-[#505050] cursor-pointer"
          style={{ color: '#E2E2E2' }}
        >
          {nextYear}
        </div>
      </div>
      
      {/* 12 Month Grid */}
      <div className="flex-1 overflow-auto px-[192px] py-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-4 gap-x-[44px] gap-y-[40px]">
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
