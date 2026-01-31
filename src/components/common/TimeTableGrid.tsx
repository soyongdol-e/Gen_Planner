import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { Event } from '../../types';
import { 
  getGridConfig, 
  getHourLabels, 
  cellToTime,
  // timeToCellIndex, // Unused but kept for future use
  calculateBlockHeight,
  calculateBlockTop,
  formatTimeDisplay
} from '../../utils/timeTableUtils';

interface TimeTableGridProps {
  unit: 5 | 10 | 15 | 30;
  blocks: Event[];
  onBlockCreate: (startTime: string, endTime: string) => void;
  onBlockClick: (block: Event) => void;
  // onBlockMove: (blockId: string, newStartTime: string, newEndTime: string) => void; // Future feature
}

export default function TimeTableGrid({
  unit,
  blocks,
  onBlockCreate,
  onBlockClick,
  // onBlockMove // Future feature
}: TimeTableGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  // const [movingBlock, setMovingBlock] = useState<{ id: string; offsetY: number } | null>(null); // Future feature
  const gridRef = useRef<HTMLDivElement>(null);

  const config = getGridConfig(unit);
  const hourLabels = getHourLabels();

  // Handle mouse down on grid (start drag selection)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cellIndex = Math.floor(y / config.cellHeight);
    
    setIsDragging(true);
    setDragStart(cellIndex);
    setDragEnd(cellIndex);
  };

  // Handle mouse move (drag selection)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cellIndex = Math.max(0, Math.min(config.totalCells - 1, Math.floor(y / config.cellHeight)));
    
    setDragEnd(cellIndex);
  };

  // Handle mouse up (end drag selection)
  const handleMouseUp = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd) + 1; // End is exclusive
      
      if (end > start) {
        const startTime = cellToTime(start, unit);
        const endTime = cellToTime(end, unit);
        onBlockCreate(startTime, endTime);
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Future feature: Handle block mouse down (start moving)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlockMouseDown = (e: MouseEvent, _blockId: string) => {
    e.stopPropagation();
    // Future implementation
  };

  // Calculate selection highlight
  const getSelectionStyle = () => {
    if (!isDragging || dragStart === null || dragEnd === null) return null;
    
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    const top = start * config.cellHeight;
    const height = (end - start + 1) * config.cellHeight;
    
    return { top, height };
  };

  const selectionStyle = getSelectionStyle();

  return (
    <div className="relative flex">
      {/* Hour Labels */}
      <div className="w-20 flex-shrink-0 border-r border-gray-200">
        {hourLabels.map((label, index) => (
          <div
            key={index}
            className="text-xs text-gray-500 text-right pr-2"
            style={{ height: config.cellHeight * config.cellsPerHour }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 relative">
        <div
          ref={gridRef}
          className="relative bg-white cursor-crosshair select-none"
          style={{ height: config.totalHeight }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Lines */}
          {Array.from({ length: config.totalCells }).map((_, index) => (
            <div
              key={index}
              className={`absolute w-full border-b ${
                index % config.cellsPerHour === 0 ? 'border-gray-300' : 'border-gray-100'
              }`}
              style={{
                top: index * config.cellHeight,
                height: config.cellHeight
              }}
            />
          ))}

          {/* Selection Highlight */}
          {selectionStyle && (
            <div
              className="absolute w-full bg-blue-200 opacity-50 pointer-events-none"
              style={{
                top: selectionStyle.top,
                height: selectionStyle.height
              }}
            />
          )}

          {/* Time Blocks */}
          {blocks.map(block => {
            if (!block.start_time || !block.end_time) return null;
            
            const top = calculateBlockTop(block.start_time, unit, config.cellHeight);
            const height = calculateBlockHeight(block.start_time, block.end_time, unit, config.cellHeight);
            
            return (
              <div
                key={block.id}
                className="absolute left-0 right-0 mx-1 rounded px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  top,
                  height,
                  backgroundColor: block.color,
                  minHeight: config.cellHeight
                }}
                onClick={() => onBlockClick(block)}
                onMouseDown={(e) => handleBlockMouseDown(e, block.id)}
              >
                <div className="text-xs text-white font-medium truncate">
                  {formatTimeDisplay(block.start_time)} - {formatTimeDisplay(block.end_time)}
                </div>
                <div className="text-xs text-white truncate">
                  {block.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
