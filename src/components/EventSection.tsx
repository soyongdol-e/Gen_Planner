import type { Event } from '../types';
import { Trash2, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef } from 'react';

interface EventSectionProps {
  events: Event[];
  onEventDelete?: (eventId: string) => void;
  onEventReorder?: (eventId: string, newOrder: number) => void;
}

interface DraggableEventItemProps {
  event: Event;
  index: number;
  onEventDelete?: (eventId: string) => void;
  moveEvent: (dragIndex: number, hoverIndex: number) => void;
}

const ITEM_TYPE = 'EVENT_ITEM';

function DraggableEventItem({ event, index, onEventDelete, moveEvent }: DraggableEventItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { index: number },
    void,
    { handlerId: any }
  >({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveEvent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: event.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      style={{ 
        opacity,
        borderLeftColor: event.color, 
        borderLeftWidth: '4px' 
      }}
      className="group flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-move"
    >
      <div className="text-gray-400 hover:text-gray-600">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-body-sm">{event.title}</div>
      </div>
      
      {onEventDelete && (
        <button
          onClick={() => onEventDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function EventSection({ events, onEventDelete, onEventReorder }: EventSectionProps) {
  // Only show all-day events (from monthly calendar)
  const allDayEvents = events
    .filter(event => event.isAllDay)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const moveEvent = (dragIndex: number, hoverIndex: number) => {
    if (!onEventReorder) return;
    
    const dragEvent = allDayEvents[dragIndex];
    onEventReorder(dragEvent.id, hoverIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
        <h2 className="text-heading-sm mb-4">Event</h2>
        
        <div className="flex-1 overflow-auto space-y-2">
          {allDayEvents.length === 0 ? (
            <p className="text-gray-400 text-body-sm">이벤트가 없습니다</p>
          ) : (
            allDayEvents.map((event, index) => (
              <DraggableEventItem
                key={event.id}
                event={event}
                index={index}
                onEventDelete={onEventDelete}
                moveEvent={moveEvent}
              />
            ))
          )}
        </div>
      </div>
    </DndProvider>
  );
}
