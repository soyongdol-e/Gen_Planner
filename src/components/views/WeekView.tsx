import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  formatDate, 
  formatDay,
  getWeekStart,
  getWeekDays
} from '../../utils/dateUtils';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeekView() {
  const { selectedDate, setSelectedDate, setCurrentView, weekStartsOn } = useApp();
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(selectedDate, weekStartsOn));
  const [weekDays, setWeekDays] = useState<Date[]>(getWeekDays(weekStart));

  // Update week when selectedDate changes
  useEffect(() => {
    const newWeekStart = getWeekStart(selectedDate, weekStartsOn);
    setWeekStart(newWeekStart);
    setWeekDays(getWeekDays(newWeekStart));
  }, [selectedDate, weekStartsOn]);

  const handlePrevWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleMonthClick = () => {
    setCurrentView('month');
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  // Format week range for display
  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const startMonth = weekStart.getMonth() + 1;
    const startDay = weekStart.getDate();
    const endMonth = weekEnd.getMonth() + 1;
    const endDay = weekEnd.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth}/${startDay}-${endDay}`;
    } else {
      return `${startMonth}/${startDay}-${endMonth}/${endDay}`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleMonthClick}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            월 달력
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevWeek}
              className="text-gray-600 hover:text-gray-900 text-xl"
            >
              ←
            </button>
            <span className="text-xl font-bold">
              {formatWeekRange()}
            </span>
            <button
              onClick={handleNextWeek}
              className="text-gray-600 hover:text-gray-900 text-xl"
            >
              →
            </button>
          </div>
          
          <div className="w-24"></div>
        </div>
      </div>

      {/* Week Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Week Days Grid */}
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const isToday = formatDate(day) === formatDate(new Date());
              const dayOfWeek = day.getDay();
              
              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    isToday ? 'bg-blue-50 border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                >
                  <div className={`text-xs mb-1 ${
                    dayOfWeek === 0 ? 'text-red-500' : 
                    dayOfWeek === 6 ? 'text-blue-500' : 
                    'text-gray-600'
                  }`}>
                    {WEEKDAYS[dayOfWeek]}
                  </div>
                  <div className={`text-2xl font-semibold ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {formatDay(day)}
                  </div>
                  
                  {/* Placeholder for events */}
                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-gray-400">일정 표시 예정</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Weekly Memo */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Weekly Memo</h3>
            <textarea
              placeholder="이번 주 메모..."
              className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
