'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingStatusPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [progress, setProgress] = useState<number>(10);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsVerified(true);
          return 100;
        }
        return prev + 25;
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const handleGoToSuccess = () => {
    router.push(`/book/success/${id}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      
      {/* Red Radar Indicator */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[var(--red)] animate-ping opacity-40" />
        <div className="absolute inset-2 rounded-full border border-[var(--red)]/40 bg-[var(--red)]/10" />

        <div className="w-16 h-16 rounded-full bg-[var(--red)] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,0,0,0.7)] z-10 font-mono text-xl font-bold">
          {isVerified ? '✓' : '●'}
        </div>
      </div>

      <div className="space-y-3 font-mono">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#160608] text-[var(--red)] text-xs border border-[var(--red)]/30">
          REF ID: {id}
        </div>

        <h1
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.95 }}
          className="text-3xl sm:text-5xl font-black uppercase text-white"
        >
          {isVerified ? (
            <span className="text-[var(--red)]">VERIFICATION CONFIRMED</span>
          ) : (
            <span>TRANSACTION PENDING</span>
          )}
        </h1>

        <p className="text-xs sm:text-sm text-[var(--g400)] max-w-sm mx-auto font-sans">
          {isVerified
            ? 'Your UPI transaction reference has been verified. Your station pod is locked!'
            : 'Matching your UTR reference against automated banking records.'}
        </p>
      </div>

      {/* Progress Telemetry */}
      <div className="p-6 rounded border border-[var(--g200)] bg-[#070707] space-y-4 text-left font-mono text-xs">
        <div className="flex items-center justify-between text-[var(--g400)]">
          <span>{'// GATEWAY VERIFICATION'}</span>
          <span className="text-[var(--red)] font-bold">{progress}%</span>
        </div>
        
        <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-[#222]">
          <div
            className="h-full bg-[var(--red)] transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[11px] text-[var(--g400)] space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${progress >= 25 ? 'bg-[var(--red)]' : 'bg-[#333]'}`} />
            <span>UTR Reference Check</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${progress >= 75 ? 'bg-[var(--red)]' : 'bg-[#333]'}`} />
            <span>Gaming Pod Station Allocation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${progress >= 100 ? 'bg-[var(--red)]' : 'bg-[#333]'}`} />
            <span>E-Ticket Credential Issuance</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={handleGoToSuccess}
          className={`w-full sm:w-auto px-10 py-4 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-none mx-auto ${
            isVerified
              ? 'bg-[var(--red)] text-white shadow-[0_0_25px_rgba(255,0,0,0.7)] hover:shadow-[0_0_35px_rgba(255,0,0,1)] active:scale-95'
              : 'border border-[var(--g200)] bg-[var(--g100)] text-[var(--g400)] hover:text-white'
          }`}
        >
          <span>{isVerified ? 'VIEW YOUR E-TICKET PASS →' : 'Skip Wait & Open Pass'}</span>
        </button>
      </div>

    </div>
  );
}
