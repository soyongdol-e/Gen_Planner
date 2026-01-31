import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { Event } from '../types';
import { cn } from './ui/utils';

interface TimeTableSectionProps {
  events: Event[];
  onEventAdd: (eventData: Omit<Event, 'id' | 'date'>) => void;
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void;
  onEventDelete: (eventId: string) => void;
}

const EVENT_COLORS = [
  { label: '핑크', value: '#ec4899' },
  { label: '퍼플', value: '#a855f7' },
  { label: '블루', value: '#3b82f6' },
  { label: '그린', value: '#10b981' },
  { label: '옐로우', value: '#f59e0b' },
  { label: '레드', value: '#ef4444' },
];

export function TimeTableSection({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: TimeTableSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingId) {
      onEventUpdate(editingId, { title, color, startTime, endTime });
      setEditingId(null);
    } else {
      onEventAdd({
        title,
        color,
        startTime,
        endTime,
        isAllDay: false,
        isTimeTable: true,
      });
    }

    // Reset
    setTitle('');
    setColor(EVENT_COLORS[0].value);
    setStartTime('09:00');
    setEndTime('10:00');
    setIsAdding(false);
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setColor(event.color);
    setStartTime(event.startTime || '09:00');
    setEndTime(event.endTime || '10:00');
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setTitle('');
    setColor(EVENT_COLORS[0].value);
    setStartTime('09:00');
    setEndTime('10:00');
  };

  // Parse time to minutes for positioning
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getEventStyle = (event: Event) => {
    if (!event.startTime || !event.endTime) return {};

    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const duration = endMinutes - startMinutes;

    const hourHeight = 60; // pixels per hour
    const top = (startMinutes / 60) * hourHeight;
    const height = (duration / 60) * hourHeight;

    return {
      position: 'absolute' as const,
      top: `${top}px`,
      left: '60px',
      right: '0',
      height: `${height}px`,
      backgroundColor: event.color,
      color: 'white',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 10,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Time Table</h2>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>

      {isAdding && (
        <div className="p-4 border-b bg-gray-50 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="flex items-center">~</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2">
            {EVENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={cn(
                  'w-8 h-8 rounded-full border-2',
                  color === c.value ? 'border-gray-900' : 'border-transparent'
                )}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="flex-1">
              {editingId ? '수정' : '추가'}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1">
              취소
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto relative">
        {/* Time Grid */}
        <div className="relative" style={{ height: `${24 * 60}px` }}>
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-start border-b"
              style={{ height: '60px' }}
            >
              <div className="w-14 text-xs text-gray-500 text-right pr-2 pt-1">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative"></div>
            </div>
          ))}

          {/* Events */}
          {events.map((event) => (
            <div key={event.id} style={getEventStyle(event)} className="group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{event.title}</div>
                  <div className="text-xs opacity-90">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onEventDelete(event.id)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
