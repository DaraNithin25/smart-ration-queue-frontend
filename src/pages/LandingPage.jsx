import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShieldCheck,
  Smartphone,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Store,
  ChevronRight,
} from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      desc: 'Choose date & time slot online in seconds',
    },
    {
      icon: Users,
      title: 'Reduced Queues',
      desc: 'Less waiting time at Fair Price Shops',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Verified',
      desc: 'QR code & backend token verification',
    },
    {
      icon: Smartphone,
      title: 'Inclusive Access',
      desc: 'Optimized for mobile web and local devices',
    },
    {
      icon: BarChart3,
      title: 'Better Management',
      desc: '30-minute capacity limits prevent crowding',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Public Distribution System (PDS) Digital Portal
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Book Smart <br />
              <span className="text-emerald-700">Skip the Queue</span> <br />
              Get Your Ration Easily
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              A digital appointment and queue capacity management system for Fair Price Shops (PDS).
              Select your date, reserve a guaranteed 30-minute slot, and collect essentials with zero
              hassle.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/beneficiary/book-slot"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-gov-md hover:shadow-gov-lg transition-all text-sm group"
              >
                <span>Book Your Slot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition-colors text-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>30-Min Time Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real Token Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Free For Beneficiaries</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-gov-lg border-4 border-white bg-slate-100 group">
              <img
                src="/assets/ration_shop_hero.jpg"
                alt="Orderly queue at Fair Price Shop with token priority sign"
                className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback graphic if image fails */}
              <div
                style={{ display: 'none' }}
                className="w-full h-[360px] bg-gradient-to-br from-emerald-800 to-green-950 flex-col items-center justify-center text-white p-6 text-center"
              >
                <Store className="w-16 h-16 text-emerald-400 mb-3" />
                <h3 className="text-xl font-bold">Fair Price Shop (PDS)</h3>
                <p className="text-xs text-emerald-200 mt-2">
                  People • Ration • A Better Tomorrow
                </p>
              </div>

              {/* Priority badge overlay matching mockup */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-emerald-200 text-center">
                <span className="block text-[9px] uppercase tracking-widest font-extrabold text-slate-500">
                  YOUR TOKEN
                </span>
                <span className="block text-xs font-extrabold text-emerald-700">
                  OUR PRIORITY
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Row matching mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-gov hover:shadow-gov-md hover:border-emerald-300 transition-all flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it eliminates queue pain points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-gov">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Digital Transformation in PDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Transforming Ration Distribution Through Capacity Awareness
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Fair Price Shops traditionally suffer from severe morning congestion, chaotic physical
              queues, and unpredictable waiting hours. Smart Ration Queue balances the load across the
              entire working day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Capacity-Capped Slots</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Dealers configure exactly how many beneficiaries can be served every 30 minutes
                (e.g., 6 or 8 people), preventing overcrowded shop premises.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Guaranteed Queue Tokens</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Beneficiaries receive an authentic verification token number (e.g.,{' '}
                <code className="text-emerald-700 font-mono">RQ-183290B7</code>) and scannable QR
                pass to present at their Fair Price Shop.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Idle Waiting</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Beneficiaries arrive within their recommended 10-minute arrival window, collect their
                grains and subsidized supplies, and carry on with their daily work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="rounded-3xl bg-emerald-800 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-gov-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Ready to Book Your Collection Slot?
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Login with your registered mobile number or create a new beneficiary profile to view
              upcoming availability at your assigned Fair Price Shop.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl shadow-xs transition-colors text-sm"
              >
                Register as Beneficiary
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold rounded-xl border border-emerald-600 transition-colors text-sm"
              >
                Existing User Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
