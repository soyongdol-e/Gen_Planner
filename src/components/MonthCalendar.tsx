import type { Event } from '../types';
import {
  getCalendarDays,
  getWeekDays,
  isSameDay,
  getToday,
  isSunday,
  isSaturday,
  formatDate,
} from '../utils/dateUtils';
import { getDailyTasksByDate } from '../utils/storage';
import { cn } from './ui/utils';
import { Plus, Pencil } from 'lucide-react';

interface MonthCalendarProps {
  year: number;
  month: number;
  events: Event[];
  onDateClick?: (date: Date) => void;
  onWeekClick?: (weekStart: Date) => void;
  onEventAdd?: (date: Date) => void;
  onEventEdit?: (date: Date) => void;
}

export function MonthCalendar({
  year,
  month,
  events,
  onDateClick,
  onWeekClick,
  onEventAdd,
  onEventEdit,
}: MonthCalendarProps) {
  const weekDays = getWeekDays('ko-KR');
  const calendarDays = getCalendarDays(year, month);
  const today = getToday();
  
  // Group calendar days into weeks
  const weeks: typeof calendarDays[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  // Get events for a specific date
  const getEventsForDate = (date: Date): Event[] => {
    const dateStr = formatDate(date);
    return events
      .filter((event) => {
        if (event.date !== dateStr) return false;
        // Exclude Time Table events (has startTime & endTime, not all-day)
        if (event.startTime && event.endTime && !event.isAllDay) return false;
        return true;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Sort by order
  };
  
  return (
    <div className="flex-1 p-3 md:p-6 overflow-auto">
      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)] border-b">
          <div className="w-4 md:w-8" /> {/* Space for week selector */}
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={cn(
                'text-center py-2 md:py-3 text-body-xs md:text-body-sm',
                index === 0 && 'text-red-500', // Sunday
                index === 6 && 'text-blue-500' // Saturday
              )}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-[auto_repeat(7,1fr)] border-b last:border-b-0"
          >
            {/* Week Selector */}
            <button
              onClick={() => onWeekClick?.(week[0].date)}
              className="w-4 md:w-8 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center border-r"
              title="이 주 보기"
            >
              <div className="w-0.5 md:w-1 h-full bg-gray-400 hover:bg-gray-600 transition-colors" />
            </button>
            
            {/* Days */}
            {week.map((day, dayIndex) => {
              const isToday = isSameDay(day.date, today);
              const dayEvents = getEventsForDate(day.date);
              
              // Get tasks for this date (tasks WITH hour from Task Section)
              const dateStr = formatDate(day.date);
              const allTasks = getDailyTasksByDate(dateStr);
              const tasksWithHour = allTasks.filter(task => task.hour !== undefined);
              
              const hasEvent = dayEvents.length > 0;
              const hasTask = tasksWithHour.length > 0;
              
              // Determine how many lines to show for each type
              let eventLinesToShow = 0;
              let taskLinesToShow = 0;
              let eventRemainingCount = 0;
              let taskRemainingCount = 0;
              
              if (hasEvent && hasTask) {
                // Both exist: 2 events + 2 tasks
                eventLinesToShow = Math.min(dayEvents.length, 2);
                taskLinesToShow = Math.min(tasksWithHour.length, 2);
                eventRemainingCount = Math.max(0, dayEvents.length - 2);
                taskRemainingCount = Math.max(0, tasksWithHour.length - 2);
              } else if (hasEvent) {
                // Only events: show up to 4
                eventLinesToShow = Math.min(dayEvents.length, 4);
                eventRemainingCount = Math.max(0, dayEvents.length - 4);
              } else if (hasTask) {
                // Only tasks: show up to 4
                taskLinesToShow = Math.min(tasksWithHour.length, 4);
                taskRemainingCount = Math.max(0, tasksWithHour.length - 4);
              }
              
              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'min-h-[70px] md:min-h-[130px] p-1 md:p-2 border-r last:border-r-0 transition-colors',
                    'flex flex-col items-start relative group',
                    !day.isCurrentMonth && 'bg-gray-50'
                  )}
                >
                  {/* Main cell button */}
                  <button
                    onClick={() => onDateClick?.(day.date)}
                    className="w-full h-full absolute inset-0 hover:bg-gray-50"
                  />
                  
                  {/* Content (above the button) */}
                  <div className="relative z-10 pointer-events-none w-full">
                    {/* Date Number */}
                    <div
                      className={cn(
                        'w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full text-body-xs md:text-body-sm font-medium',
                        isToday && 'bg-teal-400 text-white',
                        !isToday && day.isCurrentMonth && 'text-gray-900',
                        !isToday && !day.isCurrentMonth && 'text-gray-400',
                        !isToday && day.isCurrentMonth && isSunday(day.date) && 'text-red-500',
                        !isToday && day.isCurrentMonth && isSaturday(day.date) && 'text-blue-500'
                      )}
                    >
                      {day.date.getDate()}
                    </div>
                    
                    {/* Event and Task Indicators (up to 4 lines) */}
                    <div className="flex flex-col gap-0.5 mt-1 md:mt-2 w-full">
                      {/* Event Lines (분홍색) */}
                      {Array.from({ length: eventLinesToShow }).map((_, index) => {
                        const event = dayEvents[index];
                        const isLastEventLine = index === eventLinesToShow - 1;
                        const showEventRemaining = isLastEventLine && eventRemainingCount > 0;
                        
                        return (
                          <div key={`event-${index}`} className="flex items-center gap-1">
                            <div
                              className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-pink-500 flex-shrink-0"
                            />
                            <span className="text-[8px] md:text-[10px] text-gray-600 truncate flex-1 text-left">
                              {event.title}
                            </span>
                            {showEventRemaining && (
                              <div className="text-[8px] md:text-[10px] text-gray-500 flex-shrink-0">
                                +{eventRemainingCount}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Task Lines (초록색) */}
                      {Array.from({ length: taskLinesToShow }).map((_, index) => {
                        const task = tasksWithHour[index];
                        const isLastTaskLine = index === taskLinesToShow - 1;
                        const showTaskRemaining = isLastTaskLine && taskRemainingCount > 0;
                        
                        return (
                          <div key={`task-${index}`} className="flex items-center gap-1">
                            <div
                              className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 flex-shrink-0"
                            />
                            <span className="text-[8px] md:text-[10px] text-gray-600 truncate flex-1 text-left">
                              {task.content}
                            </span>
                            {showTaskRemaining && (
                              <div className="text-[8px] md:text-[10px] text-gray-500 flex-shrink-0">
                                +{taskRemainingCount}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Add Event Button (hover) */}
                  <div className="absolute top-1 right-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    {onEventAdd && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventAdd(day.date);
                        }}
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-1 md:p-1.5"
                        title="이벤트 추가"
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    )}
                    {onEventEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventEdit(day.date);
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 md:p-1.5"
                        title="이벤트 편집"
                      >
                        <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
