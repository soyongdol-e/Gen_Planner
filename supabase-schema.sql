-- Digital Planner Database Schema
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  description TEXT,
  is_all_day BOOLEAN DEFAULT false,
  is_time_table BOOLEAN DEFAULT false,
  "order" INTEGER,
  recurring JSONB,
  parent_recurring_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_date ON events(user_id, date);
CREATE INDEX IF NOT EXISTS idx_events_parent_recurring ON events(parent_recurring_id);

-- 2. Monthly Memos Table
CREATE TABLE IF NOT EXISTS monthly_memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

-- 3. Weekly Memos Table
CREATE TABLE IF NOT EXISTS weekly_memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- 4. Weekly Checklist Items Table
CREATE TABLE IF NOT EXISTS weekly_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checklist_user_week ON weekly_checklist_items(user_id, week_start);

-- 5. Daily Tasks Table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  "order" INTEGER,
  hour INTEGER CHECK (hour IS NULL OR hour BETWEEN 0 AND 23),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON daily_tasks(user_id, date);

-- 6. Daily Comments Table
CREATE TABLE IF NOT EXISTS daily_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  elements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 7. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY,
  country TEXT DEFAULT 'KR',
  week_starts_on INTEGER DEFAULT 0 CHECK (week_starts_on IN (0, 1)),
  time_table_unit INTEGER DEFAULT 10 CHECK (time_table_unit IN (5, 10, 15, 30)),
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Holidays Cache Table
CREATE TABLE IF NOT EXISTS holidays_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  year INTEGER NOT NULL,
  holidays JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country, year)
);

-- Row Level Security (RLS) Policies
-- For prototype, we'll use a demo user without authentication

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for prototype (allows all operations)
-- In production, replace with: WHERE user_id = auth.uid()

CREATE POLICY "Allow all for demo" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON monthly_memos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON weekly_memos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON weekly_checklist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON daily_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON daily_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for demo" ON user_settings FOR ALL USING (true) WITH CHECK (true);

-- Holidays cache doesn't need RLS (public data)
ALTER TABLE holidays_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON holidays_cache FOR SELECT USING (true);

-- Insert demo user settings
INSERT INTO user_settings (user_id, country, week_starts_on, time_table_unit)
VALUES ('00000000-0000-0000-0000-000000000000', 'KR', 0, 10)
ON CONFLICT (user_id) DO NOTHING;
