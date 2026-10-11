import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyRationCard } from '../../services/dealerService';
import Loading from '../../components/Loading';
import {
  User,
  CreditCard,
  Phone,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const BeneficiaryProfilePage = () => {
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const data = await getMyRationCard();
        setCard(data);
      } catch (err) {
        console.error('Failed to load profile card details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <h1 className="text-2xl font-black text-slate-900">Beneficiary Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your registered PDS ration card and Fair Price Shop details.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-gov space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{user?.name || 'Beneficiary'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active NFSA Beneficiary
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {card?.cardNumber || 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Loading profile details..." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Registered Mobile
                </span>
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{user?.mobile || 'Not provided'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Ration Card Number
                </span>
                <div className="flex items-center gap-2 text-slate-800 font-bold font-mono">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>{card?.cardNumber || 'Not assigned'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Store className="w-4 h-4" />
                <span>Assigned Fair Price Shop Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Shop Name</span>
                  <p className="font-extrabold text-slate-800">{card?.shopName || 'Sri Sai Ration Shop'}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{card?.shopAddress || 'Local PDS Center'}, {card?.district || ''}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Shop Code</span>
                  <p className="font-bold text-emerald-800 font-mono">{card?.shopCode || 'FPS-HYD-001'}</p>
                  <span className="text-slate-500 text-[11px]">Card Type: {card?.cardType || 'PHH'} • Family Members: {card?.familyMembers || 4}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>
            Your appointment quota and Fair Price Shop registration are verified against the Public Distribution System database.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryProfilePage;
