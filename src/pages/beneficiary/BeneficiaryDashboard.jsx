import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as bookingService from '../../services/bookingService';
import { getMyRationCard } from '../../services/dealerService';
import { formatDate, formatSlotTime, calculateRecommendedArrival } from '../../utils/dateUtils';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import {
  CalendarCheck,
  Ticket,
  Store,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

export const BeneficiaryDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rationCard, setRationCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [bookingsData, cardData] = await Promise.allSettled([
        bookingService.getMyBookings(),
        getMyRationCard(),
      ]);

      if (bookingsData.status === 'fulfilled') {
        setBookings(Array.isArray(bookingsData.value) ? bookingsData.value : []);
      }
      if (cardData.status === 'fulfilled') {
        setRationCard(cardData.value);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load dashboard records. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Find latest active booking
  const activeBooking = bookings.find((b) => b.status === 'BOOKED');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            Beneficiary Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Welcome back, {user?.name || 'Beneficiary'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ration Card No:{' '}
            <strong className="text-slate-800 font-mono">
              {rationCard?.cardNumber || 'Checking...'}
            </strong>{' '}
            • Mobile: <strong className="text-slate-800">{user?.mobile}</strong>
          </p>
        </div>

        <Link
          to="/beneficiary/book-slot"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors text-xs"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Ration Slot</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {/* Active Upcoming Appointment Highlight */}
      {activeBooking && (
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-6 rounded-3xl shadow-gov-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-700/70 border border-emerald-500/50 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                Active Upcoming Appointment
              </div>
              <h2 className="text-xl font-black">
                Collection on {formatDate(activeBooking.slotDate)}
              </h2>
              <p className="text-xs text-emerald-100">
                Slot Time:{' '}
                <strong>{formatSlotTime(activeBooking.startTime, activeBooking.endTime)}</strong> •
                Arrival window:{' '}
                <strong>{calculateRecommendedArrival(activeBooking.startTime)}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
                <span className="block text-[10px] text-emerald-200 uppercase font-bold">
                  Your Token
                </span>
                <span className="block text-xl font-black font-mono tracking-wider text-emerald-300">
                  {activeBooking.tokenNumber}
                </span>
              </div>

              <Link
                to="/beneficiary/my-bookings"
                className="px-4 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                View Pass
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Assigned Shop + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Ration Shop Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Assigned Fair Price Shop</h3>
                <p className="text-[11px] text-slate-500">Government PDS Designated Outlet</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {rationCard?.shopCode || 'Loading...'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-slate-800 text-xs">
                  {rationCard?.shopName || 'Assigned Ration Outlet'}
                </strong>
                <span className="text-slate-500">
                  {rationCard?.shopAddress || 'Local PDS Distribution Center'}, {rationCard?.district || ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-600">
                Card Type: <strong className="text-slate-800">{rationCard?.cardType || 'PHH'}</strong> •
                Family Members: <strong className="text-slate-800">{rationCard?.familyMembers || 4}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-600">
                Shop Code: <strong className="text-slate-800 font-mono">{rationCard?.shopCode}</strong>
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/beneficiary/book-slot"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Check available slots at this shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Beneficiary Actions</h3>
            <div className="space-y-2">
              <Link
                to="/beneficiary/book-slot"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 font-bold text-xs border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-emerald-700" />
                  <span>Book New Queue Slot</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/beneficiary/my-bookings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 font-bold text-xs border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-emerald-700" />
                  <span>View All Bookings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>PDS Token Advisory</span>
            </div>
            Please arrive within 10 minutes of your scheduled slot start time with your original
            ration card for Aadhaar-ePoS biometric verification.
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Booking History</h3>
            <p className="text-[11px] text-slate-500">Your past and upcoming appointments</p>
          </div>
          <Link
            to="/beneficiary/my-bookings"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            View All ({bookings.length})
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading bookings..." />
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Bookings Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't scheduled any ration collection appointments yet. Book a slot to skip
              physical lines!
            </p>
            <Link
              to="/beneficiary/book-slot"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your First Slot</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Token Number</th>
                  <th className="py-3 px-4">Slot Date</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Shop Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {b.tokenNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {formatDate(b.slotDate)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {formatSlotTime(b.startTime, b.endTime)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {b.shopName || b.shopCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/beneficiary/my-bookings"
                        className="text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
