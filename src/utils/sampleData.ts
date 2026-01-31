import type { Event, MonthlyMemo, WeeklyMemo, WeeklyChecklistItem, DailyTask } from '../types';
import { 
  saveEvents, 
  saveMonthlyMemo, 
  saveWeeklyMemo, 
  addWeeklyChecklistItem,
  addDailyTask,
} from './storage';

export const initializeSampleData = () => {
  // Check if data already exists
  const existingEvents = localStorage.getItem('planner_events');
  if (existingEvents) {
    return; // Don't overwrite existing data
  }
  
  // Sample events for January 2026
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: '프로젝트 킥오프 미팅',
      date: '2026-01-15',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      color: '#3b82f6',
      description: '새 프로젝트 시작',
      isAllDay: false,
    },
    {
      id: '2',
      title: '치과 예약',
      date: '2026-01-20',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      color: '#ef4444',
      isAllDay: false,
    },
    {
      id: '3',
      title: '친구 생일',
      date: '2026-01-25',
      color: '#ec4899',
      isAllDay: true,
    },
    {
      id: '4',
      title: '주간 회의',
      date: '2026-01-27',
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      color: '#8b5cf6',
      isAllDay: false,
    },
    {
      id: '5',
      title: '헬스장',
      date: '2026-01-27',
      startTime: '6:00 PM',
      endTime: '7:30 PM',
      color: '#10b981',
      isAllDay: false,
    },
    {
      id: '6',
      title: '팀 빌딩',
      date: '2026-01-30',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      color: '#f59e0b',
      isAllDay: false,
    },
    {
      id: '7',
      title: '아침 조깅',
      date: '2026-01-28',
      startTime: '7:00 AM',
      endTime: '8:00 AM',
      color: '#10b981',
      isAllDay: false,
    },
    {
      id: '8',
      title: '점심 약속',
      date: '2026-01-28',
      startTime: '12:30 PM',
      endTime: '2:00 PM',
      color: '#ec4899',
      isAllDay: false,
    },
  ];
  
  saveEvents(sampleEvents);
  
  // Sample monthly memo
  const sampleMemo: MonthlyMemo = {
    year: 2026,
    month: 0, // January (0-indexed)
    content: '• 새해 목표: 운동 주 3회\n• 프로젝트 마감: 1월 말\n• 독서 목표: 월 2권',
  };
  
  saveMonthlyMemo(sampleMemo);
  
  // Sample weekly memo (week of Jan 26 - Feb 1)
  const weeklyMemo: WeeklyMemo = {
    weekStart: '2026-01-26',
    content: '이번 주는 프로젝트 마감 준비 주간\n마지막 점검 필요',
  };
  
  saveWeeklyMemo(weeklyMemo);
  
  // Sample weekly checklist
  const checklistItems: WeeklyChecklistItem[] = [
    {
      id: 'c1',
      weekStart: '2026-01-26',
      content: '프로젝트 최종 검토',
      completed: false,
      order: 0,
    },
    {
      id: 'c2',
      weekStart: '2026-01-26',
      content: '운동 3회 이상',
      completed: true,
      order: 1,
    },
    {
      id: 'c3',
      weekStart: '2026-01-26',
      content: '독서 1시간',
      completed: false,
      order: 2,
    },
  ];
  
  checklistItems.forEach((item) => addWeeklyChecklistItem(item));
  
  // Sample daily tasks for Jan 27
  const dailyTasks: DailyTask[] = [
    {
      id: 't1',
      date: '2026-01-27',
      content: '이메일 확인 및 답장',
      completed: true,
      order: 0,
      hour: 9,
    },
    {
      id: 't2',
      date: '2026-01-27',
      content: '프로젝트 문서 작성',
      completed: false,
      order: 1,
      hour: 14,
    },
    {
      id: 't3',
      date: '2026-01-27',
      content: '장보기',
      completed: false,
      order: 2,
      hour: 18,
    },
  ];
  
  dailyTasks.forEach((task) => addDailyTask(task));
};
