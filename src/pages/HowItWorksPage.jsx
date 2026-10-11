import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  QrCode,
  Store,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Fair Price Shop & Date',
      desc: 'Beneficiaries log into their account and select their assigned Fair Price Shop (FPS). Choose an upcoming date that fits your work schedule.',
      icon: CalendarDays,
    },
    {
      num: '02',
      title: 'Review 30-Minute Capacity Slots',
      desc: 'View real-time availability badges (e.g. 4/6 Available, or 6/6 Full). Slots with zero capacity are locked to prevent overcrowding.',
      icon: Clock,
    },
    {
      num: '03',
      title: 'Instant Booking & Real Token Issuance',
      desc: 'Confirm your slot with a single click. The backend generates an authentic token number (such as RQ-183290B7) and cryptographic verification pass.',
      icon: QrCode,
    },
    {
      num: '04',
      title: 'Hassle-Free Ration Collection',
      desc: 'Arrive within your recommended 10-minute arrival window. The FPS dealer scans your QR token or verifies your token number and disburses your ration immediately.',
      icon: Store,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          End-to-End Walkthrough
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          How Smart Ration Queue Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Four effortless steps to replace hours of standing in queues with guaranteed, dignified, and
          timely ration collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-gov flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-mono">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Physical Queue Waiting</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-xl font-bold text-emerald-950">Experience the System Firsthand</h2>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto leading-relaxed">
          You can try booking a slot right now with your beneficiary account, or explore the Dealer and
          Admin dashboards.
        </p>
        <div className="pt-2">
          <Link
            to="/beneficiary/book-slot"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors text-xs"
          >
            <span>Proceed to Book Slot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
