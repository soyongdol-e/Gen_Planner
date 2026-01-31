// Simplified EventSection
import type { Event } from '../types';

interface EventSectionProps {
  events: Event[];
  onEventDelete: (eventId: string) => void;
  onEventReorder?: (eventId: string, newOrder: number) => void;
}

export function EventSection({ events, onEventDelete }: EventSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h3 className="font-semibold mb-3">Event</h3>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {events.length === 0 ? (
          <p className="text-sm text-gray-400">이벤트가 없습니다</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-2 rounded text-xs group relative"
              style={{ backgroundColor: event.color, color: 'white' }}
            >
              <div className="font-semibold">{event.title}</div>
              {event.description && (
                <div className="text-[10px] mt-0.5 opacity-90">{event.description}</div>
              )}
              <button
                onClick={() => onEventDelete(event.id)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs bg-white text-red-500 px-1 rounded"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
