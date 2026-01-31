import { supabase } from '../lib/supabase';
import { getCurrentUserId } from '../lib/auth';
import type { Event } from '../types';

// Get events for a specific date
export const getEventsByDate = async (date: string): Promise<Event[]> => {
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data.map(event => ({
    id: event.id,
    user_id: event.user_id,
    title: event.title,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    color: event.color,
    description: event.description,
    is_all_day: event.is_all_day,
    is_time_table: event.is_time_table,
    order: event.order,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

// Get events for a month (for Month View indicators)
export const getEventsByMonth = async (year: number, month: number): Promise<Event[]> => {
  const userId = getCurrentUserId();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching events by month:', error);
    return [];
  }

  return data.map(event => ({
    id: event.id,
    user_id: event.user_id,
    title: event.title,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    color: event.color,
    description: event.description,
    is_all_day: event.is_all_day,
    is_time_table: event.is_time_table,
    order: event.order,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

// Get events for a date range (for Week View)
export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<Event[]> => {
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching events by date range:', error);
    return [];
  }

  return data.map(event => ({
    id: event.id,
    user_id: event.user_id,
    title: event.title,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    color: event.color,
    description: event.description,
    is_all_day: event.is_all_day,
    is_time_table: event.is_time_table,
    order: event.order,
    created_at: event.created_at,
    updated_at: event.updated_at
  }));
};

// Add a new event
export const addEvent = async (
  date: string,
  title: string,
  color: string = '#3b82f6',
  description?: string,
  isAllDay: boolean = true,
  isTimeTable: boolean = false,
  startTime?: string,
  endTime?: string
): Promise<Event | null> => {
  const userId = getCurrentUserId();
  
  // Get current max order for the date
  const { data: existingEvents } = await supabase
    .from('events')
    .select('order')
    .eq('user_id', userId)
    .eq('date', date)
    .eq('is_all_day', isAllDay)
    .order('order', { ascending: false })
    .limit(1);

  const nextOrder = existingEvents && existingEvents.length > 0 
    ? (existingEvents[0].order || 0) + 1 
    : 0;

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: userId,
      date,
      title,
      color,
      description: description || null,
      is_all_day: isAllDay,
      is_time_table: isTimeTable,
      start_time: startTime || null,
      end_time: endTime || null,
      order: nextOrder
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding event:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    title: data.title,
    date: data.date,
    start_time: data.start_time,
    end_time: data.end_time,
    color: data.color,
    description: data.description,
    is_all_day: data.is_all_day,
    is_time_table: data.is_time_table,
    order: data.order,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Update an event
export const updateEvent = async (
  eventId: string,
  updates: {
    title?: string;
    color?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event:', error);
    return false;
  }

  return true;
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
};
