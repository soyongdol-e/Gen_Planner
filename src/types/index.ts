// TypeScript interfaces for Digital Planner

export interface Event {
  id: string;
  user_id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm AM/PM format
  endTime?: string; // HH:mm AM/PM format
  color: string;
  description?: string;
  isAllDay?: boolean;
  isTimeTable?: boolean;
  order?: number;
  recurring?: RecurringConfig;
  parent_recurring_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecurringConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  end_date?: string;
  end_after?: number;
  days_of_week?: number[];
  day_of_month?: number;
  month_of_year?: number;
}

export interface MonthlyMemo {
  id?: string;
  user_id?: string;
  year: number;
  month: number; // 1-12
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklyMemo {
  id?: string;
  user_id?: string;
  weekStart: string; // YYYY-MM-DD
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeeklyChecklistItem {
  id: string;
  user_id?: string;
  weekStart: string;
  content: string;
  completed: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyTask {
  id: string;
  user_id?: string;
  date: string; // YYYY-MM-DD
  content: string;
  completed: boolean;
  order: number;
  hour?: number; // 0-23 or null
  created_at?: string;
  updated_at?: string;
}

export interface DailyComment {
  id?: string;
  user_id?: string;
  date: string;
  elements: CommentElement[];
  created_at?: string;
  updated_at?: string;
}

export interface CommentElement {
  id: string;
  type: 'image' | 'text';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  z_index: number;
  image_url?: string;
  content?: string;
  font_size?: number;
  font_family?: string;
  color?: string;
}

export interface UserSettings {
  user_id: string;
  country: string;
  week_starts_on: 0 | 1;
  time_table_unit: 5 | 10 | 15 | 30;
  theme: 'light' | 'dark';
  language: string;
  created_at?: string;
  updated_at?: string;
}

export interface Holiday {
  date: string;
  name: string;
  country: string;
}

export type ViewType = 'year' | 'month' | 'week' | 'day';
