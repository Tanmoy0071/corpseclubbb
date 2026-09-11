'use client';

import { useState, use } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface BookingRecord {
  bookingId: string;
  formattedDate: string;
  startTime: string;
  endTime: string;
  durationHours: string;
  players: number;
  totalPrice: number;
  utr: string;
}

export default function BookingSuccessPage({ params }: PageProps) {
  const { id } = use(params);
  const [bookingData] = useState<BookingRecord>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`booking_${id}`);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore localStorage errors in SSR or restricted environments
      }
    }
    return {
      bookingId: id,
      formattedDate: 'Today Session',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      durationHours: '1 hr (3 slots)',
      players: 2,
      totalPrice: 240,
      utr: '423984019283',
    };
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 pb-24">
      
      {/* Header banner */}
      <div className="text-center space-y-3 font-mono">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160608] text-[var(--red)] text-xs border border-[var(--red)]/40">
          ✓ SESSION CONFIRMED // CREDENTIAL PASS ISSUED
        </div>
        <h1
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          className="text-4xl sm:text-6xl font-black uppercase text-white m-0"
        >
          YOUR <span className="text-[var(--red)]">ARENA PASS</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--g400)] max-w-md mx-auto font-sans">
          Present this digital pass at the Corpse Club reception desk for controller dispatch and station unlock.
        </p>
      </div>

      {/* FUTURISTIC ARENA PASS TICKET CARD */}
      <div className="relative rounded-2xl border border-[var(--g200)] overflow-hidden shadow-[0_0_60px_rgba(232,25,26,0.15)] bg-[#070707]">
        
        {/* Ticket Header Bar */}
        <div className="bg-[var(--red)] p-5 sm:p-6 text-white flex items-center justify-between font-mono">
          <div>
            <div className="text-lg sm:text-xl font-black tracking-wider uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              CORPSE CLUB PS5 LOUNGE
            </div>
            <div className="text-[10px] tracking-widest uppercase opacity-90">
              OFFICIAL STATION PASS // SHARD #0001
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] uppercase opacity-80">PASS ID</div>
            <div className="text-base sm:text-xl font-black">{bookingData.bookingId}</div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6 font-mono text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-[var(--g200)] pb-6">
            
            {/* Date */}
            <div>
              <div className="text-[10px] text-[var(--g400)] uppercase">{'// SESSION DATE'}</div>
              <div className="text-base font-bold text-white mt-1">{bookingData.formattedDate}</div>
            </div>

            {/* Time */}
            <div>
              <div className="text-[10px] text-[var(--g400)] uppercase">{'// TIME BLOCK'}</div>
              <div className="text-base font-bold text-[var(--red)] mt-1">
                {bookingData.startTime} → {bookingData.endTime}
              </div>
              <div className="text-[10px] text-[var(--g500)] mt-0.5">{bookingData.durationHours}</div>
            </div>

            {/* Players */}
            <div>
              <div className="text-[10px] text-[var(--g400)] uppercase">{'// CONTROLLERS'}</div>
              <div className="text-base font-bold text-white mt-1">
                {bookingData.players} Player{bookingData.players > 1 ? 's' : ''} ({bookingData.players}x DualSense)
              </div>
            </div>

          </div>

          {/* Pod station assignment & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded border border-[var(--g200)] bg-[var(--black)] space-y-1">
              <div className="text-[10px] text-[var(--red)] uppercase font-bold">
                ASSIGNED STATION POD
              </div>
              <div className="text-sm font-bold text-white">POD #04 // 4K 120HZ OLED</div>
              <p className="text-[10px] text-[var(--g400)]">DualSense haptics sanitized and ready.</p>
            </div>

            <div className="p-4 rounded border border-[var(--g200)] bg-[var(--black)] space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--g400)] uppercase">PAYMENT VERIFICATION</span>
                <span className="text-[var(--red)] font-bold">VERIFIED ✓</span>
              </div>
              <div className="text-sm font-bold text-white">₹{bookingData.totalPrice} PAID</div>
              <p className="text-[10px] text-[var(--g400)]">UTR: {bookingData.utr}</p>
            </div>

          </div>

          {/* Ticket Dashed Stub Line */}
          <div className="relative border-t border-dashed border-[var(--g200)] my-6">
            <div className="absolute -left-9 sm:-left-11 -top-3 w-6 h-6 rounded-full bg-[var(--black)] border-r border-[var(--g200)]" />
            <div className="absolute -right-9 sm:-right-11 -top-3 w-6 h-6 rounded-full bg-[var(--black)] border-l border-[var(--g200)]" />
          </div>

          {/* Verification Stub & QR Pass */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-[10px] text-[var(--red)] uppercase tracking-wider">{'// CHECK-IN DESK'}</div>
              <div className="text-xs sm:text-sm font-bold text-white">Corpse Club Cyber Hub 3rd Floor</div>
              <p className="text-xs text-[var(--g400)] font-sans max-w-xs">
                Scan at reception desk RFID reader for instant pod gate unlock.
              </p>
            </div>

            {/* QR Code Pass */}
            <div className="p-2.5 bg-white rounded shadow text-center shrink-0">
              <svg className="w-24 h-24 text-black" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="25" height="25" fill="#000" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#000" />

                <rect x="70" y="5" width="25" height="25" fill="#000" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#000" />

                <rect x="5" y="70" width="25" height="25" fill="#000" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#000" />

                <rect x="35" y="10" width="10" height="10" />
                <rect x="50" y="10" width="10" height="10" />
                <rect x="35" y="30" width="25" height="10" />
                <rect x="10" y="40" width="15" height="15" />
                <rect x="70" y="40" width="15" height="15" />
                <rect x="40" y="60" width="20" height="20" />
                <rect x="70" y="70" width="15" height="20" />
              </svg>
              <div className="text-[8.5px] font-mono font-bold text-black uppercase mt-1">
                PASS: {bookingData.bookingId}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono text-xs">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[var(--g200)] bg-[var(--g100)] hover:border-[var(--red)] text-white uppercase tracking-wider transition-colors cursor-none"
        >
          PRINT / SAVE PASS ⎙
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--red)] text-white uppercase tracking-wider shadow-[0_0_24px_rgba(255,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,0,0,0.9)] transition-all cursor-none text-center"
        >
          RETURN TO LOUNGE HUB →
        </Link>
      </div>

    </div>
  );
}
