import { useState } from 'react';
import type { Event } from '../../types';
import { EVENT_COLORS } from '../../utils/constants';

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, color: string, startTime: string, endTime: string) => void;
  onDelete?: () => void;
  block?: Event;
  initialStartTime?: string;
  initialEndTime?: string;
}

export default function TimeBlockModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  block,
  initialStartTime,
  initialEndTime
}: TimeBlockModalProps) {
  const [title, setTitle] = useState(block?.title || '');
  const [color, setColor] = useState(block?.color || EVENT_COLORS[0].value);
  const [startTime, setStartTime] = useState(block?.startTime || initialStartTime || '09:00');
  const [endTime, setEndTime] = useState(block?.endTime || initialEndTime || '10:00');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), color, startTime, endTime);
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setColor(EVENT_COLORS[0].value);
    setStartTime('09:00');
    setEndTime('10:00');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {block ? 'Edit Time Block' : 'Add Time Block'}
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Block title"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Time Range */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c.value ? 'border-gray-900' : 'border-gray-200'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          {block && onDelete ? (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              Delete
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {block ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
