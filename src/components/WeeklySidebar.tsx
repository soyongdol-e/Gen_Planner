import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import type { WeeklyChecklistItem } from '../types';
import { getMonthName } from '../utils/dateUtils';

interface WeeklySidebarProps {
  weekStart: Date;
  monthlyMemo: string;
  checklistItems: WeeklyChecklistItem[];
  onChecklistToggle: (itemId: string) => void;
  onChecklistAdd: (content: string) => void;
  onChecklistDelete: (itemId: string) => void;
  onMonthClick?: () => void;
  onWeekClick?: (weekStart: Date) => void;
}

export function WeeklySidebar({
  weekStart,
  monthlyMemo,
  checklistItems,
  onChecklistToggle,
  onChecklistAdd,
  onChecklistDelete,
  onMonthClick,
}: WeeklySidebarProps) {
  const [isMonthlyMemoExpanded, setIsMonthlyMemoExpanded] = useState(true);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const year = weekStart.getFullYear();
  const month = weekStart.getMonth();

  const handleAddItem = () => {
    if (newChecklistItem.trim()) {
      onChecklistAdd(newChecklistItem.trim());
      setNewChecklistItem('');
      setIsAddingItem(false);
    }
  };

  return (
    <div className="w-80 border-r bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto md:block hidden">
      {/* Monthly Memo */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <button
          onClick={() => setIsMonthlyMemoExpanded(!isMonthlyMemoExpanded)}
          className="flex items-center justify-between w-full mb-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMonthClick?.();
            }}
            className="font-semibold text-lg text-blue-600 hover:underline"
          >
            {year}년 {getMonthName(month)}
          </button>
          {isMonthlyMemoExpanded ? (
            <ChevronUp className="size-5 text-gray-500" />
          ) : (
            <ChevronDown className="size-5 text-gray-500" />
          )}
        </button>

        {isMonthlyMemoExpanded && (
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {monthlyMemo || '월별 메모가 없습니다'}
          </div>
        )}
      </div>

      {/* Weekly Checklist */}
      <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
        <h3 className="font-semibold text-lg mb-3">Weekly Checklist</h3>

        <div className="space-y-2">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-start gap-2 group">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onChecklistToggle(item.id)}
                className="mt-1 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
                >
                  {item.content}
                </span>
              </div>
              <button
                onClick={() => onChecklistDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                title="삭제"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}

          {isAddingItem ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                  if (e.key === 'Escape') {
                    setIsAddingItem(false);
                    setNewChecklistItem('');
                  }
                }}
                placeholder="체크리스트 항목..."
                className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button size="sm" onClick={handleAddItem}>
                추가
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>항목 추가</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
