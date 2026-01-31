import { useState } from 'react';
import type { DailyTask } from '../../types';

interface TaskItemProps {
  task: DailyTask;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, content: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = () => {
    if (editContent.trim() && editContent !== task.content) {
      onUpdate(task.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditContent(task.content);
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 cursor-pointer"
      />

      {/* Content */}
      {isEditing ? (
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-body-sm border border-blue-500 rounded focus:outline-none"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-body-sm cursor-pointer ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {task.content}
        </span>
      )}

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-body-sm"
      >
        ✕
      </button>
    </div>
  );
}
