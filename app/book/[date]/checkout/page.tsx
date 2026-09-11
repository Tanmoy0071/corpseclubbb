'use client';

import { useState, useEffect, use, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatSlotRange, calculatePrice, formatDateDisplay } from '@/lib/booking';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function CheckoutPage({ params }: PageProps) {
  const { date } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const slotsParam = searchParams.get('slots') || '';
  const playersParam = searchParams.get('players') || '1';
  
  const selectedSlots = slotsParam ? slotsParam.split(',').map((s) => parseInt(s, 10)) : [];
  const players = parseInt(playersParam, 10);

  const { startTime, endTime, durationHours } = formatSlotRange(selectedSlots);
  const slotCount = selectedSlots.length;
  const { totalPrice } = calculatePrice(slotCount, players);

  // 3-MINUTE COUNTDOWN TIMER STATE (180 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const isExpired = timeLeft <= 0;

  // FORM STATES
  const [utr, setUtr] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatMinutes = Math.floor(timeLeft / 60);
  const formatSeconds = String(timeLeft % 60).padStart(2, '0');

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('corpseclub@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setErrorMsg('Session expired! Please re-select your slots.');
      return;
    }
    if (!utr.trim() || utr.trim().length < 6) {
      setErrorMsg('Please enter a valid UTR / UPI Transaction Reference ID (minimum 6 digits).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const bookingId = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingDetails = {
      bookingId,
      date,
      formattedDate: formatDateDisplay(date),
      startTime,
      endTime,
      durationHours,
      players,
      totalPrice,
      utr: utr.trim(),
      hasScreenshot: !!screenshotPreview,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingDetails));

    setTimeout(() => {
      router.push(`/book/status/${bookingId}`);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Top Navigation */}
      <div className="space-y-3 border-b border-[var(--g200)] pb-6">
        <Link
          href={`/book/${date}/players?slots=${slotsParam}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--red)] font-mono uppercase tracking-wider hover:underline mb-2 cursor-none"
        >
          ← / Back to Controller Setup
        </Link>
        <h1
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white m-0"
        >
          PAYMENT GATEWAY // <span className="text-[var(--red)]">UPI CHECKOUT</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--g400)] font-sans">
          Scan the static UPI QR code below and submit your UTR Transaction Reference ID to confirm reservation.
        </p>
      </div>

      {/* 3-MINUTE COUNTDOWN TIMER ALERT BAR */}
      <div
        className={`p-4 rounded border flex items-center justify-between font-mono ${
          isExpired
            ? 'bg-[#1a0507] border-[var(--red)] text-[var(--red)]'
            : timeLeft < 60
            ? 'bg-[#160507] border-[var(--red)] text-[var(--red)] animate-pulse'
            : 'bg-[#080808] border-[var(--g200)] text-[var(--g400)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--red)] animate-ping shrink-0" />
          <div>
            <div className="text-xs uppercase font-bold text-white">
              {isExpired ? 'HOLD EXPIRED' : 'SLOT HOLD TIMER ACTIVE'}
            </div>
            <div className="text-[11px] text-[var(--g400)]">
              {isExpired
                ? 'Your 3-minute hold has lapsed. Please restart session.'
                : 'Complete payment before the slot hold expires.'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {formatMinutes}:{formatSeconds}
          </div>
          <div className="text-[9px] uppercase text-[var(--red)]">3-MIN HOLD</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: STATIC UPI QR CODE */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded border border-[var(--g200)] bg-[#070707] text-center space-y-5">
            <div className="text-xs font-mono text-[var(--red)] uppercase tracking-wider">
              {'// STATIC UPI SCANNER'}
            </div>

            {/* UPI QR CODE Graphic */}
            <div className="w-52 h-52 mx-auto bg-white p-3 rounded shadow-[0_0_30px_rgba(232,25,26,0.3)] relative flex flex-col items-center justify-center">
              <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="25" height="25" fill="#000" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#000" />

                <rect x="70" y="5" width="25" height="25" fill="#000" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#000" />

                <rect x="5" y="70" width="25" height="25" fill="#000" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#000" />

                <rect x="35" y="10" width="8" height="8" />
                <rect x="50" y="10" width="8" height="8" />
                <rect x="35" y="25" width="12" height="6" />
                <rect x="52" y="25" width="8" height="8" />

                <rect x="10" y="35" width="8" height="12" />
                <rect x="25" y="35" width="15" height="8" />
                <rect x="45" y="35" width="10" height="10" />
                <rect x="60" y="35" width="30" height="8" />

                <rect x="35" y="50" width="12" height="12" />
                <rect x="55" y="50" width="15" height="8" />
                <rect x="75" y="50" width="15" height="15" />

                <rect x="35" y="70" width="8" height="20" />
                <rect x="48" y="75" width="18" height="8" />
                <rect x="70" y="75" width="20" height="15" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-2 py-0.5 bg-[var(--red)] text-white text-[9px] font-mono font-bold uppercase rounded">
                  CORPSE CLUB
                </div>
              </div>
            </div>

            {/* UPI ID & Amount */}
            <div className="space-y-2 font-mono">
              <div className="text-[11px] text-[var(--g400)]">GPay · PhonePe · Paytm · BHIM</div>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xs font-mono text-[var(--red)] font-bold bg-[var(--black)] px-3 py-1 rounded border border-[var(--g200)]">
                  corpseclub@upi
                </code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded bg-[var(--g100)] hover:bg-[var(--g200)] text-white text-xs transition-colors cursor-none"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--g200)] font-mono">
              <div className="text-[10px] text-[var(--g400)] uppercase">Amount Due</div>
              <div className="text-3xl font-black text-[var(--red)]">₹{totalPrice}</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM & SUMMARY */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Summary Box */}
          <div className="p-5 rounded border border-[var(--g200)] bg-[var(--black)] space-y-3 font-mono text-xs">
            <div className="text-[10px] text-[var(--red)] uppercase tracking-wider border-b border-[var(--g200)] pb-2">
              {'// RESERVATION SUMMARY'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[var(--g400)]">Date:</span>
                <div className="font-bold text-white mt-0.5">{formatDateDisplay(date)}</div>
              </div>
              <div>
                <span className="text-[var(--g400)]">Time Block:</span>
                <div className="font-bold text-white mt-0.5">{startTime} → {endTime}</div>
              </div>
              <div>
                <span className="text-[var(--g400)]">Duration:</span>
                <div className="font-bold text-[var(--red)] mt-0.5">{durationHours} ({slotCount} slots)</div>
              </div>
              <div>
                <span className="text-[var(--g400)]">Hardware:</span>
                <div className="font-bold text-white mt-0.5">{players} Player{players > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitPayment} className="p-6 sm:p-8 rounded border border-[var(--g200)] bg-[#070707] space-y-5">
            <div className="text-xs font-mono text-[var(--red)] uppercase tracking-wider border-b border-[var(--g200)] pb-3">
              {'// TRANSACTION REFERENCE'}
            </div>

            {errorMsg && (
              <div className="p-3 rounded bg-[#1a0507] border border-[var(--red)] text-xs text-[var(--red)] font-mono">
                ⚠ {errorMsg}
              </div>
            )}

            {/* UTR Input Field */}
            <div className="space-y-2">
              <label htmlFor="utrInput" className="block text-xs font-mono uppercase text-white font-bold">
                UTR / UPI Transaction ID <span className="text-[var(--red)]">*</span>
              </label>
              <input
                id="utrInput"
                type="text"
                required
                disabled={isExpired}
                placeholder="e.g. 423984019283 (12-digit ID)"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[var(--black)] border border-[var(--g200)] text-white placeholder-[var(--g400)] font-mono focus:outline-none focus:border-[var(--red)] transition-all text-xs sm:text-sm cursor-none"
              />
              <p className="text-[10px] text-[var(--g400)] font-mono">
                Found on your payment success receipt in GPay, PhonePe, or Paytm.
              </p>
            </div>

            {/* Optional Screenshot Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-[var(--g400)]">
                Upload Payment Screenshot (Optional)
              </label>

              <div className="border border-dashed border-[var(--g200)] hover:border-[var(--red)] rounded p-4 text-center cursor-none transition-colors relative bg-[var(--black)]">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isExpired}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-none"
                />

                {screenshotPreview ? (
                  <div className="flex items-center justify-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={screenshotPreview} alt="Screenshot preview" className="w-12 h-12 object-cover rounded border border-[var(--red)]" />
                    <div className="text-left text-xs font-mono">
                      <div className="text-[var(--red)] font-bold">Screenshot Attached ✓</div>
                      <div className="text-[var(--g400)] text-[10px]">Click to replace file</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 py-1 font-mono text-xs">
                    <div className="text-[var(--g400)]">Click or drop payment screenshot here</div>
                    <div className="text-[10px] text-[var(--g500)]">JPG, PNG up to 5MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isExpired || isSubmitting}
              className={`w-full py-4 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-none flex items-center justify-center gap-2 ${
                isExpired || isSubmitting
                  ? 'bg-[var(--g100)] text-[var(--g400)] cursor-not-allowed border border-[var(--g200)]'
                  : 'bg-[var(--red)] text-white shadow-[0_0_24px_rgba(255,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,0,0,0.9)] active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span>SUBMITTING TRANSACTION...</span>
              ) : (
                <span>SUBMIT PAYMENT DETAILS →</span>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
