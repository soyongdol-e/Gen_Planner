import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  formatDay,
  formatDate,
  getCalendarDays,
  isToday,
  isInMonth,
  getNextMonth,
  getPrevMonth
} from '../../utils/dateUtils';
import { getEventsByMonth } from '../../utils/eventApi';
import { getMonthlyMemo, saveMonthlyMemo } from '../../utils/memoApi';
import { useAutoSave } from '../../hooks/useAutoSave';
import type { Event } from '../../types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MonthView() {
  const { selectedDate, setSelectedDate, setCurrentView, weekStartsOn } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({});
  const [memoContent, setMemoContent] = useState('');
  const [memoCollapsed, setMemoCollapsed] = useState(false);
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const calendarDaysData = getCalendarDays(year, month, weekStartsOn);
  const calendarDays = calendarDaysData.map(day => day.date);

  // Load events and memo when month changes
  useEffect(() => {
    loadEvents();
    loadMemo();
  }, [year, month]);

  const loadEvents = async () => {
    const fetchedEvents = await getEventsByMonth(year, month + 1);
    setEvents(fetchedEvents);
    
    // Group events by date
    const grouped: Record<string, Event[]> = {};
    fetchedEvents.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    setEventsByDate(grouped);
  };

  const loadMemo = async () => {
    const memo = await getMonthlyMemo(year, month + 1);
    setMemoContent(memo?.content || '');
  };

  // Auto-save memo
  const handleSaveMemo = useCallback(async (content: string) => {
    await saveMonthlyMemo(year, month + 1, content);
  }, [year, month]);

  useAutoSave(memoContent, handleSaveMemo, 500);

  const handlePrevMonth = () => {
    setSelectedDate(getPrevMonth(selectedDate));
  };

  const handleNextMonth = () => {
    setSelectedDate(getNextMonth(selectedDate));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  const handleYearClick = () => {
    setCurrentView('year');
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleWeekClick = (weekFirstDay: Date) => {
    setSelectedDate(weekFirstDay);
    setCurrentView('week');
  };

  // Group days by weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Year (clickable) */}
          <button 
            onClick={handleYearClick}
            className="text-gray-600 hover:text-gray-900 hover:underline"
          >
            {year}년
          </button>

          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevMonth}
              className="text-gray-400 hover:text-gray-600"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{month - 1}월</span>
              <span className="text-heading-lg">{month}월</span>
              <span className="text-gray-400">{month + 1}월</span>
            </div>
            <button 
              onClick={handleNextMonth}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="px-3 py-1 text-body-sm border border-gray-300 rounded hover:bg-gray-50">
              년보기
            </button>
            <button className="px-3 py-1 text-body-sm border border-gray-300 rounded hover:bg-gray-50">
              주보기
            </button>
            <button 
              onClick={handleTodayClick}
              className="px-3 py-1 text-body-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              오늘
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Monthly Memo</h3>
              <button 
                onClick={() => setMemoCollapsed(!memoCollapsed)}
                className="text-body-sm text-gray-400 hover:text-gray-600"
              >
                {memoCollapsed ? '∧' : '∨'}
              </button>
            </div>
            {!memoCollapsed && (
              <textarea 
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                className="w-full h-32 p-2 text-body-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이번 달 메모..."
              />
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">일정 목록</h3>
            {events.length === 0 ? (
              <div className="text-body-sm text-gray-500">
                일정이 없습니다
              </div>
            ) : (
              <div className="space-y-1">
                {events.slice(0, 10).map(event => (
                  <div key={event.id} className="text-body-sm flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-gray-700 truncate">
                      {event.date.split('-')[2]}일 - {event.title}
                    </span>
                  </div>
                ))}
                {events.length > 10 && (
                  <div className="text-body-xs text-gray-400">
                    +{events.length - 10}개 더보기
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              {/* Week number column header */}
              <div className="p-3 text-center text-gray-400 text-body-xs">
                주
              </div>
              {WEEKDAYS.map((day, index) => (
                <div 
                  key={day}
                  className={`p-3 text-center ${
                    index === 0 ? 'text-red-500' : 
                    index === 6 ? 'text-blue-500' : 
                    'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-8">
                  {/* Week selection button */}
                  <div 
                    onClick={() => handleWeekClick(week[0])}
                    className="border-b border-r border-gray-200 p-2 flex items-center justify-center cursor-pointer hover:bg-blue-50 group"
                  >
                    <button className="text-body-xs text-gray-400 group-hover:text-blue-600 font-medium">
                      주보기
                    </button>
                  </div>
                  
                  {/* Week days */}
                  {week.map((date, dayIndex) => {
                    const inMonth = isInMonth(date, selectedDate);
                    const today = isToday(date);
                    const dateStr = formatDate(date);
                    const dayEvents = eventsByDate[dateStr] || [];
                    const allDayEvents = dayEvents.filter(e => e.isAllDay);
                    
                    return (
                      <div 
                        key={`${weekIndex}-${dayIndex}`}
                        className="border-b border-r border-gray-200 min-h-[100px] p-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleDateClick(date)}
                        >
                        <div className={`text-body-sm mb-1 ${
                          !inMonth ? 'text-gray-300' : 
                          today ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' :
                          dayIndex === 0 ? 'text-red-500' :
                          dayIndex === 6 ? 'text-blue-500' :
                          'text-gray-700'
                        }`}>
                          {formatDay(date)}
                        </div>
                        
                        {/* Event Indicators */}
                        {inMonth && allDayEvents.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {allDayEvents.slice(0, 3).map(event => (
                              <div
                                key={event.id}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: event.color }}
                                title={event.title}
                              />
                            ))}
                            {allDayEvents.length > 3 && (
                              <span className="text-body-xs text-gray-400">
                                +{allDayEvents.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
