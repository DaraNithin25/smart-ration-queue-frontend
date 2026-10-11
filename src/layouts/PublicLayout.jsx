import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sprout, Phone, Mail, Shield, ExternalLink, Heart } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gov-bg">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1 */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Smart Ration Queue
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                A modern Public Distribution System (PDS) capacity-aware appointment platform.
                Eliminating long standing queues, reducing crowding, and ensuring dignity and
                convenience for ration card beneficiaries.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  National PDS Toll-Free: <strong>1967</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Government Initiative
                </span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-emerald-400 transition-colors">
                    About the Initiative
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                    How Appointment Booking Works
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-emerald-400 transition-colors">
                    Beneficiary & Dealer Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-emerald-400 transition-colors">
                    New Beneficiary Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                System Roles
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <strong className="text-slate-200">Beneficiaries:</strong> Book 30-min slots at
                  assigned FPS, download tokens.
                </li>
                <li>
                  <strong className="text-slate-200">FPS Dealers:</strong> Manage daily slot
                  capacities, prevent crowding.
                </li>
                <li>
                  <strong className="text-slate-200">Administrators:</strong> Onboard dealers,
                  configure shop mappings.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Smart Ration Queue. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Developed for transparent & crowd-free Public Distribution Services
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
