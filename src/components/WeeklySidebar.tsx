import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import type { WeeklyChecklistItem } from '../types';
import { getMonthName, formatDate, getWeekStart } from '../utils/dateUtils';
import { cn } from './ui/utils';

interface WeeklySidebarProps {
  weekStart: Date;
  monthlyMemo: string;
  checklistItems: WeeklyChecklistItem[];
  onChecklistToggle: (itemId: string) => void;
  onChecklistAdd: (content: string) => void;
  onChecklistDelete: (itemId: string) => void;
  onMonthClick?: () => void;
  onWeekClick?: (weekStart: Date) => void;
}

export function WeeklySidebar({
  weekStart,
  monthlyMemo,
  checklistItems,
  onChecklistToggle,
  onChecklistAdd,
  onChecklistDelete,
  onMonthClick,
  onWeekClick,
}: WeeklySidebarProps) {
  const [isMonthlyMemoExpanded, setIsMonthlyMemoExpanded] = useState(true);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [miniCalendarDate, setMiniCalendarDate] = useState(weekStart);

  const year = weekStart.getFullYear();
  const month = weekStart.getMonth();

  const handleAddItem = () => {
    if (newChecklistItem.trim()) {
      onChecklistAdd(newChecklistItem.trim());
      setNewChecklistItem('');
      setIsAddingItem(false);
    }
  };

  // Mini Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const miniYear = miniCalendarDate.getFullYear();
  const miniMonth = miniCalendarDate.getMonth();
  const firstDay = getFirstDayOfMonth(miniYear, miniMonth);
  const daysInMonth = getDaysInMonth(miniYear, miniMonth);
  const daysInPrevMonth = miniMonth === 0 ? getDaysInMonth(miniYear - 1, 11) : getDaysInMonth(miniYear, miniMonth - 1);

  const miniDays: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = miniMonth === 0 ? 11 : miniMonth - 1;
    const prevYear = miniMonth === 0 ? miniYear - 1 : miniYear;
    miniDays.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    miniDays.push({
      date: new Date(miniYear, miniMonth, i),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 35 - miniDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = miniMonth === 11 ? 0 : miniMonth + 1;
    const nextYear = miniMonth === 11 ? miniYear + 1 : miniYear;
    miniDays.push({
      date: new Date(nextYear, nextMonth, i),
      isCurrentMonth: false,
    });
  }

  const handleMiniPrevMonth = () => {
    setMiniCalendarDate(new Date(miniYear, miniMonth - 1, 1));
  };

  const handleMiniNextMonth = () => {
    setMiniCalendarDate(new Date(miniYear, miniMonth + 1, 1));
  };

  const isWeekStartDate = (date: Date) => {
    return formatDate(date) === formatDate(weekStart);
  };

  return (
    <div className="w-80 border-r bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Mini Calendar */}
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleMiniPrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-semibold">
            {miniYear}년 {getMonthName(miniMonth)}
          </div>
          <button
            onClick={handleMiniNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div
              key={day}
              className={cn(
                'text-xs text-center font-medium',
                idx === 0 && 'text-red-500',
                idx === 6 && 'text-blue-500'
              )}
            >
              {day}
            </div>
          ))}

          {miniDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Always navigate to the Sunday of the week containing the clicked date
                const weekStartDate = getWeekStart(day.date, 0); // 0 = Sunday
                onWeekClick?.(weekStartDate);
              }}
              className={cn(
                'text-xs text-center py-1 rounded hover:bg-gray-100',
                isWeekStartDate(day.date) && 'bg-teal-500 text-white hover:bg-teal-600',
                !day.isCurrentMonth && 'text-gray-300',
                day.isCurrentMonth && !isWeekStartDate(day.date) && idx % 7 === 0 && 'text-red-500',
                day.isCurrentMonth && !isWeekStartDate(day.date) && idx % 7 === 6 && 'text-blue-500'
              )}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Memo */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <button
          onClick={() => setIsMonthlyMemoExpanded(!isMonthlyMemoExpanded)}
          className="flex items-center justify-between w-full mb-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMonthClick?.();
            }}
            className="font-semibold text-lg text-blue-600 hover:underline"
          >
            {year}년 {getMonthName(month)}
          </button>
          {isMonthlyMemoExpanded ? (
            <ChevronUp className="size-5 text-gray-500" />
          ) : (
            <ChevronDown className="size-5 text-gray-500" />
          )}
        </button>

        {isMonthlyMemoExpanded && (
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {monthlyMemo || '월별 메모가 없습니다'}
          </div>
        )}
      </div>

      {/* Weekly Checklist */}
      <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
        <h3 className="font-semibold text-lg mb-3">Weekly Checklist</h3>

        <div className="space-y-2">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-start gap-2 group">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onChecklistToggle(item.id)}
                className="mt-1 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                >
                  {item.content}
                </span>
              </div>
              <button
                onClick={() => onChecklistDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                title="삭제"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}

          {isAddingItem ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                  if (e.key === 'Escape') {
                    setIsAddingItem(false);
                    setNewChecklistItem('');
                  }
                }}
                placeholder="체크리스트 항목..."
                className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button size="sm" onClick={handleAddItem}>
                추가
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>항목 추가</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
