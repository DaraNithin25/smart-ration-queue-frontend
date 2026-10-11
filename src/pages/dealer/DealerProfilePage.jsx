import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDealerByShopCode } from '../../services/dealerService';
import Loading from '../../components/Loading';
import { Store, User, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const DealerProfilePage = () => {
  const { user } = useAuth();
  const shopCode = user?.shopCode || 'FPS-HYD-002';
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        if (shopCode) {
          const data = await getDealerByShopCode(shopCode);
          setShop(data);
        }
      } catch (err) {
        console.error('Failed to load dealer shop info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopCode]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <h1 className="text-2xl font-black text-slate-900">Fair Price Shop & Dealer Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized Fair Price Shop credentials and operating details.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-gov space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl shadow-xs">
            <Store className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {shop?.shopName || 'Fair Price Shop'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                Shop Code: {shop?.shopCode || shopCode}
              </span>
              <span className="text-xs text-slate-500">Government Authorized FPS</span>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Loading shop profile..." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Licensed Dealer
                </span>
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{shop?.ownerName || user?.name || 'Dealer'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Contact Mobile
                </span>
                <div className="flex items-center gap-2 text-slate-800 font-bold font-mono">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{shop?.mobile || user?.mobile || 'Not available'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Outlet Location & Jurisdiction</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                {shop?.address || 'Main Road'}, {shop?.district || 'District'}
              </p>
              <div className="pl-6 pt-2 text-[11px] text-slate-500 flex items-center gap-4">
                <span>Daily Queue Capacity: <strong className="text-slate-800">{shop?.dailyCapacity || 100} beneficiaries</strong></span>
              </div>
            </div>
          </>
        )}

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>
            Queue slot creation and token capacity limits are linked to your Fair Price Shop code.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DealerProfilePage;
