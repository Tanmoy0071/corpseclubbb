export interface SlotInfo {
  index: number;
  timeString: string;
  endTimeString: string;
  hourGroup: string;
  isBooked: boolean;
}

export interface BookingDate {
  dateString: string; // YYYY-MM-DD
  dayName: string; // e.g. Wed
  dayNumber: number; // e.g. 26
  monthName: string; // e.g. Aug
  isToday: boolean;
  isWeekend: boolean;
  availableCount: number;
}

// Generate today + 14 days (15 days total)
export function getAvailableDates(): BookingDate[] {
  const dates: BookingDate[] = [];
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // Pseudo-random total available slots based on date string
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const availableCount = 20 + (seed % 10);

    dates.push({
      dateString,
      dayName,
      dayNumber,
      monthName,
      isToday: i === 0,
      isWeekend,
      availableCount,
    });
  }

  return dates;
}

// Generate 33 20-minute slots from 11:00 AM to 10:00 PM (10:00 PM is 22:00)
// Total 11 hours = 660 mins = 33 slots of 20 mins
export function getSlotsForDate(dateString: string): SlotInfo[] {
  const slots: SlotInfo[] = [];
  const startHour = 11; // 11:00 AM
  const totalSlots = 33;

  // Simple deterministic pseudo-random booked slots per date
  const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bookedIndices = new Set<number>();
  
  // Predictably mark ~8-10 slots as booked
  [2, 3, 7, 12, 13, 14, 21, 22, 28].forEach((idx) => {
    if ((idx + seed) % 2 === 0 || idx === 13 || idx === 21) {
      bookedIndices.add(idx);
    }
  });

  for (let i = 0; i < totalSlots; i++) {
    const totalMinutesFromStart = i * 20;
    const slotHour = startHour + Math.floor(totalMinutesFromStart / 60);
    const slotMinute = totalMinutesFromStart % 60;

    const endTotalMinutesFromStart = (i + 1) * 20;
    const endSlotHour = startHour + Math.floor(endTotalMinutesFromStart / 60);
    const endSlotMinute = endTotalMinutesFromStart % 60;

    const timeString = formatTime(slotHour, slotMinute);
    const endTimeString = formatTime(endSlotHour, endSlotMinute);

    // Grouping hour label (e.g. 11:00 AM, 12:00 PM)
    const hourLabel = formatHourLabel(slotHour);

    slots.push({
      index: i,
      timeString,
      endTimeString,
      hourGroup: hourLabel,
      isBooked: bookedIndices.has(i),
    });
  }

  return slots;
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMin = String(minute).padStart(2, '0');
  return `${String(displayHour).padStart(2, '0')}:${displayMin} ${period}`;
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

export function formatSlotRange(selectedSlots: number[]): {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  durationHours: string;
} {
  if (!selectedSlots || selectedSlots.length === 0) {
    return { startTime: '', endTime: '', durationMinutes: 0, durationHours: '0 mins' };
  }

  const sorted = [...selectedSlots].sort((a, b) => a - b);
  const minIndex = sorted[0];
  const maxIndex = sorted[sorted.length - 1];

  const allSlots = getSlotsForDate('2026-01-01'); // helper time generator
  const startTime = allSlots[minIndex]?.timeString || '';
  const endTime = allSlots[maxIndex]?.endTimeString || '';

  const durationMinutes = sorted.length * 20;
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  
  let durationHours = '';
  if (hours > 0 && mins > 0) {
    durationHours = `${hours}h ${mins}m`;
  } else if (hours > 0) {
    durationHours = `${hours} hr${hours > 1 ? 's' : ''}`;
  } else {
    durationHours = `${mins} mins`;
  }

  return { startTime, endTime, durationMinutes, durationHours };
}

// Rate per 20 min slot:
// 1 Player = ₹50 / slot (₹150/hr)
// 2 Players = ₹80 / slot (₹240/hr)
export function calculatePrice(slotCount: number, playerCount: number): {
  perSlotRate: number;
  totalPrice: number;
  perHourRate: number;
} {
  const perSlotRate = playerCount === 2 ? 80 : 50;
  const totalPrice = slotCount * perSlotRate;
  const perHourRate = perSlotRate * 3;
  return { perSlotRate, totalPrice, perHourRate };
}

export function formatDateDisplay(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}
