import { 
  format, 
  startOfWeek,
  endOfWeek as dateFnsEndOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays as dateFnsAddDays,
  subDays
} from 'date-fns';
import { ko } from 'date-fns/locale';

// Re-export commonly used date-fns functions
export { dateFnsAddDays as addDays };

// Get today's date
export const getToday = (): Date => {
  return new Date();
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Get month name (e.g., "1월", "2월") with locale support
export const getMonthName = (month: number, locale: string = 'ko-KR'): string => {
  if (locale === 'ko-KR') {
    return `${month + 1}월`;
  }
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month];
};

// Format date to display string (e.g., "2026년 1월")
export const formatMonthYear = (date: Date): string => {
  return format(date, 'yyyy년 M월', { locale: ko });
};

// Format day (e.g., "25")
export const formatDay = (date: Date): string => {
  return format(date, 'd');
};

// Get week days for header (e.g., ["일", "월", "화", ...])
export const getWeekDays = (locale: string = 'ko-KR'): string[] => {
  if (locale === 'ko-KR') {
    return ['일', '월', '화', '수', '목', '금', '토'];
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

// Get calendar days for month view (returns object with date and isCurrentMonth)
export const getCalendarDays = (
  year: number, 
  month: number, // 0-indexed (0 = January)
  weekStartsOn: 0 | 1 = 0
): Array<{ date: Date; isCurrentMonth: boolean }> => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of week for first day (0 = Sunday, 6 = Saturday)
  let firstDayOfWeek = firstDay.getDay();
  
  // Adjust if week starts on Monday
  if (weekStartsOn === 1) {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }
  
  // Calculate start date (might be from previous month)
  const startDate = new Date(year, month, 1 - firstDayOfWeek);
  
  // Get last day of week for last day of month
  let lastDayOfWeek = lastDay.getDay();
  if (weekStartsOn === 1) {
    lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
  }
  
  // Calculate end date (might be from next month)
  const daysToAdd = weekStartsOn === 0 ? (6 - lastDayOfWeek) : (6 - lastDayOfWeek);
  const endDate = new Date(year, month + 1, lastDay.getDate() - lastDay.getDate() + 1 + daysToAdd);
  
  // Generate array of dates
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month
    });
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Export isSameDay for external use
export { isSameDay };

// Check if date is in same month
export const isInMonth = (date: Date, targetDate: Date): boolean => {
  return isSameMonth(date, targetDate);
};

// Check if date is Sunday
export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

// Check if date is Saturday
export const isSaturday = (date: Date): boolean => {
  return date.getDay() === 6;
};

// Navigation helpers
export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);
export const getNextDay = (date: Date): Date => dateFnsAddDays(date, 1);
export const getPrevDay = (date: Date): Date => subDays(date, 1);

// Export addMonths and startOfWeek for external use
export { addMonths, startOfWeek };

// Get week start date (for week view)
export const getWeekStart = (date: Date, weekStartsOn: 0 | 1 = 0): Date => {
  return startOfWeek(date, { weekStartsOn });
};

// Get week dates (7 days)
export const getWeekDaysDates = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(dateFnsAddDays(weekStart, i));
  }
  return days;
};

// Get end of week
export const endOfWeek = (date: Date, weekStartsOn: 0 | 1 = 0): Date => {
  return dateFnsEndOfWeek(date, { weekStartsOn });
};

// Format week range (e.g., "1/25-31" or "1/25-2/1")
export const formatWeekRange = (weekStart: Date, weekEnd: Date): string => {
  const startMonth = weekStart.getMonth() + 1;
  const startDay = weekStart.getDate();
  const endMonth = weekEnd.getMonth() + 1;
  const endDay = weekEnd.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth}/${startDay}-${endDay}`;
  } else {
    return `${startMonth}/${startDay}-${endMonth}/${endDay}`;
  }
};

// Get days in month
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday, 6 = Saturday)
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};
