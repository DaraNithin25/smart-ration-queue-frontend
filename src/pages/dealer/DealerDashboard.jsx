import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as slotService from '../../services/slotService';
import { MOCK_SHOPS, MOCK_DEALER_TODAY_BOOKINGS, MOCK_STOCK_DATA } from '../../services/mockData';
import { toISODate, formatDate, formatSlotTime } from '../../utils/dateUtils';
import StatCard from '../../components/StatCard';
import ComingSoonBanner from '../../components/ComingSoonBanner';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Store,
  Plus,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const DealerDashboard = () => {
  const { user } = useAuth();
  const shopCode = user?.shopCode || 'FPS-HYD-042';
  const shopInfo = MOCK_SHOPS.find((s) => s.code === shopCode) || MOCK_SHOPS[0];

  const [todaySlots, setTodaySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const todayStr = toISODate(new Date());

  useEffect(() => {
    fetchTodaySlots();
  }, [shopCode]);

  const fetchTodaySlots = async () => {
    try {
      setLoading(true);
      setError('');
      // Live Spring Boot call: GET /api/queue-slots/dealer/{shopCode}
      const data = await slotService.getSlots(shopCode);
      setTodaySlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch dealer slots:', err);
      setError('Could not connect to live backend slots API. Verify backend on http://localhost:8080.');
    } finally {
      setLoading(false);
    }
  };

  const totalCap = todaySlots.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalBooked = todaySlots.reduce((acc, s) => acc + (s.bookedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header matching mockup */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              FPS Dealer Portal
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">Shop: {shopCode}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Dealer Dashboard — {shopInfo.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage stock, queue slots, and verify beneficiaries at your Fair Price Shop.
          </p>
        </div>

        <Link
          to="/dealer/slots"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create / Manage Slots</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchTodaySlots} />}

      {/* Stat Cards Row matching mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Today's Bookings"
          value="24"
          subtext="Allocated appointments"
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Arrived Beneficiaries"
          value="18"
          subtext="Verified on ePoS"
          color="emerald"
        />
        <StatCard
          icon={Clock}
          title="Remaining in Queue"
          value="6"
          subtext="Expected today"
          color="amber"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Collections"
          value="15"
          subtext="Ration disbursed"
          color="green"
        />
      </div>

      {/* Main Grid: Today's Bookings Table + Ration Stock Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Bookings Table (Mockup Section) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-gov overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Today's Bookings Schedule</h3>
              <p className="text-[11px] text-slate-500">Beneficiaries scheduled for collection today</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {formatDate(todayStr)}
            </span>
          </div>

          <div className="p-4 bg-amber-50/50 border-b border-amber-100">
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Notice:</strong> The Spring Boot backend currently supports queue slot creation & beneficiary bookings, but does not yet expose a dealer-side live attendee roster endpoint. The records below illustrate the verification interface.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Token No.</th>
                  <th className="py-3 px-4">Beneficiary</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DEALER_TODAY_BOOKINGS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.tokenNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.beneficiaryName}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{row.mobile}</td>
                    <td className="py-3 px-4 font-medium">{row.timeSlot}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'Arrived'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Token ${row.tokenNo} verification requested.`)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          row.action === 'Verify'
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : row.action === 'Mark Arrived'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {row.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Ration Stock Management (Mockup Section) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-gov space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Ration Stock Management</h3>
              </div>
              <button
                type="button"
                onClick={() => alert('Stock API is coming soon in the backend.')}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold"
              >
                Update Stock
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Available quota of essential foodgrains in shop inventory.
            </p>

            <div className="space-y-3">
              {MOCK_STOCK_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.item}</h4>
                    <span className="text-[11px] text-slate-500">
                      Available: <strong className="text-slate-700">{item.available}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Stock management endpoint is planned in backend.`)}
                    className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold hover:bg-slate-100"
                  >
                    Update
                  </button>
                </div>
              ))}
            </div>

            <ComingSoonBanner
              featureName="Live Stock Sync"
              description="Inventory deduction upon biometric distribution will be linked when Spring Boot stock endpoints are exposed."
            />
          </div>

          {/* Quick link to manage slots */}
          <div className="bg-emerald-800 text-white rounded-3xl p-6 shadow-gov space-y-3">
            <h4 className="font-bold text-sm">Need to add slots for tomorrow?</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Define 30-minute arrival capacity windows to prevent morning crowding.
            </p>
            <Link
              to="/dealer/slots"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-950 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <span>Manage Queue Slots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
