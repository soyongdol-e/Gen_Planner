import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from './ui/textarea';
import type { Event } from '../types';
import { formatDate } from '../utils/dateUtils';
import { getDailyTasksByDate } from '../utils/storage';

interface MonthlySidebarProps {
  year: number;
  month: number;
  memo: string;
  onMemoChange: (memo: string) => void;
  events: Event[];
  onEventClick?: (event: Event) => void;
}

interface GroupedByDate {
  date: string;
  displayDate: string;
  events: Event[];
  tasks: Array<{ content: string; hour?: number }>;
}

export function MonthlySidebar({
  year,
  month,
  memo,
  onMemoChange,
  events,
  onEventClick,
}: MonthlySidebarProps) {
  const [isMemoExpanded, setIsMemoExpanded] = useState(true);
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);
  
  // Sort events by date, then by order
  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return (a.order ?? 0) - (b.order ?? 0);
  });
  
  // Split events into past and upcoming
  const upcomingEvents = sortedEvents.filter(event => event.date >= todayStr);
  const pastEvents = sortedEvents.filter(event => event.date < todayStr);
  
  // Determine which events to display
  const displayEvents = showPastEvents ? sortedEvents : upcomingEvents;
  
  // Group events and tasks by date
  const groupedByDate: GroupedByDate[] = [];
  
  // Collect all unique dates from events
  const dateSet = new Set<string>();
  displayEvents.forEach(event => {
    // Only add events that are all-day or don't have both start and end times
    // (This excludes Time Table events which always have startTime and endTime)
    if (event.isAllDay || !event.startTime || !event.endTime) {
      dateSet.add(event.date);
    }
  });
  
  // Also collect dates that have tasks (excluding Time Table tasks)
  // Get all tasks for the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const allTasks = getDailyTasksByDate(dateStr);
    const tasks = allTasks.filter(task => task.hour !== undefined); // Tasks WITH hour
    if (tasks.length > 0) {
      // Only add if it meets the display criteria (past or upcoming)
      if (showPastEvents || dateStr >= todayStr) {
        dateSet.add(dateStr);
      }
    }
  }
  
  // Sort dates and create grouped structure
  const sortedDates = Array.from(dateSet).sort();
  sortedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    
    // Get events for this date (excluding Time Table events)
    const eventsForDate = displayEvents.filter(event => {
      if (event.date !== dateStr) return false;
      // Exclude Time Table events (has startTime & endTime, not all-day)
      if (event.startTime && event.endTime && !event.isAllDay) return false;
      return true;
    });
    
    // Get tasks for this date (tasks WITH hour from Task Section)
    const allTasks = getDailyTasksByDate(dateStr);
    const tasks = allTasks.filter(task => task.hour !== undefined);
    
    // Only add if there are events or tasks
    if (eventsForDate.length > 0 || tasks.length > 0) {
      groupedByDate.push({ date: dateStr, displayDate, events: eventsForDate, tasks });
    }
  });
  
  return (
    <div className="w-80 border-r bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Monthly Memo */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <button
          onClick={() => setIsMemoExpanded(!isMemoExpanded)}
          className="flex items-center justify-between w-full mb-2"
        >
          <h3 className="font-semibold text-lg">Monthly Memo</h3>
          {isMemoExpanded ? (
            <ChevronUp className="size-5 text-gray-500" />
          ) : (
            <ChevronDown className="size-5 text-gray-500" />
          )}
        </button>
        
        {isMemoExpanded && (
          <Textarea
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            placeholder="이번 달의 메모를 작성하세요..."
            className="min-h-[120px] resize-none"
          />
        )}
      </div>
      
      {/* Events List */}
      <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">일정 목록</h3>
          {pastEvents.length > 0 && (
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPastEvents ? '지난 일정 숨기기' : '지난 일정보기'}
            </button>
          )}
        </div>
        <div className="space-y-2">
          {groupedByDate.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              일정이 없습니다
            </p>
          ) : (
            groupedByDate.map(group => {
              return (
                <div key={group.date} className="space-y-1 pb-3 border-b last:border-b-0">
                  {/* Date Header */}
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {group.displayDate}
                  </div>
                  
                  {/* Events */}
                  {group.events.map(event => {
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="flex items-start gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-pink-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900">{event.title}</div>
                          {event.startTime && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* Tasks */}
                  {group.tasks.map((task, idx) => {
                    return (
                      <div key={`${task.content}-${idx}`} className="flex items-start gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-green-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900">{task.content}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
