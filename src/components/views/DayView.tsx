import { useApp } from '../../contexts/AppContext';
import { 
  formatDay,
  getNextDay,
  getPrevDay
} from '../../utils/dateUtils';

export default function DayView() {
  const { selectedDate, setSelectedDate, setCurrentView } = useApp();

  const handlePrevDay = () => {
    setSelectedDate(getPrevDay(selectedDate));
  };

  const handleNextDay = () => {
    setSelectedDate(getNextDay(selectedDate));
  };

  const handleMonthClick = () => {
    setCurrentView('month');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={handlePrevDay}
            className="text-gray-400 hover:text-gray-600"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{formatDay(getPrevDay(selectedDate))}일</span>
            <span className="text-2xl font-bold">{formatDay(selectedDate)}일</span>
            <span className="text-gray-400">{formatDay(getNextDay(selectedDate))}일</span>
          </div>
          <button 
            onClick={handleNextDay}
            className="text-gray-400 hover:text-gray-600"
          >
            →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <button 
            onClick={handleMonthClick}
            className="text-blue-600 hover:underline mb-4"
          >
            {selectedDate.getMonth() + 1}월
          </button>
          <div className="text-sm text-gray-500">
            Mini Calendar (TODO)
          </div>
        </div>

        {/* Task Section */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Task</h3>
          <button className="w-full text-left text-sm text-gray-400 hover:text-gray-600">
            + 할 일 추가
          </button>
        </div>

        {/* TimeTable Section */}
        <div className="flex-1 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Time Table</h3>
          <div className="text-sm text-gray-500">
            TimeTable Grid (TODO)
          </div>
        </div>

        {/* Event Section */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Event</h3>
          <button className="w-full text-left text-sm text-gray-400 hover:text-gray-600">
            + 추가
          </button>
        </div>

        {/* Comment Section */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Comment</h3>
          <div className="text-sm text-gray-500">
            Comment Canvas (TODO)
          </div>
        </div>
      </div>
    </div>
  );
}
