import React from 'react';
import { Sprout, ShieldCheck, Target, HeartHandshake, Award, Users } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
          <Sprout className="w-4 h-4" />
          The PDS Modernization Mission
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About Smart Ration Queue
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Reinventing public foodgrain distribution in India through capacity-aware appointment
          scheduling, digital tokens, and crowd optimization.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-gov space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Why Was This Project Built?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Under the National Food Security Act (NFSA), millions of Indian families depend on Fair Price
          Shops (FPS) for their essential monthly rations—rice, wheat, sugar, and coarse grains.
          Traditionally, beneficiaries arrive all at once at 8:00 AM, resulting in queues spanning 4
          to 6 hours, loss of daily wages for laborers, chaotic crowd surges, and exhausted shop
          dealers.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>Smart Ration Queue</strong> introduces a structured capacity ceiling. Each Fair
          Price Shop operates 30-minute reservation windows, ensuring that only the number of
          beneficiaries the dealer can comfortably weigh and disburse to are on premise at any given
          time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Predictable Service</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Beneficiaries spend no more than 15-20 minutes collecting their quota, saving hundreds of
            productive hours per year.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Transparent Quotas</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Prevents queue-jumping and arbitrary favoritism through cryptographically verifiable
            backend tokens and digital ledger records.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dealer Wellbeing</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Dealers operate at a sustainable pace with smooth throughput, avoiding the stress of
            hundreds of impatient citizens gathered in the heat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
