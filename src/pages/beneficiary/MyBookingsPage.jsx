import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as bookingService from '../../services/bookingService';
import {
  formatDate,
  formatSlotTime,
  calculateRecommendedArrival,
} from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Ticket,
  CalendarCheck,
  Store,
  Clock,
  XCircle,
  CheckCircle,
  Copy,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cancellation modal state
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      // Live Spring Boot call: GET /api/bookings/my-bookings
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(getErrorMessage(err, 'Failed to fetch your bookings from the server.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setCancellingBooking(booking);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;

    try {
      setIsCancelling(true);
      setSuccessMessage('');

      // Backend API: DELETE /api/bookings/{bookingId}
      await bookingService.cancelBooking(cancellingBooking.id);

      setSuccessMessage(
        `Booking ${cancellingBooking.tokenNumber || `#${cancellingBooking.id}`} was cancelled successfully.`
      );
      setCancellingBooking(null);

      // Refresh list from backend to reflect true state
      await fetchBookings();
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(getErrorMessage(err, 'Failed to cancel the booking. It may already be completed.'));
      setCancellingBooking(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const copyToken = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Appointments & Tokens</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View queue tokens, scheduled times, and manage your bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Refresh bookings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/beneficiary/book-slot"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book New Slot</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={fetchBookings} />}

      {/* Bookings Card List */}
      {loading ? (
        <Loading text="Loading your bookings from server..." />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-gov">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Booking Records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any active or past appointments recorded in the system.
          </p>
          <Link
            to="/beneficiary/book-slot"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book a Slot Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => {
            const isBooked = b.status === 'BOOKED';
            const token = b.tokenNumber || `#RQ-${b.id}`;

            return (
              <div
                key={b.id || token}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-gov hover:shadow-gov-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Token and Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Queue Token
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xl font-black font-mono text-emerald-950 tracking-wide">
                        {token}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToken(token)}
                        className="p-1 text-slate-400 hover:text-emerald-700"
                        title="Copy token"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedId === token && (
                        <span className="text-[10px] font-bold text-emerald-700">Copied!</span>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={b.status} />
                </div>

                {/* Card Middle: Appointment metadata */}
                <div className="space-y-2.5 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Collection Date:
                    </span>
                    <strong className="text-slate-800 font-bold">{formatDate(b.slotDate)}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Time Slot:
                    </span>
                    <strong className="text-slate-800 font-bold">
                      {formatSlotTime(b.startTime, b.endTime)}
                    </strong>
                  </div>

                  {isBooked && (
                    <div className="flex items-center justify-between bg-emerald-50/60 p-2 rounded-xl text-[11px]">
                      <span className="text-emerald-800 font-semibold">Recommended Arrival:</span>
                      <strong className="text-emerald-950 font-bold">
                        {calculateRecommendedArrival(b.startTime)}
                      </strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      Fair Price Shop:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {b.shopName || b.shopCode || 'Kukatpally FPS'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Booking ID: #{b.id}</span>
                    <span>Booked: {formatDate(b.bookedAt)}</span>
                  </div>
                </div>

                {/* Card Bottom: Cancel action (ONLY for BOOKED status) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ration Card: {b.rationCardNumber || 'Verified'}
                  </span>

                  {isBooked && (
                    <button
                      type="button"
                      onClick={() => handleCancelClick(b)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancellingBooking}
        title="Cancel Booking Appointment?"
        message={`Are you sure you want to cancel your queue token ${
          cancellingBooking?.tokenNumber || `#${cancellingBooking?.id}`
        } scheduled for ${formatDate(cancellingBooking?.slotDate)}? This will free up the capacity for other beneficiaries.`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Appointment"
        isDanger={true}
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingBooking(null)}
      />
    </div>
  );
};

export default MyBookingsPage;
