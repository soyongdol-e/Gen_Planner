import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationBarProps {
  currentLabel: string;
  prevLabel?: string;
  nextLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  onPrevLabelClick?: () => void;
  onNextLabelClick?: () => void;
  onCurrentClick?: () => void;
  rightButtons?: React.ReactNode;
  leftContent?: React.ReactNode;
}

export function NavigationBar({
  currentLabel,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onPrevLabelClick,
  onNextLabelClick,
  onCurrentClick,
  rightButtons,
  leftContent,
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
      {/* Left content or empty space */}
      <div className="flex-1">{leftContent}</div>
      
      {/* Centered navigation */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" onClick={onPrev}>
          <ChevronLeft className="size-5" />
        </Button>
        
        {prevLabel && (
          <button
            onClick={onPrevLabelClick}
            className="text-xs md:text-sm text-gray-400 hover:text-gray-600 transition-colors px-1 md:px-2 hidden sm:block"
          >
            {prevLabel}
          </button>
        )}
        
        <button
          onClick={onCurrentClick}
          className="text-lg md:text-2xl font-bold px-2 md:px-4 hover:text-gray-700 transition-colors"
        >
          {currentLabel}
        </button>
        
        {nextLabel && (
          <button
            onClick={onNextLabelClick}
            className="text-xs md:text-sm text-gray-400 hover:text-gray-600 transition-colors px-1 md:px-2 hidden sm:block"
          >
            {nextLabel}
          </button>
        )}
        
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
      
      {/* Right buttons */}
      {rightButtons ? (
        <div className="flex items-center gap-1 md:gap-2 flex-1 justify-end">{rightButtons}</div>
      ) : (
        <div className="flex-1"></div>
      )}
    </div>
  );
}
