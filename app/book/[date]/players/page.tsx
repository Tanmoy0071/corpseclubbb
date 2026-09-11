'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatSlotRange, calculatePrice, formatDateDisplay } from '@/lib/booking';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function PlayerSelectionPage({ params }: PageProps) {
  const { date } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const slotsParam = searchParams.get('slots') || '';
  const selectedSlots = slotsParam ? slotsParam.split(',').map((s) => parseInt(s, 10)) : [];
  
  const [players, setPlayers] = useState<number>(1);

  const { startTime, endTime, durationHours } = formatSlotRange(selectedSlots);
  const slotCount = selectedSlots.length;

  const { perSlotRate, totalPrice } = calculatePrice(slotCount, players);

  const handleProceedToCheckout = () => {
    if (slotCount === 0) return;
    router.push(`/book/${date}/checkout?slots=${slotsParam}&players=${players}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--g200)] pb-6">
        <Link
          href={`/book/${date}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--red)] font-mono uppercase tracking-wider hover:underline mb-2 cursor-none"
        >
          ← / Back to Time Slots
        </Link>
        <h1
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white m-0"
        >
          CONTROLLER SETUP // <span className="text-[var(--red)]">SOLO OR DUO</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--g400)] font-sans">
          Select single or dual player configuration. Hardware allocations and rates update automatically.
        </p>
      </div>

      {/* Booking Summary Telemetry Strip */}
      <div className="p-5 rounded border border-[var(--g200)] bg-[#070707] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-[var(--red)] border-b border-[var(--g200)] pb-2 uppercase">
          <span>{'// SESSION TELEMETRY'}</span>
          <span>{formatDateDisplay(date)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-[10px] text-[var(--g400)] uppercase">Time Range</div>
            <div className="text-sm font-bold text-white mt-0.5">{startTime} → {endTime}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--g400)] uppercase">Total Duration</div>
            <div className="text-sm font-bold text-[var(--red)] mt-0.5">{slotCount} Slots ({durationHours})</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--g400)] uppercase">Station Display</div>
            <div className="text-sm font-bold text-white mt-0.5">55&quot; 4K 120Hz OLED</div>
          </div>
        </div>
      </div>

      {/* CONTROLLER CHOICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1: 1 Player */}
        <button
          onClick={() => setPlayers(1)}
          className={`p-6 sm:p-8 rounded border text-left transition-all duration-200 relative space-y-5 cursor-none ${
            players === 1
              ? 'bg-[#14080a] border-[var(--red)] shadow-[0_0_30px_rgba(232,25,26,0.3)]'
              : 'bg-[#080808] border-[var(--g200)] hover:border-[var(--g300)]'
          }`}
        >
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-[var(--red)] uppercase tracking-wider">TIER A // SOLO</span>
            {players === 1 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--red)] text-white font-bold">
                SELECTED ✓
              </span>
            )}
          </div>

          <div>
            <h3
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-black uppercase text-white"
            >
              1 PLAYER (SOLO)
            </h3>
            <p className="text-xs text-[var(--g400)] font-sans mt-1">
              1 DualSense Wireless Controller. Perfect for single-player campaign story modes.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--g200)] flex items-baseline justify-between font-mono">
            <div>
              <span className="text-3xl font-black text-white">₹50</span>
              <span className="text-xs text-[var(--g400)]"> / slot</span>
            </div>
            <span className="text-xs text-[var(--red)]">₹150 / hour</span>
          </div>
        </button>

        {/* Option 2: 2 Players */}
        <button
          onClick={() => setPlayers(2)}
          className={`p-6 sm:p-8 rounded border text-left transition-all duration-200 relative space-y-5 cursor-none ${
            players === 2
              ? 'bg-[#14080a] border-[var(--red)] shadow-[0_0_30px_rgba(232,25,26,0.3)]'
              : 'bg-[#080808] border-[var(--g200)] hover:border-[var(--g300)]'
          }`}
        >
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs text-[var(--red)] uppercase tracking-wider">TIER B // DUO</span>
            {players === 2 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--red)] text-white font-bold">
                SELECTED ✓
              </span>
            )}
          </div>

          <div>
            <h3
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-black uppercase text-white"
            >
              2 PLAYERS (DUO)
            </h3>
            <p className="text-xs text-[var(--g400)] font-sans mt-1">
              2 DualSense Wireless Controllers. Ideal for FC 25, Tekken 8, and Mortal Kombat VS battles.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--g200)] flex items-baseline justify-between font-mono">
            <div>
              <span className="text-3xl font-black text-white">₹80</span>
              <span className="text-xs text-[var(--g400)]"> / slot</span>
            </div>
            <span className="text-xs text-[var(--red)]">₹240 / hr total</span>
          </div>
        </button>

      </div>

      {/* PRICE BREAKDOWN CARD */}
      <div className="p-6 sm:p-8 rounded border border-[var(--g200)] bg-[var(--black)] space-y-6 font-mono">
        <div className="text-xs text-[var(--red)] uppercase tracking-wider border-b border-[var(--g200)] pb-3">
          {'// PRICING CALCULATION LEDGER'}
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[var(--g400)]">
          <div className="flex items-center justify-between">
            <span>Session Duration ({slotCount} x 20-min intervals)</span>
            <span className="text-white font-bold">{durationHours}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hardware Rate ({players} Player{players > 1 ? 's' : ''})</span>
            <span className="text-white font-bold">₹{perSlotRate} / slot</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Formula Ledger</span>
            <span className="text-[var(--red)]">{slotCount} slots × ₹{perSlotRate}</span>
          </div>
          
          <div className="pt-4 border-t border-[var(--g200)] flex items-center justify-between">
            <span className="text-base sm:text-lg font-bold text-white uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              TOTAL AMOUNT DUE
            </span>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-[var(--red)]">₹{totalPrice}</div>
              <div className="text-[10px] text-[var(--g400)]">All taxes & station access included</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceedToCheckout}
          className="w-full py-4 rounded-full bg-[var(--red)] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_24px_rgba(255,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,0,0,0.9)] active:scale-95 cursor-none flex items-center justify-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span>PROCEED TO UPI CHECKOUT (₹{totalPrice})</span>
          <span className="font-mono">→</span>
        </button>
      </div>

    </div>
  );
}
