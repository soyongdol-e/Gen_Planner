import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { NavigationBar } from '../NavigationBar';
import { DailySidebar } from '../DailySidebar';
import { TaskSection } from '../TaskSection';
import { TimeTableSection } from '../TimeTableSection';
import { EventSection } from '../EventSection';
import { CommentSection } from '../CommentSection';
import type { Event, DailyTask, DailyComment, CommentElement, WeeklyChecklistItem } from '../../types';
import {
  formatDate,
  addDays,
  startOfWeek,
  getToday,
} from '../../utils/dateUtils';
import {
  getEventsByDate,
  addEvent,
  updateEvent,
  deleteEvent,
  getDailyTasksByDate,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
  getDailyComment,
  saveDailyComment,
  getMonthlyMemo,
  getWeeklyMemo,
  getWeeklyChecklistByWeek,
  updateWeeklyChecklistItem,
} from '../../utils/storage';

interface DayViewProps {
  initialDate?: Date;
  onMonthClick?: () => void;
  onWeekClick?: (weekStart: Date) => void;
}

export function DayView({ initialDate, onMonthClick, onWeekClick }: DayViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || getToday());
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [commentElements, setCommentElements] = useState<CommentElement[]>([]);
  const [monthlyMemo, setMonthlyMemo] = useState('');
  const [weeklyMemo, setWeeklyMemo] = useState('');
  const [checklistItems, setChecklistItems] = useState<WeeklyChecklistItem[]>([]);
  
  const dateStr = formatDate(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  
  // Load data when date changes
  useEffect(() => {
    // Load events
    const dayEvents = getEventsByDate(dateStr);
    setEvents(dayEvents);
    
    // Load tasks
    const dayTasks = getDailyTasksByDate(dateStr);
    setTasks(dayTasks);
    
    // Load comment
    const comment = getDailyComment(dateStr);
    setCommentElements(comment?.elements || []);
    
    // Load monthly memo
    const mMemo = getMonthlyMemo(year, month);
    setMonthlyMemo(mMemo?.content || '');
    
    // Load weekly memo
    const weekStart = startOfWeek(currentDate);
    const weekStartStr = formatDate(weekStart);
    const wMemo = getWeeklyMemo(weekStartStr);
    setWeeklyMemo(wMemo?.content || '');
    
    // Load checklist
    const items = getWeeklyChecklistByWeek(weekStartStr);
    setChecklistItems(items);
  }, [dateStr, year, month, currentDate]);
  
  // Separate events for different sections
  // Time Table: has startTime & endTime, not all-day
  const timeTableEvents = events.filter(e => 
    e.startTime && e.endTime && !e.isAllDay
  );
  // Regular Events: isAllDay or no time specified
  const regularEvents = events.filter(e => 
    e.isAllDay || (!e.startTime && !e.endTime)
  );
  
  // Save comment with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const comment: DailyComment = {
        date: dateStr,
        elements: commentElements,
      };
      saveDailyComment(comment);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [commentElements, dateStr]);
  
  const handlePrevDay = () => {
    setCurrentDate(addDays(currentDate, -1));
  };
  
  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  // Task handlers
  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateDailyTask(taskId, { completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
    }
  };
  
  const handleTaskAdd = (content: string, hour: number) => {
    const newTask: DailyTask = {
      id: Date.now().toString(),
      date: dateStr,
      content,
      completed: false,
      order: tasks.length,
      hour, // hour is required for Task Section
    };
    addDailyTask(newTask);
    setTasks([...tasks, newTask]);
  };
  
  const handleTaskDelete = (taskId: string) => {
    deleteDailyTask(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };
  
  // Event handlers
  const handleEventAdd = (eventData: Omit<Event, 'id' | 'date'>) => {
    const allDayEventsCount = events.filter(e => e.isAllDay).length;
    const newEvent: Event = {
      id: Date.now().toString(),
      date: dateStr,
      ...eventData,
      order: eventData.isAllDay ? allDayEventsCount : undefined,
    };
    addEvent(newEvent);
    setEvents([...events, newEvent]);
  };
  
  const handleEventUpdate = (eventId: string, updates: Partial<Event>) => {
    updateEvent(eventId, updates);
    setEvents(events.map((e) => (e.id === eventId ? { ...e, ...updates } : e)));
  };
  
  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    setEvents(events.filter((e) => e.id !== eventId));
  };
  
  const handleEventReorder = (eventId: string, newOrder: number) => {
    const allDayEvents = events.filter(e => e.isAllDay).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const draggedEvent = allDayEvents.find(e => e.id === eventId);
    if (!draggedEvent) return;
    
    const oldIndex = allDayEvents.findIndex(e => e.id === eventId);
    const newEvents = [...allDayEvents];
    newEvents.splice(oldIndex, 1);
    newEvents.splice(newOrder, 0, draggedEvent);
    
    // Update order for all events
    newEvents.forEach((event, index) => {
      updateEvent(event.id, { order: index });
    });
    
    // Update local state
    setEvents(events.map(e => {
      const updatedEvent = newEvents.find(ne => ne.id === e.id);
      if (updatedEvent) {
        return { ...e, order: newEvents.indexOf(updatedEvent) };
      }
      return e;
    }));
  };
  
  // Comment handlers
  const handleElementAdd = (elementData: Omit<CommentElement, 'id'>) => {
    const newElement: CommentElement = {
      id: Date.now().toString(),
      ...elementData,
    };
    setCommentElements([...commentElements, newElement]);
  };
  
  const handleElementUpdate = (elementId: string, updates: Partial<CommentElement>) => {
    setCommentElements(
      commentElements.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
    );
  };
  
  const handleElementDelete = (elementId: string) => {
    setCommentElements(commentElements.filter((el) => el.id !== elementId));
  };
  
  // Checklist handler
  const handleChecklistToggle = (itemId: string) => {
    const item = checklistItems.find((i) => i.id === itemId);
    if (item) {
      updateWeeklyChecklistItem(itemId, { completed: !item.completed });
      setChecklistItems(
        checklistItems.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i))
      );
    }
  };
  
  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
  };
  
  const prevDay = addDays(currentDate, -1).getDate();
  const nextDay = addDays(currentDate, 1).getDate();
  
  return (
    <div className="h-screen flex flex-col">
      <NavigationBar
        currentLabel={`${day}일`}
        prevLabel={`${prevDay}일`}
        nextLabel={`${nextDay}일`}
        onPrev={handlePrevDay}
        onNext={handleNextDay}
        onPrevLabelClick={handlePrevDay}
        onNextLabelClick={handleNextDay}
        rightButtons={
          <>
            <Button variant="outline" size="sm" onClick={onMonthClick}>
              월보기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekClick?.(startOfWeek(currentDate))}
            >
              주보기
            </Button>
          </>
        }
      />
      
      <div className="flex-1 flex overflow-hidden">
        <DailySidebar
          currentDate={currentDate}
          monthlyMemo={monthlyMemo}
          weeklyMemo={weeklyMemo}
          checklistItems={checklistItems}
          onChecklistToggle={handleChecklistToggle}
          onMonthClick={onMonthClick}
          onWeekClick={onWeekClick}
          onDateClick={handleDateClick}
        />
        
        {/* Main Content - 2 Columns: (Task + TimeTable) | (Event + Comment) */}
        <div className="flex-1 flex gap-4 p-4 overflow-auto">
          {/* Left-Center Column: Task and TimeTable side by side */}
          <div className="flex-1 flex gap-4">
            {/* Task Section (Left Half) */}
            <div className="flex-1 h-full min-h-[500px]">
              <TaskSection
                tasks={tasks}
                onTaskToggle={handleTaskToggle}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
              />
            </div>
            
            {/* Time Table Section (Right Half) */}
            <div className="flex-1 h-full min-h-[500px]">
              <TimeTableSection
                events={timeTableEvents}
                onEventAdd={handleEventAdd}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
              />
            </div>
          </div>
          
          {/* Right Column: Event + Comment (Stacked) */}
          <div className="w-80 h-full min-h-[500px] flex flex-col gap-4">
            {/* Event Section (Top) */}
            <div className="flex-1 min-h-[240px]">
              <EventSection
                events={regularEvents}
                onEventDelete={handleEventDelete}
                onEventReorder={handleEventReorder}
              />
            </div>
            
            {/* Comment Section (Bottom) */}
            <div className="flex-1 min-h-[240px]">
              <CommentSection
                elements={commentElements}
                onElementAdd={handleElementAdd}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}