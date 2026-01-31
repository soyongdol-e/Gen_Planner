import { useState, useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import type { Event } from '../types';
import { cn } from './ui/utils';

interface TimeTableSectionProps {
  events: Event[];
  onEventAdd: (event: Omit<Event, 'id' | 'date'>) => void;
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void;
  onEventDelete: (eventId: string) => void;
}

const START_HOUR = 5;
const END_HOUR = 24;
const TIME_SLOTS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);
const MINUTE_COLUMNS = 6; // 10-minute blocks per hour
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface BlockPosition {
  hour: number;
  column: number;
}

interface CellData {
  eventId: string;
  isFirstCell: boolean;
  colSpan: number;
}

export function TimeTableSection({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: TimeTableSectionProps) {
  const [dragStart, setDragStart] = useState<BlockPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<BlockPosition | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  
  // Format time as HH:MM
  const formatTime = (hour: number, minute: number = 0): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
  
  // Parse time string to get hour and minute
  const parseTime = (timeStr: string): { hour: number; minute: number } => {
    const [hourStr, minuteStr] = timeStr.split(':');
    return {
      hour: parseInt(hourStr),
      minute: parseInt(minuteStr),
    };
  };
  
  // Get cell map for each row
  const getCellMap = (): Map<string, CellData> => {
    const cellMap = new Map<string, CellData>();
    
    events.forEach(event => {
      if (event.isAllDay || !event.startTime || !event.endTime) return;
      
      const start = parseTime(event.startTime);
      const end = parseTime(event.endTime);
      
      const startHour = start.hour;
      const startCol = Math.floor(start.minute / 10);
      const endHour = end.minute === 0 ? end.hour - 1 : end.hour;
      const endCol = end.minute === 0 ? 5 : Math.ceil(end.minute / 10) - 1;
      
      // Process each row separately
      for (let h = startHour; h <= endHour; h++) {
        const isFirstRow = h === startHour;
        const isLastRow = h === endHour;
        
        let rowStartCol: number;
        let rowEndCol: number;
        
        if (isFirstRow && isLastRow) {
          // Same row
          rowStartCol = startCol;
          rowEndCol = endCol;
        } else if (isFirstRow) {
          // First row of multi-row event
          rowStartCol = startCol;
          rowEndCol = MINUTE_COLUMNS - 1;
        } else if (isLastRow) {
          // Last row of multi-row event
          rowStartCol = 0;
          rowEndCol = endCol;
        } else {
          // Middle row of multi-row event
          rowStartCol = 0;
          rowEndCol = MINUTE_COLUMNS - 1;
        }
        
        const colSpan = rowEndCol - rowStartCol + 1;
        
        // Mark cells in this row
        for (let c = rowStartCol; c <= rowEndCol; c++) {
          const key = `${h}-${c}`;
          cellMap.set(key, {
            eventId: event.id,
            isFirstCell: c === rowStartCol,
            colSpan: colSpan,
          });
        }
      }
    });
    
    return cellMap;
  };
  
  const handleBlockMouseDown = (hour: number, column: number) => {
    setDragStart({ hour, column });
    setDragEnd({ hour, column });
  };
  
  const handleBlockMouseEnter = (hour: number, column: number) => {
    if (dragStart !== null) {
      setDragEnd({ hour, column });
    }
  };
  
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragStart !== null && dragEnd !== null) {
        const startHour = Math.min(dragStart.hour, dragEnd.hour);
        const endHour = Math.max(dragStart.hour, dragEnd.hour);
        const startCol = Math.min(dragStart.column, dragEnd.column);
        const endCol = Math.max(dragStart.column, dragEnd.column);
        
        const startMinute = startCol * 10;
        const endMinute = (endCol + 1) * 10;
        
        let finalEndHour = endHour;
        let finalEndMinute = endMinute;
        if (finalEndMinute === 60) {
          finalEndHour += 1;
          finalEndMinute = 0;
        }
        
        const newEvent = {
          title: '새 일정',
          startTime: formatTime(startHour, startMinute),
          endTime: formatTime(finalEndHour, finalEndMinute),
          color: selectedColor,
          isAllDay: false,
          isTimeTable: true, // Mark as Time Table event
        };
        
        onEventAdd(newEvent);
      }
      
      setDragStart(null);
      setDragEnd(null);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart, dragEnd, selectedColor, onEventAdd]);
  
  const isBlockInSelection = (hour: number, column: number): boolean => {
    if (dragStart === null || dragEnd === null) return false;
    
    const minHour = Math.min(dragStart.hour, dragEnd.hour);
    const maxHour = Math.max(dragStart.hour, dragEnd.hour);
    const minCol = Math.min(dragStart.column, dragEnd.column);
    const maxCol = Math.max(dragStart.column, dragEnd.column);
    
    // Check if hour is within range
    if (hour < minHour || hour > maxHour) return false;
    
    // If single hour selection
    if (minHour === maxHour) {
      return column >= minCol && column <= maxCol;
    }
    
    // Multi-hour selection
    if (hour === minHour) {
      // First row: from minCol to end
      return column >= minCol;
    } else if (hour === maxHour) {
      // Last row: from start to maxCol
      return column <= maxCol;
    } else {
      // Middle rows: all columns
      return true;
    }
  };
  
  const handleEventClick = (eventId: string) => {
    setEditingEvent(eventId);
  };
  
  const handleTitleChange = (eventId: string, newTitle: string) => {
    onEventUpdate(eventId, { title: newTitle });
  };
  
  const handleColorChange = (eventId: string, color: string) => {
    onEventUpdate(eventId, { color });
    setShowColorPicker(null);
  };
  
  const cellMap = getCellMap();
  
  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-base font-semibold">Time Table</h2>
        <div className="flex gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-all',
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex-1 select-none flex flex-col">
        {TIME_SLOTS.map((hour) => {
          const rowCells: React.ReactElement[] = [];
          let skipColumns = 0;
          
          for (let column = 0; column < MINUTE_COLUMNS; column++) {
            if (skipColumns > 0) {
              skipColumns--;
              continue;
            }
            
            const key = `${hour}-${column}`;
            const cellData = cellMap.get(key);
            
            // Render event cell
            if (cellData && cellData.isFirstCell) {
              const event = events.find(e => e.id === cellData.eventId);
              if (event) {
                const isEditing = editingEvent === event.id;
                const start = parseTime(event.startTime!);
                const isFirstRow = hour === start.hour;
                
                skipColumns = cellData.colSpan - 1;
                
                rowCells.push(
                  <div
                    key={column}
                    className="p-1 cursor-pointer relative group"
                    style={{ 
                      gridColumn: `span ${cellData.colSpan}`,
                      backgroundColor: event.color,
                      borderLeft: '1px solid rgb(209 213 219)',
                      borderRight: '1px solid rgb(209 213 219)',
                      borderTop: isFirstRow ? '1px solid rgb(209 213 219)' : 'none',
                      borderBottom: '1px solid rgb(209 213 219)',
                    }}
                    onClick={() => handleEventClick(event.id)}
                  >
                    {isFirstRow && (
                      <div className="text-white text-[10px]">
                        <div className="font-medium opacity-90 mb-1">
                          {event.startTime} - {event.endTime}
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => handleTitleChange(event.id, e.target.value)}
                            onBlur={() => setEditingEvent(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingEvent(null);
                              if (e.key === 'Escape') setEditingEvent(null);
                            }}
                            className="w-full bg-white text-gray-900 px-1 py-0.5 text-[10px] rounded"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div className="font-semibold">{event.title}</div>
                        )}
                      </div>
                    )}
                    
                    {isFirstRow && (
                      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowColorPicker(showColorPicker === event.id ? null : event.id);
                          }}
                          className="p-0.5 hover:bg-white/20 rounded bg-black/20"
                        >
                          <Palette className="size-2.5 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventDelete(event.id);
                          }}
                          className="p-0.5 hover:bg-white/20 rounded bg-black/20"
                        >
                          <X className="size-2.5 text-white" />
                        </button>
                      </div>
                    )}
                    
                    {isFirstRow && showColorPicker === event.id && (
                      <div
                        className="absolute top-full mt-1 left-0 bg-white rounded shadow-lg p-1.5 flex gap-1 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(event.id, color)}
                            className="w-5 h-5 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            } else if (!cellData) {
              // Render empty cell
              rowCells.push(
                <div
                  key={column}
                  className={cn(
                    'border border-gray-200 cursor-crosshair transition-colors',
                    isBlockInSelection(hour, column) ? 'bg-blue-300' : 'hover:bg-blue-50'
                  )}
                  onMouseDown={() => handleBlockMouseDown(hour, column)}
                  onMouseEnter={() => handleBlockMouseEnter(hour, column)}
                />
              );
            }
          }
          
          return (
            <div key={hour} className="flex-1 flex border-b last:border-b-0">
              <div className="text-[11px] text-gray-500 w-12 flex-shrink-0 px-2 text-center pt-1 border-r border-gray-200">
                {formatTime(hour)}
              </div>
              <div className="flex-1 grid grid-cols-6">
                {rowCells}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-2 text-[10px] text-gray-500 text-center border-t">
        블록을 드래그하여 일정을 추가하세요
      </div>
    </div>
  );
}