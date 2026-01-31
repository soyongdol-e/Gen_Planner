import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { WeeklyChecklistItem } from '../types';
import { formatDate, getMonthName, startOfWeek } from '../utils/dateUtils';
import { cn } from './ui/utils';

interface DailySidebarProps {
  currentDate: Date;
  monthlyMemo: string;
  weeklyMemo: string;
  checklistItems: WeeklyChecklistItem[];
  onChecklistToggle: (itemId: string) => void;
  onMonthClick?: () => void;
  onWeekClick?: (weekStart: Date) => void;
  onDateClick: (date: Date) => void;
}

export function DailySidebar({
  currentDate,
  monthlyMemo,
  weeklyMemo,
  checklistItems,
  onChecklistToggle,
  onMonthClick,
  onWeekClick,
  onDateClick,
}: DailySidebarProps) {
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate mini calendar days for current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = month === 0 ? getDaysInMonth(year - 1, 11) : getDaysInMonth(year, month - 1);

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 35 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    days.push({
      date: new Date(nextYear, nextMonth, i),
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    onDateClick(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateClick(new Date(year, month + 1, 1));
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return formatDate(d) === formatDate(today);
  };

  const isSelectedDate = (d: Date) => {
    return formatDate(d) === formatDate(currentDate);
  };

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full overflow-hidden">
      {/* Header with View Buttons */}
      <div className="p-4 border-b space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMonthClick}
            className="flex-1"
          >
            월보기
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekClick?.(startOfWeek(currentDate))}
            className="flex-1"
          >
            주보기
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mini Calendar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-body-sm-bold">
              {year}년 {getMonthName(month)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>

          {showMiniCalendar && (
            <div>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                  <div
                    key={day}
                    className={cn(
                      'text-body-xs text-center font-medium',
                      idx === 0 && 'text-red-500',
                      idx === 6 && 'text-blue-500'
                    )}
                  >
                    {day}
                  </div>
                ))}

                {days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => onDateClick(day.date)}
                    className={cn(
                      'text-body-xs text-center py-1 rounded hover:bg-gray-100',
                      isSelectedDate(day.date) && 'bg-teal-500 text-white hover:bg-teal-600',
                      !isSelectedDate(day.date) && isToday(day.date) && 'bg-teal-100',
                      !day.isCurrentMonth && 'text-gray-300',
                      day.isCurrentMonth && !isSelectedDate(day.date) && idx % 7 === 0 && 'text-red-500',
                      day.isCurrentMonth && !isSelectedDate(day.date) && idx % 7 === 6 && 'text-blue-500'
                    )}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Memo */}
        <div className="space-y-2">
          <h3 className="text-body-sm-bold">Monthly Memo</h3>
          <Textarea
            value={monthlyMemo}
            readOnly
            placeholder="월 메모 없음"
            className="text-body-xs resize-none min-h-[80px] bg-gray-50"
          />
        </div>

        {/* Weekly Memo */}
        <div className="space-y-2">
          <h3 className="text-body-sm-bold">Weekly Memo</h3>
          <Textarea
            value={weeklyMemo}
            readOnly
            placeholder="주 메모 없음"
            className="text-body-xs resize-none min-h-[80px] bg-gray-50"
          />
        </div>

        {/* Weekly Checklist */}
        <div className="space-y-2">
          <h3 className="text-body-sm-bold">Weekly Checklist</h3>
          <div className="space-y-1">
            {checklistItems.length === 0 ? (
              <p className="text-body-xs text-gray-400">체크리스트 없음</p>
            ) : (
              checklistItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2 text-body-xs">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onChecklistToggle(item.id)}
                    className="mt-0.5"
                  />
                  <span className={cn(item.completed && 'line-through text-gray-400')}>
                    {item.content}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
