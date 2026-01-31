import { useApp } from '../../contexts/AppContext';

export default function WeekView() {
  const { selectedDate } = useApp();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">←</button>
          <span className="text-2xl font-bold">Week View (TODO)</span>
          <button className="text-gray-400 hover:text-gray-600">→</button>
        </div>
      </div>

      {/* Week Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-500">Week View - Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
