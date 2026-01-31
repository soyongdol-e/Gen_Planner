import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import type { DailyTask } from '../types';

// Get tasks for a specific date
export const getTasksByDate = async (date: string): Promise<DailyTask[]> => {
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data.map(task => ({
    id: task.id,
    user_id: task.user_id,
    date: task.date,
    content: task.content,
    completed: task.completed,
    order: task.order,
    hour: task.hour,
    created_at: task.created_at,
    updated_at: task.updated_at
  }));
};

// Add a new task
export const addTask = async (
  date: string,
  content: string,
  hour?: number
): Promise<DailyTask | null> => {
  const userId = getCurrentUserId();
  
  // Get current max order
  const { data: existingTasks } = await supabase
    .from('daily_tasks')
    .select('order')
    .eq('user_id', userId)
    .eq('date', date)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = existingTasks && existingTasks.length > 0 
    ? (existingTasks[0].order || 0) + 1 
    : 0;

  const { data, error } = await supabase
    .from('daily_tasks')
    .insert({
      user_id: userId,
      date,
      content,
      completed: false,
      order: nextOrder,
      hour: hour || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    content: data.content,
    completed: data.completed,
    order: data.order,
    hour: data.hour,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Toggle task completion
export const toggleTask = async (taskId: string): Promise<boolean> => {
  // First get current state
  const { data: currentTask } = await supabase
    .from('daily_tasks')
    .select('completed')
    .eq('id', taskId)
    .single();

  if (!currentTask) return false;

  const { error } = await supabase
    .from('daily_tasks')
    .update({ 
      completed: !currentTask.completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error toggling task:', error);
    return false;
  }

  return true;
};

// Update task content
export const updateTask = async (
  taskId: string,
  content: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('daily_tasks')
    .update({ 
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    return false;
  }

  return true;
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('daily_tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
};
