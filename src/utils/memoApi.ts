import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import { MonthlyMemo, WeeklyMemo } from '../types';

// ========== Monthly Memo ==========

// Get monthly memo
export const getMonthlyMemo = async (year: number, month: number): Promise<MonthlyMemo | null> => {
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('monthly_memos')
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .eq('month', month)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found, return null
      return null;
    }
    console.error('Error fetching monthly memo:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    year: data.year,
    month: data.month,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Save or update monthly memo
export const saveMonthlyMemo = async (
  year: number,
  month: number,
  content: string
): Promise<boolean> => {
  const userId = getCurrentUserId();
  
  const { error } = await supabase
    .from('monthly_memos')
    .upsert({
      user_id: userId,
      year,
      month,
      content,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,year,month'
    });

  if (error) {
    console.error('Error saving monthly memo:', error);
    return false;
  }

  return true;
};

// ========== Weekly Memo ==========

// Get weekly memo
export const getWeeklyMemo = async (weekStart: string): Promise<WeeklyMemo | null> => {
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('weekly_memos')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching weekly memo:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    week_start: data.week_start,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Save or update weekly memo
export const saveWeeklyMemo = async (
  weekStart: string,
  content: string
): Promise<boolean> => {
  const userId = getCurrentUserId();
  
  const { error } = await supabase
    .from('weekly_memos')
    .upsert({
      user_id: userId,
      week_start: weekStart,
      content,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,week_start'
    });

  if (error) {
    console.error('Error saving weekly memo:', error);
    return false;
  }

  return true;
};
