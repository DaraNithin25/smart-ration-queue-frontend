import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  Store,
  MapPin,
  ArrowRight,
  Ticket,
} from 'lucide-react';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import {
  formatDate,
  formatSlotTime,
  calculateRecommendedArrival,
} from '../../utils/dateUtils';

export const BookingConfirmationPage = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Extract booking details passed from booking action
  const booking = location.state?.booking;
  const shop = location.state?.shop;
  const slot = location.state?.slot;

  // Defensive fallback if user navigates directly without state
  if (!booking) {
    return <Navigate to="/beneficiary/my-bookings" replace />;
  }

  // Handle actual backend token format
  const tokenNumber =
    booking.tokenNumber || (typeof booking === 'string' ? booking : `#RQ-${booking.id}`);

  const slotDate = booking.slotDate || slot?.slotDate;
  const startTime = booking.startTime || slot?.startTime;
  const endTime = booking.endTime || slot?.endTime;
  const shopName = booking.shopName || shop?.name || 'Assigned Fair Price Shop';
  const shopAddress = shop?.address || 'Plot 12, Main Road, Kukatpally, Hyderabad';

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success banner matching mockup */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-gov">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Slot Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your ration collection slot has been successfully booked with the backend queue system.
            </p>
          </div>
        </div>
      </div>

      {/* Main Details and QR grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Token and Appointment Metadata */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-gov space-y-6">
          {/* Token Card */}
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Official Token Number
              </span>
              <span className="block text-2xl sm:text-3xl font-black font-mono text-emerald-950 tracking-wider mt-1">
                {tokenNumber}
              </span>
            </div>
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details list matching mockup */}
          <div className="space-y-4 text-xs">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Collection Date</span>
                <p className="font-extrabold text-slate-800 text-sm">{formatDate(slotDate)}</p>
              </div>
            </div>

            {/* Time Slot */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Time Slot</span>
                <p className="font-extrabold text-slate-800 text-sm">
                  {formatSlotTime(startTime, endTime)}
                </p>
              </div>
            </div>

            {/* Recommended Arrival */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">
                  Recommended Arrival Time
                </span>
                <p className="font-extrabold text-emerald-950 text-sm">
                  {calculateRecommendedArrival(startTime)}
                </p>
                <span className="text-[11px] text-slate-500">
                  Arrive during this window to ensure immediate service.
                </span>
              </div>
            </div>

            {/* Fair Price Shop */}
            <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600 mt-0.5">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Fair Price Shop</span>
                <p className="font-extrabold text-slate-800 text-sm">{shopName}</p>
                <p className="text-[11px] text-slate-500">{shopAddress}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              to="/beneficiary/my-bookings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Go to My Bookings</span>
            </Link>
            <Link
              to="/beneficiary/book-slot"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <span>Book Another Date</span>
            </Link>
          </div>
        </div>

        {/* Right: QR Code pass matching mockup */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <QRCodeDisplay
            value={tokenNumber}
            label="Scan this QR code at the ration shop for verification"
          />

          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-1">Important Instructions:</strong>
            1. Carry your physical or digital Ration Card.
            <br />
            2. Present this token pass or QR code to the Fair Price Shop dealer.
            <br />
            3. Fingerprint/Iris verification will take place on the ePoS machine.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
