
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const pad = (value: number) => String(value).padStart(2, '0');


export function toDateKey(isoDate: string): string {
  const date = new Date(isoDate);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}


export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}


export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = date.getHours();
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${pad(date.getMinutes())} ${meridiem}`;
}


export function formatDateTime(isoDate: string): string {
  return `${formatDate(isoDate)}, ${formatTime(isoDate)}`;
}

export function formatRelativeDay(isoDate: string): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const key = toDateKey(isoDate);

  if (key === toDateKey(today.toISOString())) return 'Today';
  if (key === toDateKey(yesterday.toISOString())) return 'Yesterday';

  return formatDate(isoDate);
}
