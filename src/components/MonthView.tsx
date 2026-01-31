import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { NavigationBar } from './NavigationBar';
import { MonthlySidebar } from './MonthlySidebar';
import { MonthCalendar } from './MonthCalendar';
import { AddEventDialog } from './AddEventDialog';
import { EditEventsDialog } from './EditEventsDialog';
import type { Event, MonthlyMemo } from '../types';
import {
  getMonthName,
  getToday,
  addMonths,
  formatDate,
  startOfWeek,
} from '../utils/dateUtils';
import {
  getEventsByMonth,
  getMonthlyMemo,
  saveMonthlyMemo,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../utils/storage';

interface MonthViewProps {
  onYearClick?: () => void;
  onWeekClick?: (date: Date) => void;
  onDayClick?: (date: Date) => void;
}

export function MonthView({ onYearClick, onWeekClick, onDayClick }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [events, setEvents] = useState<Event[]>([]);
  const [memo, setMemo] = useState('');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventsOpen, setIsEditEventsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Load events and memo when month changes
  useEffect(() => {
    const monthEvents = getEventsByMonth(year, month);
    setEvents(monthEvents);
    
    const monthlyMemo = getMonthlyMemo(year, month);
    setMemo(monthlyMemo?.content || '');
  }, [year, month]);
  
  // Save memo with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const monthlyMemo: MonthlyMemo = {
        year,
        month,
        content: memo,
      };
      saveMonthlyMemo(monthlyMemo);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [memo, year, month]);
  
  const handlePrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleGoToToday = () => {
    setCurrentDate(getToday());
  };
  
  const handleGoToCurrentWeek = () => {
    const today = getToday();
    const weekStart = startOfWeek(today);
    onWeekClick?.(weekStart);
  };
  
  const handleGoToPrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };
  
  const handleGoToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleWeekClick = (weekStart: Date) => {
    onWeekClick?.(weekStart);
  };
  
  const handleDateClick = (date: Date) => {
    onDayClick?.(date);
  };
  
  const handleEventClick = (event: Event) => {
    // Navigate to the event's date
    const eventDate = new Date(event.date);
    onDayClick?.(eventDate);
  };
  
  const handleEventAdd = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventOpen(true);
  };
  
  const handleEventEdit = (date: Date) => {
    setSelectedDate(date);
    setIsEditEventsOpen(true);
  };
  
  const handleEventReorder = (eventId: string, newOrder: number) => {
    if (!selectedDate) return;
    
    const dateStr = formatDate(selectedDate);
    const allDayEvents = events
      .filter(e => e.date === dateStr && e.isAllDay)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    
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
    
    // Refresh events
    const monthEvents = getEventsByMonth(year, month);
    setEvents(monthEvents);
  };
  
  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    
    // Refresh events
    const monthEvents = getEventsByMonth(year, month);
    setEvents(monthEvents);
  };
  
  const handleAddEventFromEdit = () => {
    // Close edit dialog and open add dialog
    setIsAddEventOpen(true);
  };
  
  const currentMonthName = getMonthName(month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  
  const prevLabel = month === 0 
    ? `${prevYear}년 ${getMonthName(prevMonth)}`
    : getMonthName(prevMonth);
  const nextLabel = getMonthName(nextMonth);
  
  return (
    <div className="h-screen flex flex-col">
      <NavigationBar
        currentLabel={currentMonthName}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onPrevLabelClick={handleGoToPrevMonth}
        onNextLabelClick={handleGoToNextMonth}
        onCurrentClick={onYearClick}
        leftContent={
          <button
            onClick={onYearClick}
            className="text-lg md:text-xl font-semibold hover:text-gray-700 transition-colors"
          >
            {year}년
          </button>
        }
        rightButtons={
          <>
            <Button variant="outline" size="sm" onClick={handleGoToCurrentWeek}>
              주보기
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToToday}>
              오늘
            </Button>
          </>
        }
      />
      
      <div className="flex-1 flex overflow-hidden">
        <MonthlySidebar
          year={year}
          month={month}
          memo={memo}
          onMemoChange={setMemo}
          events={events}
          onEventClick={handleEventClick}
        />
        
        <MonthCalendar
          year={year}
          month={month}
          events={events}
          onDateClick={handleDateClick}
          onWeekClick={handleWeekClick}
          onEventAdd={handleEventAdd}
          onEventEdit={handleEventEdit}
        />
      </div>
      
      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        date={selectedDate}
        onSave={(title) => {
          if (selectedDate) {
            const dateStr = formatDate(selectedDate);
            // Count existing all-day events for this date to set order
            const existingEventsCount = events.filter(e => e.date === dateStr && e.isAllDay).length;
            
            const newEvent: Event = {
              id: Date.now().toString(),
              title: title,
              date: dateStr,
              isAllDay: true,
              color: '#ec4899',
              order: existingEventsCount,
            };
            addEvent(newEvent);
            
            // Refresh events
            const monthEvents = getEventsByMonth(year, month);
            setEvents(monthEvents);
          }
        }}
      />
      
      <EditEventsDialog
        open={isEditEventsOpen}
        onOpenChange={setIsEditEventsOpen}
        date={selectedDate}
        events={events}
        onEventReorder={handleEventReorder}
        onEventDelete={handleEventDelete}
        onEventAdd={handleAddEventFromEdit}
      />
    </div>
  );
}
