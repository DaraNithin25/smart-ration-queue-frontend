import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { linkDealer, getAllDealers } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorUtils';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Store,
  Phone,
  Link as LinkIcon,
  CheckCircle,
  Building,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const LinkShopPage = () => {
  const [mobile, setMobile] = useState('');
  const [shops, setShops] = useState([]);
  const [shopCode, setShopCode] = useState('');
  const [customShopCode, setCustomShopCode] = useState('');
  const [useCustomShop, setUseCustomShop] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getAllDealers();
        setShops(data);
        if (data.length > 0) {
          setShopCode(data[0].shopCode);
        }
      } catch (err) {
        console.error('Failed to load shops:', err);
      }
    };
    fetchShops();
  }, []);

  const finalShopCode = useCustomShop ? customShopCode.trim().toUpperCase() : shopCode;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!mobile.trim() || mobile.trim().length !== 10) {
      setError('Please provide a valid 10-digit dealer mobile number.');
      return;
    }
    if (!finalShopCode) {
      setError('Please select or enter a valid shop code.');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmLink = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      const result = await linkDealer({
        mobile: mobile.trim(),
        shopCode: finalShopCode,
      });

      setSuccessMessage(
        `Dealer user (${result.userName || mobile}) has been successfully linked to Fair Price Shop ${result.shopCode} (${result.shopName})!`
      );

      setMobile('');
      setIsConfirmOpen(false);
    } catch (err) {
      console.error('Link dealer error:', err);
      setError(
        getErrorMessage(
          err,
          'Failed to link dealer to shop. Verify the dealer mobile number is registered and that you have ADMIN access.'
        )
      );
      setIsConfirmOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
          Admin Privilege
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-2">Link Dealer to Fair Price Shop</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Map an existing dealer user account to their designated Fair Price Shop.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800">
              Dealer can now manage queue slots for shop {finalShopCode}.
            </span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {/* Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-gov space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Dealer Mobile */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Dealer Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit registered dealer mobile"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400">
              Must be an existing user account. Will be granted DEALER permissions.
            </span>
          </div>

          {/* Fair Price Shop */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Select Fair Price Shop</label>
              <button
                type="button"
                onClick={() => setUseCustomShop(!useCustomShop)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {useCustomShop ? 'Choose from list' : 'Enter custom shop code'}
              </button>
            </div>

            {useCustomShop ? (
              <input
                type="text"
                value={customShopCode}
                onChange={(e) => setCustomShopCode(e.target.value)}
                placeholder="e.g. FPS-HYD-001"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono uppercase"
                required
              />
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Store className="w-4 h-4" />
                </div>
                <select
                  value={shopCode}
                  onChange={(e) => setShopCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all cursor-pointer"
                >
                  {shops.map((s) => (
                    <option key={s.shopCode} value={s.shopCode}>
                      {s.shopName} ({s.shopCode}) - {s.district}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Link Dealer to Shop</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Link Dealer to Shop?"
        message={`Are you sure you want to assign dealer mobile ${mobile} to Fair Price Shop ${finalShopCode}?`}
        confirmText="Confirm Assignment"
        cancelText="Cancel"
        isLoading={isLoading}
        onConfirm={handleConfirmLink}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default LinkShopPage;
