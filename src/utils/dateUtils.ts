import { 
  format, 
  startOfWeek,
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
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  // Get the day of week for first day (0 = Sunday, 6 = Saturday)
  let firstDayOfWeek = firstDay.getDay();
  
  // Adjust if week starts on Monday
  if (weekStartsOn === 1) {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }
  
  // Calculate start date (might be from previous month)
  const startDate = new Date(year, month - 1, 1 - firstDayOfWeek);
  
  // Get last day of week for last day of month
  let lastDayOfWeek = lastDay.getDay();
  if (weekStartsOn === 1) {
    lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
  }
  
  // Calculate end date (might be from next month)
  const daysToAdd = weekStartsOn === 0 ? (6 - lastDayOfWeek) : (6 - lastDayOfWeek);
  const endDate = new Date(year, month, lastDay.getDate() + daysToAdd);
  
  // Generate array of dates
  const days: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
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
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }
  return days;
};
