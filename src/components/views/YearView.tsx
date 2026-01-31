import { useApp } from '../../contexts/AppContext';

export default function YearView() {
  const { selectedDate, setSelectedDate, setCurrentView } = useApp();
  const year = selectedDate.getFullYear();

  const handleMonthClick = (month: number) => {
    const newDate = new Date(year, month, 1);
    setSelectedDate(newDate);
    setCurrentView('month');
  };

  const months = [
    '1월', '2월', '3월', '4월',
    '5월', '6월', '7월', '8월',
    '9월', '10월', '11월', '12월'
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            ← {year - 1}
          </button>
          <span className="text-2xl font-bold">{year}</span>
          <button className="text-gray-400 hover:text-gray-600">
            {year + 1} →
          </button>
        </div>
      </div>

      {/* Year Grid */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
          {months.map((month, index) => (
            <div
              key={month}
              onClick={() => handleMonthClick(index)}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{month}</h3>
              <div className="text-sm text-gray-500">
                Mini calendar (TODO)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
