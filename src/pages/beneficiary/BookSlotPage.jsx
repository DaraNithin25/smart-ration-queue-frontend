import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as slotService from '../../services/slotService';
import * as bookingService from '../../services/bookingService';
import { getAllDealers, getMyRationCard } from '../../services/dealerService';
import {
  formatDate,
  formatDateFull,
  toISODate,
  formatSlotTime,
} from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  CalendarCheck,
  Store,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export const BookSlotPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shops and card state
  const [shops, setShops] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [selectedShopCode, setSelectedShopCode] = useState('');

  // Date selection states
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  // Confirmation dialog and booking state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isAssignedShop = !userCard || !userCard.shopCode || selectedShopCode === userCard.shopCode;

  // Load shops and beneficiary's card
  useEffect(() => {
    const initData = async () => {
      try {
        const [dealers, card] = await Promise.allSettled([
          getAllDealers(),
          getMyRationCard(),
        ]);

        if (dealers.status === 'fulfilled' && dealers.value) {
          setShops(dealers.value);
        }
        if (card.status === 'fulfilled' && card.value) {
          setUserCard(card.value);
          if (card.value.shopCode) {
            setSelectedShopCode(card.value.shopCode);
          }
        } else if (dealers.status === 'fulfilled' && dealers.value?.length > 0) {
          setSelectedShopCode(dealers.value[0].shopCode);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    initData();
  }, []);

  const currentShop =
    shops.find((s) => s.shopCode === selectedShopCode) ||
    shops[0] || {
      shopCode: selectedShopCode || 'FPS-HYD-001',
      shopName: 'Sri Sai Ration Shop',
      address: 'Main Road',
      ownerName: 'Dealer',
    };

  // Fetch slots whenever shop or date changes
  useEffect(() => {
    if (selectedShopCode && selectedDate) {
      setSubmitError('');
      fetchSlots(selectedShopCode, selectedDate);
    }
  }, [selectedShopCode, selectedDate]);

  const fetchSlots = async (shopCode, date) => {
    try {
      setLoadingSlots(true);
      setSlotsError('');
      setSelectedSlot(null);

      const data = await slotService.getSlotsByDate(shopCode, date);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
      setSlotsError(getErrorMessage(err, 'Failed to retrieve available slots for this date.'));
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookClick = () => {
    if (!selectedSlot) return;
    setSubmitError('');
    setIsConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Real Spring Boot call: POST /api/bookings/{slotId}
      const response = await bookingService.bookSlot(selectedSlot.id);

      setIsConfirmOpen(false);

      // Navigate to booking confirmation screen with the exact response
      navigate('/beneficiary/booking-confirmed', {
        state: {
          booking: response,
          shop: currentShop,
          slot: selectedSlot,
        },
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitError(getErrorMessage(err, 'Booking could not be completed. Slot may be full or card not assigned.'));
      setIsConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar generation helpers
  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`blank-${i}`} className="h-8" />);
    }

    const todayStr = toISODate(new Date());

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const isoStr = toISODate(dateObj);
      const isSelected = isoStr === selectedDate;
      const isPast = isoStr < todayStr;

      days.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => setSelectedDate(isoStr)}
          className={`h-8 w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-emerald-800 text-white shadow-xs'
              : isPast
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
          }`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="space-y-3">
        {/* Month Header */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-800">{monthName}</span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
          Appointment Scheduler
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-2">Book Collection Slot</h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your registered Fair Price Shop, pick a date, and choose an available 30-minute queue slot.
        </p>

        {userCard && (
          <div className="mt-3 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <span>
              Your Ration Card: <strong>{userCard.cardNumber}</strong> ({userCard.cardType})
            </span>
            <span>
              Assigned Shop: <strong>{userCard.shopName} ({userCard.shopCode})</strong>
            </span>
          </div>
        )}
      </div>

      {submitError && <ErrorMessage message={submitError} onRetry={() => setSubmitError('')} />}

      {/* 3 Step Interactive Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Select Fair Price Shop */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Select Fair Price Shop</h3>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">Fair Price Shop (FPS)</label>
            <select
              value={selectedShopCode}
              onChange={(e) => {
                setSelectedShopCode(e.target.value);
                setSubmitError('');
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all cursor-pointer"
            >
              {shops.map((shop) => (
                <option key={shop.shopCode} value={shop.shopCode}>
                  {shop.shopName} ({shop.shopCode}) {userCard?.shopCode === shop.shopCode ? '— (Your Assigned Shop)' : ''}
                </option>
              ))}
            </select>

            {!isAssignedShop && userCard && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-amber-950">Viewing Other Shop (Read Only)</strong>
                    <span className="text-[11px] text-amber-800">
                      Your ration card is registered with <strong>{userCard.shopName} ({userCard.shopCode})</strong>. PDS rules only allow booking at your assigned shop.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShopCode(userCard.shopCode);
                    setSubmitError('');
                  }}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-[11px] transition-colors cursor-pointer"
                >
                  Switch to My Assigned Shop ({userCard.shopCode})
                </button>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">{currentShop.address || currentShop.district}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Shop Code:</span>
                <strong className="font-mono text-slate-800">{currentShop.shopCode}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Dealer / Owner:</span>
                <strong className="text-slate-800">{currentShop.ownerName || currentShop.userName || 'Assigned Dealer'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Choose Date */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Choose Date</h3>
          </div>

          {renderCalendar()}

          <div className="pt-2 text-center">
            <span className="text-xs text-slate-500">Selected Date:</span>
            <p className="text-xs font-bold text-emerald-800">{formatDateFull(selectedDate)}</p>
          </div>
        </div>

        {/* Step 3: Select Time Slot */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Select Time Slot</h3>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 mt-2 mb-3">
              {formatDateFull(selectedDate)}
            </p>

            {loadingSlots ? (
              <Loading text="Loading available slots..." />
            ) : slotsError ? (
              <ErrorMessage message={slotsError} onRetry={() => fetchSlots(selectedShopCode, selectedDate)} />
            ) : slots.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No slots available on this date</p>
                <p className="text-[11px] text-slate-400">
                  The dealer has not created queue slots for this date yet. Please select a different date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const capacity = slot.capacity || 10;
                  const bookedCount = slot.bookedCount || 0;
                  const remaining = Math.max(0, capacity - bookedCount);
                  const isFull = remaining <= 0;
                  const isSelected = selectedSlot?.id === slot.id;

                  const timeLabel = `${slot.startTime?.slice(0, 5)} - ${slot.endTime?.slice(0, 5)}`;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/40'
                          : isFull
                          ? 'bg-slate-50/70 border-slate-200 opacity-60 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <span className="block text-xs font-extrabold text-slate-800 font-mono">
                        {timeLabel}
                      </span>

                      <span
                        className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isFull
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : remaining <= 2
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isFull ? `${capacity}/${capacity} Full` : `${remaining}/${capacity} Available`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100">
            {!isAssignedShop ? (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={true}
                  className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                >
                  <span>Cannot Book at Non-Assigned Shop</span>
                </button>
                <p className="text-[11px] text-center text-amber-700 font-medium">
                  Switch to your registered shop (<strong>{userCard?.shopCode}</strong>) to book appointments.
                </p>
              </div>
            ) : (
              <button
                type="button"
                disabled={!selectedSlot || isSubmitting}
                onClick={handleBookClick}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Review & Confirm Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Appointment Booking"
        message={`Are you sure you want to book a ration collection appointment on ${formatDateFull(
          selectedDate
        )} between ${formatSlotTime(selectedSlot?.startTime, selectedSlot?.endTime)} at ${
          currentShop.shopName || currentShop.name
        }?`}
        confirmText="Yes, Confirm Booking"
        cancelText="Cancel"
        isLoading={isSubmitting}
        onConfirm={handleConfirmBooking}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default BookSlotPage;
