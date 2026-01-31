import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  subDays
} from 'date-fns';
import { ko } from 'date-fns/locale';

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format date to display string (e.g., "2026년 1월")
export const formatMonthYear = (date: Date): string => {
  return format(date, 'yyyy년 M월', { locale: ko });
};

// Format day (e.g., "25")
export const formatDay = (date: Date): string => {
  return format(date, 'd');
};

// Get calendar days for month view
export const getCalendarDays = (
  year: number, 
  month: number, 
  weekStartsOn: 0 | 1 = 0
): Date[] => {
  const date = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Check if date is in same month
export const isInMonth = (date: Date, targetDate: Date): boolean => {
  return isSameMonth(date, targetDate);
};

// Navigation helpers
export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);
export const getNextDay = (date: Date): Date => addDays(date, 1);
export const getPrevDay = (date: Date): Date => subDays(date, 1);

// Get week start date (for week view)
export const getWeekStart = (date: Date, weekStartsOn: 0 | 1 = 0): Date => {
  return startOfWeek(date, { weekStartsOn });
};

// Get week dates (7 days)
export const getWeekDays = (weekStart: Date): Date[] => {
  return eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  });
};
