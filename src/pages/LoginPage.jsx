import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorUtils';
import ErrorMessage from '../components/ErrorMessage';
import {
  Sprout,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile.trim()) {
      setError('Please enter your registered mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    try {
      setIsLoading(true);
      const { user } = await login(mobile, password);

      // Route strictly based on backend-authenticated user role
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user?.role === 'DEALER') {
        navigate('/dealer', { replace: true });
      } else {
        navigate('/beneficiary', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err, 'Failed to login. Please verify your mobile and password.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleType) => {
    if (roleType === 'BENEFICIARY') {
      setMobile('9876500001');
      setPassword('password123');
    } else if (roleType === 'DEALER') {
      setMobile('9876543220');
      setPassword('dealer123');
    } else if (roleType === 'ADMIN') {
      setMobile('9000000000');
      setPassword('NewAdmin@123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/90 shadow-gov-lg space-y-6">
        {/* Brand header */}
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

        {/* Tab switch between Login and Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            className="py-2.5 text-xs font-bold rounded-xl bg-emerald-800 text-white shadow-xs transition-all"
          >
            Login
          </button>
          <Link
            to="/register"
            className="py-2.5 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 text-center transition-all"
          >
            Register
          </Link>
        </div>

        {/* Header subtitle */}
        <div className="text-center pt-1">
          <h3 className="text-lg font-bold text-slate-800">Welcome Back</h3>
          <p className="text-xs text-slate-500">Login with your registered mobile and password</p>
        </div>

        {/* Error message alert */}
        <ErrorMessage message={error} onRetry={() => setError('')} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
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

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2 disabled:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Quick demo account switcher */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-900 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Click to Fill Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('BENEFICIARY')}
              className="px-2 py-1.5 text-[11px] font-bold bg-white border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-all text-center"
            >
              Beneficiary
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('DEALER')}
              className="px-2 py-1.5 text-[11px] font-bold bg-white border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-all text-center"
            >
              FPS Dealer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              className="px-2 py-1.5 text-[11px] font-bold bg-white border border-emerald-300 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          New beneficiary?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
