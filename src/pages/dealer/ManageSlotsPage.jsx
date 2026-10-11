import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as slotService from '../../services/slotService';
import {
  formatDate,
  toISODate,
  formatSlotTime,
  calculateEndTime,
} from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle,
  Users,
  Filter,
  RefreshCw,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';

export const ManageSlotsPage = () => {
  const { user } = useAuth();
  const shopCode = user?.shopCode || 'FPS-HYD-042';

  const [filterDate, setFilterDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  });

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // New Slot Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDate, setFormDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  });
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('09:30:00');
  const [capacity, setCapacity] = useState('8');
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchSlots();
  }, [shopCode, filterDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError('');
      // Live Spring Boot call: GET /api/queue-slots/dealer/{shopCode}/date/{date}
      const data = await slotService.getSlotsByDate(shopCode, filterDate);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setError(getErrorMessage(err, 'Failed to fetch slots from the Spring Boot backend.'));
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);
    // Automatically calculate 30 min end time
    const computedEnd = calculateEndTime(newStartTime);
    if (computedEnd) {
      setEndTime(computedEnd);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formDate) {
      setFormError('Please select a slot date.');
      return;
    }
    if (!startTime || !endTime) {
      setFormError('Start time and end time are required.');
      return;
    }

    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setFormError('Capacity must be a positive number.');
      return;
    }

    try {
      setIsCreating(true);
      // Real Spring Boot call: POST /api/queue-slots/dealer/{shopCode}
      // Body: { slotDate, startTime, endTime, capacity }
      await slotService.createSlot(shopCode, {
        slotDate: formDate,
        startTime: startTime.slice(0, 5),
        endTime: endTime.slice(0, 5),
        capacity: capNum,
      });

      setSuccessMessage(`Queue slot successfully created for ${formatDate(formDate)} (${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}).`);
      setIsModalOpen(false);

      // If created date matches current filter date, refresh list
      if (formDate === filterDate) {
        await fetchSlots();
      } else {
        setFilterDate(formDate);
      }
    } catch (err) {
      console.error('Failed to create slot:', err);
      setFormError(getErrorMessage(err, 'Could not create slot. Backend enforces 30-min non-overlapping slots.'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            Fair Price Shop: {shopCode}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Manage Queue Slots</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure 30-minute capacity windows to streamline beneficiary collection.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Slot</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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

      {error && <ErrorMessage message={error} onRetry={fetchSlots} />}

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700">Filter Slots by Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSlots}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-500">
            Total Slots on {formatDate(filterDate)}: <strong>{slots.length}</strong>
          </span>
        </div>
      </div>

      {/* Slots Grid */}
      {loading ? (
        <Loading text="Loading slots from server..." />
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-gov">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Queue Slots Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No 30-minute queue slots exist for {formatDate(filterDate)}. Create new slots so beneficiaries can schedule appointments.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
          >
            <Plus className="w-4 h-4" />
            <span>Create Slot for this Day</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((s) => {
            const capacityNum = s.capacity || 0;
            const bookedNum = s.bookedCount || 0;
            const remaining = capacityNum - bookedNum;
            const percentBooked = capacityNum > 0 ? Math.round((bookedNum / capacityNum) * 100) : 0;
            const isFull = remaining <= 0;

            return (
              <div
                key={s.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-gov hover:shadow-gov-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {formatSlotTime(s.startTime, s.endTime)}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : remaining <= 2
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isFull ? 'Full' : `${remaining} Open`}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>
                      Booked: <strong>{bookedNum}</strong> / {capacityNum}
                    </span>
                    <span className="font-semibold text-slate-500">{percentBooked}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isFull
                          ? 'bg-rose-500'
                          : percentBooked > 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(percentBooked, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Slot ID: #{s.id}</span>
                  <span className="text-emerald-700 font-bold">30 min window</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-gov-lg border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create New Queue Slot</h3>
                  <p className="text-[10px] text-slate-500">Shop: {shopCode}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && <ErrorMessage message={formError} onRetry={() => setFormError('')} />}

            <form onSubmit={handleCreateSlot} className="space-y-4">
              {/* Date */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Slot Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Must be a future date per backend rules.
                </span>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Start Time</label>
                  <input
                    type="time"
                    step="1800"
                    value={startTime.slice(0, 5)}
                    onChange={(e) => handleStartTimeChange(`${e.target.value}:00`)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">End Time (30m)</label>
                  <input
                    type="time"
                    step="1800"
                    value={endTime.slice(0, 5)}
                    onChange={(e) => setEndTime(`${e.target.value}:00`)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Beneficiary Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 8 beneficiaries"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Maximum beneficiaries allowed in this 30-minute interval.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Publish Slot'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlotsPage;
