import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createDealer } from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorUtils';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  UserPlus,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Store,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const CreateDealerPage = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [shopCode, setShopCode] = useState('');
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('100');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Please provide the dealer user name.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!shopCode.trim()) {
      setError('Please provide a unique Fair Price Shop code.');
      return;
    }
    if (!shopName.trim()) {
      setError('Please provide the shop name.');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmCreate = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      const result = await createDealer({
        name: name.trim(),
        mobile: mobile.trim(),
        password: password,
        shopCode: shopCode.trim().toUpperCase(),
        shopName: shopName.trim(),
        ownerName: ownerName.trim() || name.trim(),
        district: district.trim() || 'Central District',
        address: address.trim() || 'Main Market Road',
        dailyCapacity: parseInt(dailyCapacity, 10) || 100,
      });

      setSuccessMessage(
        `Dealer account for ${result.userName || name} created successfully! Assigned to shop ${result.shopCode} (${result.shopName}).`
      );

      // Reset form
      setName('');
      setMobile('');
      setPassword('');
      setShopCode('');
      setShopName('');
      setOwnerName('');
      setDistrict('');
      setAddress('');
      setIsConfirmOpen(false);
    } catch (err) {
      console.error('Create dealer error:', err);
      setError(getErrorMessage(err, 'Failed to create dealer account. Verify you have ADMIN access.'));
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
        <h1 className="text-2xl font-black text-slate-900 mt-2">Create Dealer & Shop</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Register an authorized Fair Price Shop dealer on the platform. Creates a DEALER login account and links it to a ration outlet.
        </p>
      </div>

      {successMessage && (
        <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800">
              Dealer is now active in the system.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dealer Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Dealer Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Dealer Mobile Number (10 Digits)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shop Code */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Shop Code (Unique)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Store className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={shopCode}
                  onChange={(e) => setShopCode(e.target.value)}
                  placeholder="e.g. FPS-HYD-003"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Shop Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Sri Balaji Fair Price Shop"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* District */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* Daily Capacity */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Daily Capacity</label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Shop Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 14, Main Road, Amberpet"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Dealer Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Initial login password (min 6 chars)"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Dealer & Shop</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Create Dealer & Shop?"
        message={`Are you sure you want to register ${name} (Mobile: ${mobile}) for Fair Price Shop ${shopCode}?`}
        confirmText="Confirm Creation"
        cancelText="Cancel"
        isLoading={isLoading}
        onConfirm={handleConfirmCreate}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default CreateDealerPage;
