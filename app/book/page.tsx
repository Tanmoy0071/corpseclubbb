'use client';

import { useRouter } from 'next/navigation';
import { getAvailableDates, BookingDate } from '@/lib/booking';
import Link from 'next/link';

export default function DateSelectionPage() {
  const router = useRouter();
  const availableDates = getAvailableDates();

  const handleSelectDate = (dateStr: string) => {
    router.push(`/book/${dateStr}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-12 sm:py-16 space-y-10">
      
      {/* Header breadcrumb & title */}
      <div className="space-y-4 border-b border-[var(--g200)] pb-8">
        <div className="flex items-center gap-3 text-xs font-mono text-[var(--red)] uppercase tracking-wider">
          <Link href="/" className="text-[var(--g400)] hover:text-white transition-colors cursor-none">
            ← / Return to Arena Hub
          </Link>
          <span className="text-[var(--g300)]">|</span>
          <span>STEP 01 OF 04 // DATE MATRIX</span>
        </div>

        <h1
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-white m-0"
        >
          SELECT <span className="text-[var(--red)]">BOOKING DATE</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--g400)] max-w-2xl font-sans">
          Corpse Club operates on 33 continuous 20-minute slots per day (11:00 AM – 10:00 PM). Reservations open for today and the next 14 calendar days.
        </p>
      </div>

      {/* Date Picker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {availableDates.map((item: BookingDate) => {
          return (
            <button
              key={item.dateString}
              onClick={() => handleSelectDate(item.dateString)}
              className="p-5 rounded border border-[var(--g200)] text-left transition-all duration-200 relative group flex flex-col justify-between h-40 sm:h-48 bg-[#080808] hover:bg-[#121212] hover:border-[var(--red)] cursor-none"
            >
              {/* Top Row: Day Name & Badges */}
              <div className="flex items-center justify-between w-full font-mono">
                <span className="text-xs uppercase font-bold text-[var(--g400)] group-hover:text-[var(--red)] transition-colors">
                  {item.dayName}
                </span>

                {item.isToday ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--red)] text-white uppercase">
                    TODAY
                  </span>
                ) : item.isWeekend ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[var(--g100)] text-[var(--g400)] border border-[var(--g200)]">
                    WEEKEND
                  </span>
                ) : null}
              </div>

              {/* Day Number & Month */}
              <div>
                <div
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl sm:text-5xl font-black text-white group-hover:text-[var(--red)] transition-colors"
                >
                  {item.dayNumber}
                </div>
                <div className="text-xs font-mono text-[var(--g400)] uppercase mt-0.5">
                  {item.monthName}
                </div>
              </div>

              {/* Footer: Availability */}
              <div className="pt-3 border-t border-[var(--g200)] flex items-center justify-between text-[11px] font-mono w-full">
                <span className="text-[var(--red)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] animate-pulse" />
                  {item.availableCount} slots
                </span>
                <span className="text-[var(--g400)] group-hover:text-white transition-colors">
                  Select →
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
