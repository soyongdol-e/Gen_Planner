// Simple placeholder for AddEventDialog
import { formatDate } from '../utils/dateUtils';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  onSave: (title: string) => void;
}

export function AddEventDialog({ open, onOpenChange, date, onSave }: AddEventDialogProps) {
  if (!open || !date) return null;
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    if (title.trim()) {
      onSave(title.trim());
      onOpenChange(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-heading-md mb-4">이벤트 추가</h2>
        <p className="text-body-sm text-gray-500 mb-4">날짜: {formatDate(date)}</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="이벤트 제목"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            autoFocus
          />
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
