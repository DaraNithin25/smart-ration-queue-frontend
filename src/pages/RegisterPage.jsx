import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorUtils';
import ErrorMessage from '../components/ErrorMessage';
import { getAllDealers } from '../services/dealerService';
import {
  Sprout,
  User,
  Phone,
  CreditCard,
  Store,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
} from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getAllDealers();
        setShops(data);
        if (data.length > 0) {
          setSelectedShop(data[0].shopCode);
        }
      } catch (err) {
        console.error('Failed to load dealer shops:', err);
      }
    };
    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, mobile, password, rationCardNumber, selectedShop);

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(getErrorMessage(err, 'Failed to register account. Mobile number may already exist.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/90 shadow-gov-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <Sprout className="w-7 h-7 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart Ration Queue
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PDS Capacity-Aware Appointment System
          </p>
        </div>

        {/* Header Title */}
        <div className="text-center pt-1">
          <h3 className="text-lg font-bold text-slate-800">Create Account</h3>
          <p className="text-xs text-slate-500">Register as a Beneficiary</p>
        </div>

        {/* Notifications */}
        <ErrorMessage message={error} onRetry={() => setError('')} />

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-900 text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Mobile Number (10 Digits)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                required
              />
            </div>
          </div>

          {/* Ration Card Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Ration Card Number (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={rationCardNumber}
                onChange={(e) => setRationCardNumber(e.target.value)}
                placeholder="Leave blank to auto-generate (e.g. RC<mobile>)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Select Fair Price Shop */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Assigned Fair Price Shop</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Store className="w-4 h-4" />
              </div>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all cursor-pointer"
              >
                {shops.map((shop) => (
                  <option key={shop.shopCode} value={shop.shopCode}>
                    {shop.shopName} ({shop.shopCode}) - {shop.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password (min 6 chars)"
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2 disabled:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
