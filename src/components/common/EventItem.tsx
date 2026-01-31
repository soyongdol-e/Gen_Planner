import type { Event } from '../../types';

interface EventItemProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function EventItem({ event, onEdit, onDelete }: EventItemProps) {
  return (
    <div className="group flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
      {/* Color Indicator */}
      <div
        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
        style={{ backgroundColor: event.color }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          onClick={() => onEdit(event)}
          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
        >
          {event.title}
        </div>
        {event.description && (
          <div className="text-xs text-gray-400 truncate">
            {event.description}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(event.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-sm flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
