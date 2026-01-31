import type {
  Event,
  MonthlyMemo,
  WeeklyMemo,
  WeeklyChecklistItem,
  DailyTask,
  DailyComment,
} from '../types';

const STORAGE_KEYS = {
  EVENTS: 'planner_events',
  MONTHLY_MEMOS: 'planner_monthly_memos',
  WEEKLY_MEMOS: 'planner_weekly_memos',
  WEEKLY_CHECKLISTS: 'planner_weekly_checklists',
  DAILY_TASKS: 'planner_daily_tasks',
  DAILY_COMMENTS: 'planner_daily_comments',
};

// Events
export const getEvents = (): Event[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

export const updateEvent = (eventId: string, updates: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === eventId);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
  }
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
  saveEvents(events.filter((e) => e.id !== eventId));
};

export const getEventsByDate = (date: string): Event[] => {
  return getEvents().filter((event) => event.date === date);
};

export const getEventsByMonth = (year: number, month: number): Event[] => {
  return getEvents().filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

// Monthly Memos
export const getMonthlyMemos = (): MonthlyMemo[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_MEMOS);
  return data ? JSON.parse(data) : [];
};

export const saveMonthlyMemos = (memos: MonthlyMemo[]): void => {
  localStorage.setItem(STORAGE_KEYS.MONTHLY_MEMOS, JSON.stringify(memos));
};

export const getMonthlyMemo = (year: number, month: number): MonthlyMemo | undefined => {
  const memos = getMonthlyMemos();
  return memos.find((m) => m.year === year && m.month === month);
};

export const saveMonthlyMemo = (memo: MonthlyMemo): void => {
  const memos = getMonthlyMemos();
  const index = memos.findIndex((m) => m.year === memo.year && m.month === memo.month);
  if (index !== -1) {
    memos[index] = memo;
  } else {
    memos.push(memo);
  }
  saveMonthlyMemos(memos);
};

// Weekly Memos
export const getWeeklyMemos = (): WeeklyMemo[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_MEMOS);
  return data ? JSON.parse(data) : [];
};

export const saveWeeklyMemos = (memos: WeeklyMemo[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEEKLY_MEMOS, JSON.stringify(memos));
};

export const getWeeklyMemo = (weekStart: string): WeeklyMemo | undefined => {
  const memos = getWeeklyMemos();
  return memos.find((m) => m.weekStart === weekStart);
};

export const saveWeeklyMemo = (memo: WeeklyMemo): void => {
  const memos = getWeeklyMemos();
  const index = memos.findIndex((m) => m.weekStart === memo.weekStart);
  if (index !== -1) {
    memos[index] = memo;
  } else {
    memos.push(memo);
  }
  saveWeeklyMemos(memos);
};

// Weekly Checklists
export const getWeeklyChecklists = (): WeeklyChecklistItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_CHECKLISTS);
  return data ? JSON.parse(data) : [];
};

export const saveWeeklyChecklists = (items: WeeklyChecklistItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEEKLY_CHECKLISTS, JSON.stringify(items));
};

export const getWeeklyChecklistByWeek = (weekStart: string): WeeklyChecklistItem[] => {
  return getWeeklyChecklists()
    .filter((item) => item.weekStart === weekStart)
    .sort((a, b) => a.order - b.order);
};

export const addWeeklyChecklistItem = (item: WeeklyChecklistItem): void => {
  const items = getWeeklyChecklists();
  items.push(item);
  saveWeeklyChecklists(items);
};

export const updateWeeklyChecklistItem = (
  itemId: string,
  updates: Partial<WeeklyChecklistItem>
): void => {
  const items = getWeeklyChecklists();
  const index = items.findIndex((i) => i.id === itemId);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveWeeklyChecklists(items);
  }
};

export const deleteWeeklyChecklistItem = (itemId: string): void => {
  const items = getWeeklyChecklists();
  saveWeeklyChecklists(items.filter((i) => i.id !== itemId));
};

// Daily Tasks
export const getDailyTasks = (): DailyTask[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
  return data ? JSON.parse(data) : [];
};

export const saveDailyTasks = (tasks: DailyTask[]): void => {
  localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(tasks));
};

export const getDailyTasksByDate = (date: string): DailyTask[] => {
  return getDailyTasks()
    .filter((task) => task.date === date)
    .sort((a, b) => a.order - b.order);
};

export const addDailyTask = (task: DailyTask): void => {
  const tasks = getDailyTasks();
  tasks.push(task);
  saveDailyTasks(tasks);
};

export const updateDailyTask = (taskId: string, updates: Partial<DailyTask>): void => {
  const tasks = getDailyTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveDailyTasks(tasks);
  }
};

export const deleteDailyTask = (taskId: string): void => {
  const tasks = getDailyTasks();
  saveDailyTasks(tasks.filter((t) => t.id !== taskId));
};

// Daily Comments
export const getDailyComments = (): DailyComment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_COMMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveDailyComments = (comments: DailyComment[]): void => {
  localStorage.setItem(STORAGE_KEYS.DAILY_COMMENTS, JSON.stringify(comments));
};

export const getDailyComment = (date: string): DailyComment | undefined => {
  const comments = getDailyComments();
  return comments.find((c) => c.date === date);
};

export const saveDailyComment = (comment: DailyComment): void => {
  const comments = getDailyComments();
  const index = comments.findIndex((c) => c.date === comment.date);
  if (index !== -1) {
    comments[index] = comment;
  } else {
    comments.push(comment);
  }
  saveDailyComments(comments);
};
