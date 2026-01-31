import { useState, useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { NavigationBar } from '../NavigationBar';
import { WeeklySidebar } from '../WeeklySidebar';
import type { Event, WeeklyMemo, WeeklyChecklistItem, DailyTask } from '../../types';
import {
  startOfWeek,
  endOfWeek,
  addDays,
  formatDate,
  formatWeekRange,
  getToday,
} from '../../utils/dateUtils';
import {
  getEvents,
  getWeeklyMemo,
  saveWeeklyMemo,
  getWeeklyChecklistByWeek,
  addWeeklyChecklistItem,
  updateWeeklyChecklistItem,
  deleteWeeklyChecklistItem,
  getMonthlyMemo,
  getDailyTasks,
  updateEvent,
  deleteEvent,
  updateDailyTask,
  deleteDailyTask,
  addEvent,
} from '../../utils/storage';
import { cn } from '../ui/utils';

interface WeekViewProps {
  initialDate?: Date;
  onMonthClick?: () => void;
  onDayClick?: (date: Date) => void;
}

export function WeekView({ initialDate, onMonthClick, onDayClick }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(initialDate || getToday())
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [weeklyMemo, setWeeklyMemo] = useState('');
  const [monthlyMemo, setMonthlyMemo] = useState('');
  const [checklistItems, setChecklistItems] = useState<WeeklyChecklistItem[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingEventTitle, setEditingEventTitle] = useState('');
  const [editingTaskContent, setEditingTaskContent] = useState('');
  const [addingEventDate, setAddingEventDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const weekEnd = endOfWeek(currentWeekStart);
  const weekStartStr = formatDate(currentWeekStart);

  // Load data when week changes
  useEffect(() => {
    // Load events - use string comparison for dates
    const allEvents = getEvents();
    const weekStartStr = formatDate(currentWeekStart);
    const weekEndStr = formatDate(weekEnd);

    const weekEvents = allEvents.filter((event) => {
      return event.date >= weekStartStr && event.date <= weekEndStr;
    });
    setEvents(weekEvents);

    // Load weekly memo
    const memo = getWeeklyMemo(weekStartStr);
    setWeeklyMemo(memo?.content || '');

    // Load monthly memo
    const year = currentWeekStart.getFullYear();
    const month = currentWeekStart.getMonth();
    const mMemo = getMonthlyMemo(year, month);
    setMonthlyMemo(mMemo?.content || '');

    // Load checklist
    const items = getWeeklyChecklistByWeek(weekStartStr);
    setChecklistItems(items);

    // Load daily tasks for the week
    const allTasks = getDailyTasks();
    const weekTasks = allTasks.filter((task) => {
      return task.date >= weekStartStr && task.date <= weekEndStr;
    });
    setDailyTasks(weekTasks);
  }, [weekStartStr]);

  // Save weekly memo with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const memo: WeeklyMemo = {
        weekStart: weekStartStr,
        content: weeklyMemo,
      };
      saveWeeklyMemo(memo);
    }, 500);

    return () => clearTimeout(timer);
  }, [weeklyMemo, weekStartStr]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleChecklistToggle = (itemId: string) => {
    const item = checklistItems.find((i) => i.id === itemId);
    if (item) {
      updateWeeklyChecklistItem(itemId, { completed: !item.completed });
      setChecklistItems(
        checklistItems.map((i) =>
          i.id === itemId ? { ...i, completed: !i.completed } : i
        )
      );
    }
  };

  const handleChecklistAdd = (content: string) => {
    const newItem: WeeklyChecklistItem = {
      id: Date.now().toString(),
      weekStart: weekStartStr,
      content,
      completed: false,
      order: checklistItems.length,
    };
    addWeeklyChecklistItem(newItem);
    setChecklistItems([...checklistItems, newItem]);
  };

  const handleChecklistDelete = (itemId: string) => {
    deleteWeeklyChecklistItem(itemId);
    setChecklistItems(checklistItems.filter((i) => i.id !== itemId));
  };

  const handleWeekClick = (weekStart: Date) => {
    setCurrentWeekStart(weekStart);
  };

  const handleAddEvent = (dateStr: string) => {
    if (newEventTitle.trim()) {
      // Count existing all-day events for this date to determine order
      const existingEvents = events.filter((e) => e.date === dateStr && e.isAllDay);
      const order = existingEvents.length;

      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle.trim(),
        date: dateStr,
        isAllDay: true,
        color: '#ec4899', // Default pink color
        order,
      };
      addEvent(newEvent);
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setAddingEventDate(null);
    }
  };

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const today = getToday();

  const currentLabel = formatWeekRange(currentWeekStart, weekEnd);
  const prevWeekStart = addDays(currentWeekStart, -7);
  const prevWeekEnd = endOfWeek(prevWeekStart);
  const nextWeekStart = addDays(currentWeekStart, 7);
  const nextWeekEnd = endOfWeek(nextWeekStart);

  const prevLabel = formatWeekRange(prevWeekStart, prevWeekEnd);
  const nextLabel = formatWeekRange(nextWeekStart, nextWeekEnd);

  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  // Helper function to get day name for a date
  const getDayName = (date: Date) => {
    return dayNames[date.getDay()];
  };

  return (
    <div className="h-screen flex flex-col">
      <NavigationBar
        currentLabel={currentLabel}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        onPrevLabelClick={handlePrevWeek}
        onNextLabelClick={handleNextWeek}
      />

      <div className="flex-1 flex overflow-hidden">
        <WeeklySidebar
          weekStart={currentWeekStart}
          monthlyMemo={monthlyMemo}
          checklistItems={checklistItems}
          onChecklistToggle={handleChecklistToggle}
          onChecklistAdd={handleChecklistAdd}
          onChecklistDelete={handleChecklistDelete}
          onMonthClick={onMonthClick}
          onWeekClick={handleWeekClick}
        />

        {/* Week Calendar */}
        <div className="flex-1 p-4 md:p-6 overflow-auto flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day, idx) => {
                const isToday = formatDate(day) === formatDate(today);
                const dayOfWeek = day.getDay(); // 0=일요일, 6=토요일
                return (
                  <button
                    key={idx}
                    onClick={() => onDayClick?.(day)}
                    className={cn(
                      'border-r last:border-r-0 p-3 hover:bg-gray-50 transition-colors',
                      isToday && 'bg-teal-50'
                    )}
                  >
                    <div
                      className={cn(
                        'text-xs font-medium',
                        dayOfWeek === 0 && 'text-red-500',
                        dayOfWeek === 6 && 'text-blue-500',
                        dayOfWeek > 0 && dayOfWeek < 6 && 'text-gray-600'
                      )}
                    >
                      {getDayName(day)}
                    </div>
                    <div
                      className={cn(
                        'text-lg font-semibold mt-1',
                        isToday && 'text-teal-600',
                        !isToday && dayOfWeek === 0 && 'text-red-500',
                        !isToday && dayOfWeek === 6 && 'text-blue-500'
                      )}
                    >
                      {day.getMonth() + 1}월 {day.getDate()}일
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Day Columns */}
            <div className="grid grid-cols-7 min-h-[500px]">
              {weekDays.map((day, idx) => {
                const dayStr = formatDate(day);
                // Filter events for this day (exclude Time Table events)
                const dayEvents = events.filter((e) => {
                  if (e.date !== dayStr) return false;
                  // Exclude Time Table events (has startTime & endTime, not all-day)
                  if (e.startTime && e.endTime && !e.isAllDay) return false;
                  return true;
                });

                // Filter tasks for this day
                const dayTasks = dailyTasks.filter((t) => t.date === dayStr);

                const isToday = dayStr === formatDate(today);

                return (
                  <div
                    key={idx}
                    className={cn(
                      'border-r last:border-r-0 p-2 relative group',
                      isToday && 'bg-teal-50/30'
                    )}
                    onMouseEnter={() => setHoveredDate(dayStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    {/* Background button for day click */}
                    <button
                      onClick={() => onDayClick?.(day)}
                      className="absolute inset-0 hover:bg-gray-50 transition-colors z-0"
                    />

                    {/* Content (above the button) */}
                    <div className="relative z-10">
                      {/* Daily Memo Area */}
                      <div className="mb-3 min-h-[40px] text-xs text-gray-500 italic pointer-events-none">
                        {/* Placeholder for daily memo */}
                      </div>

                      {/* Event Blocks */}
                      <div className="space-y-1">
                        {dayEvents.map((event) => {
                          const eventColor = event.color || '#ec4899';
                          const isEditing = editingEventId === event.id;

                          if (isEditing) {
                            return (
                              <div
                                key={event.id}
                                className="rounded p-2 text-xs bg-white border-2 border-pink-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {event.startTime && (
                                  <div className="font-medium text-[10px] text-gray-500 mb-0.5">
                                    {event.startTime}
                                    {event.endTime && ` - ${event.endTime}`}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 w-full">
                                  <input
                                    type="text"
                                    value={editingEventTitle}
                                    onChange={(e) => setEditingEventTitle(e.target.value)}
                                    onBlur={() => {
                                      // Delay to allow delete button click to register first
                                      setTimeout(() => {
                                        if (editingEventId === event.id) {
                                          if (editingEventTitle.trim()) {
                                            updateEvent(event.id, { title: editingEventTitle });
                                            setEvents(
                                              events.map((e) =>
                                                e.id === event.id ? { ...e, title: editingEventTitle } : e
                                              )
                                            );
                                          }
                                          setEditingEventId(null);
                                        }
                                      }, 100);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingEventId(null);
                                      }
                                    }}
                                    autoFocus
                                    className="flex-1 min-w-0 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <button
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // Prevent input blur
                                      e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteEvent(event.id);
                                      setEvents(events.filter((e) => e.id !== event.id));
                                      setEditingEventId(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEventId(event.id);
                                setEditingEventTitle(event.title);
                              }}
                              className="w-full text-left rounded p-2 text-xs hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: eventColor,
                                color: 'white',
                              }}
                            >
                              {event.startTime && (
                                <div className="font-medium text-[10px] opacity-90 mb-0.5">
                                  {event.startTime}
                                  {event.endTime && ` - ${event.endTime}`}
                                </div>
                              )}
                              <div className="font-semibold truncate">
                                {event.title}
                              </div>
                            </button>
                          );
                        })}

                        {/* Add Event Button (shows on hover) */}
                        {hoveredDate === dayStr && !addingEventDate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingEventDate(dayStr);
                            }}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-pink-400 hover:bg-pink-50 transition-colors flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-pink-600"
                          >
                            <Plus className="w-3 h-3" />
                            <span>이벤트 추가</span>
                          </button>
                        )}

                        {/* Add Event Input */}
                        {addingEventDate === dayStr && (
                          <div
                            className="rounded p-2 bg-white border-2 border-pink-500 shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                              onBlur={() => {
                                if (newEventTitle.trim()) {
                                  handleAddEvent(dayStr);
                                } else {
                                  setAddingEventDate(null);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddEvent(dayStr);
                                }
                                if (e.key === 'Escape') {
                                  setAddingEventDate(null);
                                  setNewEventTitle('');
                                }
                              }}
                              placeholder="이벤트 제목..."
                              autoFocus
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Task Blocks */}
                      <div className="space-y-1">
                        {dayTasks.map((task) => {
                          const isEditing = editingTaskId === task.id;

                          if (isEditing) {
                            return (
                              <div
                                key={task.id}
                                className="rounded p-2 text-xs bg-white border-2 border-green-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center gap-1 w-full">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      updateDailyTask(task.id, { completed: !task.completed });
                                      setDailyTasks(
                                        dailyTasks.map((t) =>
                                          t.id === task.id ? { ...t, completed: !task.completed } : t
                                        )
                                      );
                                    }}
                                    className="mt-0.5 flex-shrink-0"
                                  />
                                  <input
                                    type="text"
                                    value={editingTaskContent}
                                    onChange={(e) => setEditingTaskContent(e.target.value)}
                                    onBlur={() => {
                                      // Delay to allow delete button click to register first
                                      setTimeout(() => {
                                        if (editingTaskId === task.id) {
                                          if (editingTaskContent.trim()) {
                                            updateDailyTask(task.id, { content: editingTaskContent });
                                            setDailyTasks(
                                              dailyTasks.map((t) =>
                                                t.id === task.id ? { ...t, content: editingTaskContent } : t
                                              )
                                            );
                                          }
                                          setEditingTaskId(null);
                                        }
                                      }, 100);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingTaskId(null);
                                      }
                                    }}
                                    autoFocus
                                    className="flex-1 min-w-0 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                  />
                                  <button
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // Prevent input blur
                                      e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDailyTask(task.id);
                                      setDailyTasks(dailyTasks.filter((t) => t.id !== task.id));
                                      setEditingTaskId(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={task.id}
                              className="rounded p-2 text-xs"
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-start gap-1">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateDailyTask(task.id, { completed: !task.completed });
                                    setDailyTasks(
                                      dailyTasks.map((t) =>
                                        t.id === task.id ? { ...t, completed: !task.completed } : t
                                      )
                                    );
                                  }}
                                  className="mt-0.5 cursor-pointer"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTaskId(task.id);
                                    setEditingTaskContent(task.content);
                                  }}
                                  className="flex-1 text-left hover:opacity-80 transition-opacity"
                                >
                                  <div className="font-semibold truncate">
                                    {task.content}
                                  </div>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Memo - Below Week Calendar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-sm mb-3">Weekly Memo</h3>
            <Textarea
              value={weeklyMemo}
              onChange={(e) => setWeeklyMemo(e.target.value)}
              placeholder="이번 주 메모를 작성하세요..."
              className="text-sm min-h-[120px] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}