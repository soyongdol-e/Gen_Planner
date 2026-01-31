import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  formatDay,
  formatDate,
  getNextDay,
  getPrevDay
} from '../../utils/dateUtils';
import { getTasksByDate, addTask, toggleTask, deleteTask, updateTask } from '../../utils/taskApi';
import { getEventsByDate, addEvent, updateEvent, deleteEvent } from '../../utils/eventApi';
import type { DailyTask, Event } from '../../types';
import TaskItem from '../common/TaskItem';
import EventItem from '../common/EventItem';
import EventModal from '../common/EventModal';
import TimeTableGrid from '../common/TimeTableGrid';
import TimeBlockModal from '../common/TimeBlockModal';

interface DayViewProps {
  initialDate?: Date;
  onMonthClick?: () => void;
}

export default function DayView({ initialDate, onMonthClick }: DayViewProps) {
  const { selectedDate: contextDate, setSelectedDate, timeTableUnit } = useApp();
  const selectedDate = initialDate || contextDate;
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<Event[]>([]);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [isTimeBlockModalOpen, setIsTimeBlockModalOpen] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<Event | undefined>(undefined);
  const [newBlockTime, setNewBlockTime] = useState<{ start: string; end: string } | null>(null);

  // Load tasks and events when date changes
  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    const dateStr = formatDate(selectedDate);
    const [fetchedTasks, fetchedEvents] = await Promise.all([
      getTasksByDate(dateStr),
      getEventsByDate(dateStr)
    ]);
    setTasks(fetchedTasks);
    setEvents(fetchedEvents.filter(e => e.isAllDay)); // Only all-day events in Event section
    setTimeBlocks(fetchedEvents.filter(e => e.isTimeTable)); // TimeTable blocks
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (!newTaskContent.trim()) return;

    const dateStr = formatDate(selectedDate);
    const newTask = await addTask(dateStr, newTaskContent.trim());
    
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const success = await toggleTask(taskId);
    if (success) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleUpdateTask = async (taskId: string, content: string) => {
    const success = await updateTask(taskId, content);
    if (success) {
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, content }
          : task
      ));
    }
  };

  const handlePrevDay = () => {
    setSelectedDate(getPrevDay(selectedDate));
  };

  const handleNextDay = () => {
    setSelectedDate(getNextDay(selectedDate));
  };

  const handleMonthClick = () => {
    onMonthClick?.();
  };

  // Event handlers
  const handleAddEvent = async (title: string, color: string, description?: string) => {
    const dateStr = formatDate(selectedDate);
    const newEvent = await addEvent(dateStr, title, color, description, true, false);
    
    if (newEvent) {
      setEvents([...events, newEvent]);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleUpdateEvent = async (title: string, color: string, description?: string) => {
    if (!editingEvent) return;
    
    const success = await updateEvent(editingEvent.id, { title, color, description });
    if (success) {
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? { ...event, title, color, description }
          : event
      ));
      setEditingEvent(undefined);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    if (success) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(undefined);
  };

  // TimeBlock handlers
  const handleBlockCreate = (startTime: string, endTime: string) => {
    setNewBlockTime({ start: startTime, end: endTime });
    setIsTimeBlockModalOpen(true);
  };

  const handleAddTimeBlock = async (title: string, color: string, startTime: string, endTime: string) => {
    const dateStr = formatDate(selectedDate);
    const newBlock = await addEvent(dateStr, title, color, undefined, false, true, startTime, endTime);
    
    if (newBlock) {
      setTimeBlocks([...timeBlocks, newBlock]);
    }
  };

  const handleBlockClick = (block: Event) => {
    setEditingTimeBlock(block);
    setIsTimeBlockModalOpen(true);
  };

  const handleUpdateTimeBlock = async (title: string, color: string, startTime: string, endTime: string) => {
    if (!editingTimeBlock) return;
    
    const success = await updateEvent(editingTimeBlock.id, { 
      title, 
      color, 
      start_time: startTime,
      end_time: endTime 
    });
    
    if (success) {
      setTimeBlocks(timeBlocks.map(block =>
        block.id === editingTimeBlock.id
          ? { ...block, title, color, start_time: startTime, end_time: endTime }
          : block
      ));
      setEditingTimeBlock(undefined);
    }
  };

  const handleDeleteTimeBlock = async () => {
    if (!editingTimeBlock) return;
    
    const success = await deleteEvent(editingTimeBlock.id);
    if (success) {
      setTimeBlocks(timeBlocks.filter(block => block.id !== editingTimeBlock.id));
      setEditingTimeBlock(undefined);
    }
  };

  // Future feature: Block move functionality
  // const handleBlockMove = async (blockId: string, newStartTime: string, newEndTime: string) => {
  //   const success = await updateEvent(blockId, { 
  //     start_time: newStartTime,
  //     end_time: newEndTime 
  //   });
  //   
  //   if (success) {
  //     setTimeBlocks(timeBlocks.map(block =>
  //       block.id === blockId
  //         ? { ...block, start_time: newStartTime, end_time: newEndTime }
  //         : block
  //     ));
  //   }
  // };

  const handleCloseTimeBlockModal = () => {
    setIsTimeBlockModalOpen(false);
    setEditingTimeBlock(undefined);
    setNewBlockTime(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={handlePrevDay}
            className="text-gray-400 hover:text-gray-600"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{formatDay(getPrevDay(selectedDate))}일</span>
            <span className="text-2xl font-bold">{formatDay(selectedDate)}일</span>
            <span className="text-gray-400">{formatDay(getNextDay(selectedDate))}일</span>
          </div>
          <button 
            onClick={handleNextDay}
            className="text-gray-400 hover:text-gray-600"
          >
            →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <button 
            onClick={handleMonthClick}
            className="text-blue-600 hover:underline mb-4"
          >
            {selectedDate.getMonth() + 1}월
          </button>
          <div className="text-sm text-gray-500">
            Mini Calendar (TODO)
          </div>
        </div>

        {/* Task Section */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Task</h3>
          
          {loading ? (
            <div className="text-sm text-gray-400">로딩 중...</div>
          ) : (
            <>
              {/* Task List */}
              <div className="space-y-1 mb-4">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                ))}
              </div>

              {/* Add Task */}
              {isAddingTask ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                      if (e.key === 'Escape') {
                        setIsAddingTask(false);
                        setNewTaskContent('');
                      }
                    }}
                    placeholder="할 일 입력..."
                    className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    추가
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingTask(true)}
                  className="w-full text-left text-sm text-gray-400 hover:text-gray-600"
                >
                  + 할 일 추가
                </button>
              )}
            </>
          )}
        </div>

        {/* TimeTable Section */}
        <div className="flex-1 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <h3 className="font-semibold">Time Table</h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-sm text-gray-400">로딩 중...</div>
            ) : (
              <TimeTableGrid
                unit={timeTableUnit}
                blocks={timeBlocks}
                onBlockCreate={handleBlockCreate}
                onBlockClick={handleBlockClick}
              />
            )}
          </div>
        </div>

        {/* Event Section */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Event</h3>
          
          {loading ? (
            <div className="text-sm text-gray-400">로딩 중...</div>
          ) : (
            <>
              {/* Event List */}
              <div className="space-y-1 mb-4">
                {events.map(event => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>

              {/* Add Event */}
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="w-full text-left text-sm text-gray-400 hover:text-gray-600"
              >
                + 추가
              </button>
            </>
          )}
        </div>

        {/* Comment Section */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Comment</h3>
          <div className="text-sm text-gray-500">
            Comment Canvas (TODO)
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        onSave={editingEvent ? handleUpdateEvent : handleAddEvent}
        event={editingEvent}
      />

      {/* TimeBlock Modal */}
      <TimeBlockModal
        isOpen={isTimeBlockModalOpen}
        onClose={handleCloseTimeBlockModal}
        onSave={editingTimeBlock ? handleUpdateTimeBlock : handleAddTimeBlock}
        onDelete={editingTimeBlock ? handleDeleteTimeBlock : undefined}
        block={editingTimeBlock}
        initialStartTime={newBlockTime?.start}
        initialEndTime={newBlockTime?.end}
      />
    </div>
  );
}
