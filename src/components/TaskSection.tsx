import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { DailyTask } from '../types';
import { cn } from './ui/utils';

interface TaskSectionProps {
  tasks: DailyTask[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (content: string, hour: number) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskSection({ tasks, onTaskToggle, onTaskAdd, onTaskDelete }: TaskSectionProps) {
  const [addingHour, setAddingHour] = useState<number | null>(null);
  const [newTaskContent, setNewTaskContent] = useState('');

  // Start from 5:00 to align with TimeTable
  const START_HOUR = 5;
  const END_HOUR = 24;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

  const handleAddTask = (hour: number) => {
    if (newTaskContent.trim()) {
      onTaskAdd(newTaskContent.trim(), hour);
      setNewTaskContent('');
      setAddingHour(null);
    }
  };

  const getTasksForHour = (hour: number) => {
    return tasks.filter((t) => t.hour === hour).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Task</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {hours.map((hour) => {
          const hourTasks = getTasksForHour(hour);
          const isAdding = addingHour === hour;

          return (
            <div key={hour} className="border-b last:border-b-0">
              {/* Hour Header */}
              <div className="flex items-center justify-between p-2 bg-gray-50">
                <span className="text-xs font-medium text-gray-600">
                  {hour.toString().padStart(2, '0')}:00
                </span>
                <button
                  onClick={() => setAddingHour(hour)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
              </div>

              {/* Tasks */}
              <div className="p-2 space-y-1">
                {hourTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2 group hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onTaskToggle(task.id)}
                      className="mt-0.5 cursor-pointer"
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        task.completed && 'line-through text-gray-400'
                      )}
                    >
                      {task.content}
                    </span>
                    <button
                      onClick={() => onTaskDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}

                {/* Add Task Input */}
                {isAdding && (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="text"
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTask(hour);
                        } else if (e.key === 'Escape') {
                          setAddingHour(null);
                          setNewTaskContent('');
                        }
                      }}
                      onBlur={() => {
                        if (newTaskContent.trim()) {
                          handleAddTask(hour);
                        } else {
                          setAddingHour(null);
                        }
                      }}
                      placeholder="새 작업..."
                      autoFocus
                      className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
