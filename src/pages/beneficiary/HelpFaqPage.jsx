import React from 'react';
import { HelpCircle, Phone, Mail, ShieldCheck, Clock, Ticket } from 'lucide-react';

export const HelpFaqPage = () => {
  const faqs = [
    {
      q: 'How does the 30-minute queue slot work?',
      a: 'When you book a slot, you are assigned a guaranteed 30-minute window (e.g. 10:00 AM - 10:30 AM). Arrive within the recommended 10-minute arrival window to collect your ration without physical waiting.',
    },
    {
      q: 'What should I do if a slot is marked "Full"?',
      a: 'Fair Price Shops limit each slot to a safe capacity (e.g. 6 to 8 beneficiaries). If your preferred slot is full, select another time on the same date or pick a different date.',
    },
    {
      q: 'Can I cancel my appointment if I cannot make it?',
      a: 'Yes! Go to "My Bookings" in your beneficiary dashboard and click "Cancel Booking" on any active appointment. This immediately frees up the capacity for other citizens.',
    },
    {
      q: 'What documents do I need to bring to the ration shop?',
      a: 'Carry your original physical or digital Ration Card and your phone with the Token Number / QR Code. Biometric authentication will still be processed on the dealer ePoS machine.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <h1 className="text-2xl font-black text-slate-900">Help & Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Everything you need to know about Smart Ration Queue appointment scheduling.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-gov space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Contact card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-xs text-emerald-950 space-y-2">
        <h4 className="font-bold flex items-center gap-2 text-sm text-emerald-900">
          <Phone className="w-4 h-4" />
          National Food Security Consumer Helpline
        </h4>
        <p className="text-emerald-800 text-xs">
          For technical issues or grievance redressal, contact National PDS Toll-Free: <strong>1967</strong> or your State Department of Consumer Affairs, Food & Civil Supplies.
        </p>
      </div>
    </div>
  );
};

export default HelpFaqPage;
