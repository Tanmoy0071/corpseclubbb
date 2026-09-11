'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSlotsForDate, formatSlotRange, formatDateDisplay, SlotInfo } from '@/lib/booking';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function TimeSlotsPage({ params }: PageProps) {
  const { date } = use(params);
  const router = useRouter();

  const slots: SlotInfo[] = getSlotsForDate(date);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

  // Group slots by hour for visual clarity
  const hourGroups: { [hour: string]: SlotInfo[] } = {};
  slots.forEach((slot) => {
    if (!hourGroups[slot.hourGroup]) {
      hourGroups[slot.hourGroup] = [];
    }
    hourGroups[slot.hourGroup].push(slot);
  });

  // SERIAL SELECTION LOGIC (PRESERVED)
  const handleSlotClick = (index: number) => {
    const slot = slots[index];
    if (slot.isBooked) return;

    if (selectedSlots.length === 0) {
      setSelectedSlots([index]);
      return;
    }

    const min = Math.min(...selectedSlots);
    const max = Math.max(...selectedSlots);

    // Case 1: Adjacent right
    if (index === max + 1) {
      setSelectedSlots([...selectedSlots, index].sort((a, b) => a - b));
      return;
    }

    // Case 2: Adjacent left
    if (index === min - 1) {
      setSelectedSlots([...selectedSlots, index].sort((a, b) => a - b));
      return;
    }

    // Case 3: Clicked within current selection
    if (selectedSlots.includes(index)) {
      if (selectedSlots.length === 1) {
        setSelectedSlots([]);
        return;
      }
      if (index === min) {
        setSelectedSlots(selectedSlots.filter((i) => i !== min));
        return;
      }
      if (index === max) {
        setSelectedSlots(selectedSlots.filter((i) => i !== max));
        return;
      }
      setSelectedSlots([index]);
      return;
    }

    // Case 4: Non-adjacent slot -> starts a NEW selection!
    setSelectedSlots([index]);
  };

  const { startTime, endTime, durationHours } = formatSlotRange(selectedSlots);

  const handleProceed = () => {
    if (selectedSlots.length === 0) return;
    const sorted = [...selectedSlots].sort((a, b) => a - b);
    router.push(`/book/${date}/players?slots=${sorted.join(',')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-10 sm:py-14 space-y-8 pb-36 sm:pb-36">
      
      {/* Header & Back link */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--g200)] pb-6">
        <div>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--red)] font-mono uppercase tracking-wider hover:underline mb-2 cursor-none"
          >
            ← / Back to Date Matrix
          </Link>
          <h1
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white m-0"
          >
            TIME SLOTS // <span className="text-[var(--red)]">{formatDateDisplay(date)}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--g400)] font-sans mt-2">
            33 continuous 20-minute slots. Click adjacent slots to merge duration into a continuous block.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-[var(--g100)] p-3 rounded border border-[var(--g200)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#160608] border border-[var(--red)]" />
            <span className="text-[var(--g400)] text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--red)] shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
            <span className="text-white font-bold text-[11px]">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#1a1a1a] border border-[#2a2a2a]" />
            <span className="text-[var(--g400)] line-through text-[11px]">Booked</span>
          </div>
        </div>
      </div>

      {/* Serial Selection Info Tip */}
      <div className="p-4 rounded border border-[var(--g200)] bg-[#070707] text-xs font-mono text-[var(--g400)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[var(--red)] font-bold">{'// SERIAL SELECTION ACTIVE:'}</span>
          <span>Click any available slot to start. Click adjacent slots to lengthen session.</span>
        </div>
        <span className="text-[var(--red)] text-[11px] hidden sm:inline-block">11:00 AM → 10:00 PM</span>
      </div>

      {/* 33 SLOTS GROUPED BY HOUR */}
      <div className="space-y-6">
        {Object.entries(hourGroups).map(([hourLabel, hourSlots]) => (
          <div key={hourLabel} className="p-5 rounded border border-[var(--g200)] bg-[var(--black)] space-y-4">
            
            {/* Hour Header */}
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--g400)] border-b border-[var(--g200)] pb-2 uppercase tracking-wider">
              <span className="text-[var(--red)]">■</span>
              <span>{hourLabel} HOUR BLOCK</span>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {hourSlots.map((slot) => {
                const isSelected = selectedSlots.includes(slot.index);
                const isBooked = slot.isBooked;

                return (
                  <button
                    key={slot.index}
                    disabled={isBooked}
                    onClick={() => handleSlotClick(slot.index)}
                    className={`p-3.5 rounded border text-left transition-all duration-150 flex items-center justify-between cursor-none ${
                      isBooked
                        ? 'bg-[#111] border-[#222] text-[#444] cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-[var(--red)] border-[var(--red)] text-white font-bold shadow-[0_0_20px_rgba(255,0,0,0.6)] scale-[1.01]'
                        : 'bg-[#080808] border-[var(--g200)] text-[var(--white)] hover:border-[var(--red)] hover:bg-[#12080a]'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-mono font-bold">
                        {slot.timeString} – {slot.endTimeString}
                      </div>
                      <div className={`text-[10px] font-mono uppercase ${isSelected ? 'text-black font-semibold' : 'text-[var(--g400)]'}`}>
                        20 Mins · Slot #{String(slot.index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div>
                      {isBooked ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#555] border border-[#262626]">
                          BOOKED
                        </span>
                      ) : isSelected ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black text-white font-bold">
                          ACTIVE ✓
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1a080a] text-[var(--red)] border border-[var(--red)]/40">
                          OPEN
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* STICKY BOTTOM SUMMARY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--black)]/95 backdrop-blur-md border-t border-[var(--g200)] p-4 sm:p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full sm:w-auto font-mono">
            <div className="w-10 h-10 rounded-full bg-[var(--red)]/20 border border-[var(--red)] flex items-center justify-center text-[var(--red)] font-bold text-sm shrink-0">
              {selectedSlots.length}
            </div>
            
            <div>
              {selectedSlots.length > 0 ? (
                <div>
                  <div className="text-[10px] text-[var(--g400)] uppercase tracking-wider">
                    {selectedSlots.length} Continuous Slot{selectedSlots.length > 1 ? 's' : ''} Selected ({durationHours})
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {startTime} <span className="text-[var(--red)]">→</span> {endTime}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] text-[var(--g400)] uppercase">No Slots Selected</div>
                  <div className="text-xs sm:text-sm text-[var(--g400)]">
                    Click any open 20-min slot above to begin
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            disabled={selectedSlots.length === 0}
            onClick={handleProceed}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-none flex items-center justify-center gap-2 ${
              selectedSlots.length > 0
                ? 'bg-[var(--red)] text-white shadow-[0_0_24px_rgba(255,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,0,0,0.9)] active:scale-95'
                : 'bg-[var(--g100)] text-[var(--g400)] cursor-not-allowed border border-[var(--g200)]'
            }`}
          >
            <span>PROCEED TO CONTROLLER SETUP</span>
            <span>→</span>
          </button>

        </div>
      </div>

    </div>
  );
}
