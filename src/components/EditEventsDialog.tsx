// Simple placeholder for EditEventsDialog
import type { Event } from '../types';
import { formatDate } from '../utils/dateUtils';
import { Trash2 } from 'lucide-react';

interface EditEventsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  events: Event[];
  onEventReorder: (eventId: string, newOrder: number) => void;
  onEventDelete: (eventId: string) => void;
  onEventAdd: () => void;
}

export function EditEventsDialog({
  open,
  onOpenChange,
  date,
  events,
  onEventDelete,
  onEventAdd,
}: EditEventsDialogProps) {
  if (!open || !date) return null;
  
  const dateStr = formatDate(date);
  const dateEvents = events
    .filter(e => e.date === dateStr && e.isAllDay)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">이벤트 편집</h2>
        <p className="text-sm text-gray-500 mb-4">날짜: {dateStr}</p>
        
        <div className="space-y-2 mb-4">
          {dateEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">이벤트가 없습니다</p>
          ) : (
            dateEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{event.title}</span>
                <button
                  onClick={() => onEventDelete(event.id)}
                  className="text-red-500 hover:text-red-700"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onEventAdd}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            추가
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
