import { useApp } from '../../contexts/AppContext';
import { 
  formatMonthYear, 
  formatDay,
  getCalendarDays,
  isToday,
  isInMonth,
  getNextMonth,
  getPrevMonth
} from '../../utils/dateUtils';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MonthView() {
  const { selectedDate, setSelectedDate, setCurrentView, weekStartsOn } = useApp();
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const calendarDays = getCalendarDays(year, month, weekStartsOn);

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
              <span className="text-2xl font-bold">{month}월</span>
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
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              년보기
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              주보기
            </button>
            <button 
              onClick={handleTodayClick}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
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
              <button className="text-sm text-gray-400">∨</button>
            </div>
            <textarea 
              className="w-full h-32 p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이번 달 메모..."
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">일정 목록</h3>
            <div className="text-sm text-gray-500">
              일정이 없습니다
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {WEEKDAYS.map((day, index) => (
                <div 
                  key={day}
                  className={`p-3 text-center font-semibold ${
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
            <div className="grid grid-cols-7">
              {weeks.map((week, weekIndex) => (
                week.map((date, dayIndex) => {
                  const inMonth = isInMonth(date, selectedDate);
                  const today = isToday(date);
                  
                  return (
                    <div 
                      key={`${weekIndex}-${dayIndex}`}
                      className="border-b border-r border-gray-200 min-h-[100px] p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleDateClick(date)}
                    >
                      <div className={`text-sm mb-1 ${
                        !inMonth ? 'text-gray-300' : 
                        today ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' :
                        dayIndex === 0 ? 'text-red-500' :
                        dayIndex === 6 ? 'text-blue-500' :
                        'text-gray-700'
                      }`}>
                        {formatDay(date)}
                      </div>
                      <div className="space-y-1">
                        {/* Event indicators will go here */}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
