import React from 'react';
import { Clock, Info } from 'lucide-react';

export const ComingSoonBanner = ({
  featureName = 'This feature',
  description = 'The backend API for this module is not yet exposed by the Spring Boot service. It is planned for an upcoming release.',
}) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 my-4 flex items-start gap-3.5">
      <div className="p-2 bg-amber-100 rounded-xl text-amber-800 flex-shrink-0 mt-0.5">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-amber-950">{featureName} — Coming Soon</h4>
          <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Backend API Planned
          </span>
        </div>
        <p className="text-xs text-amber-800 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ComingSoonBanner;
