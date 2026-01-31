// TimeTable utilities

// Convert cell index to time string (HH:mm)
export const cellToTime = (cellIndex: number, unit: number): string => {
  const totalMinutes = cellIndex * unit;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Convert time string (HH:mm) to cell index
export const timeToCellIndex = (time: string, unit: number): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return Math.floor(totalMinutes / unit);
};

// Get grid configuration based on unit
export const getGridConfig = (unit: 5 | 10 | 15 | 30) => {
  const cellsPerHour = 60 / unit;
  const totalCells = 24 * cellsPerHour;
  const cellHeight = {
    5: 20,   // 20px per 5min
    10: 40,  // 40px per 10min
    15: 60,  // 60px per 15min
    30: 120  // 120px per 30min
  }[unit];

  return {
    unit,
    cellsPerHour,
    totalCells,
    cellHeight,
    totalHeight: totalCells * cellHeight
  };
};

// Get hour labels (0-23)
export const getHourLabels = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour} ${period}`;
  });
};

// Calculate block height from start/end time
export const calculateBlockHeight = (
  startTime: string,
  endTime: string,
  unit: number,
  cellHeight: number
): number => {
  const startCell = timeToCellIndex(startTime, unit);
  const endCell = timeToCellIndex(endTime, unit);
  return (endCell - startCell) * cellHeight;
};

// Calculate block top position
export const calculateBlockTop = (
  startTime: string,
  unit: number,
  cellHeight: number
): number => {
  const startCell = timeToCellIndex(startTime, unit);
  return startCell * cellHeight;
};

// Format time for display (e.g., "2:30 PM")
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
};
