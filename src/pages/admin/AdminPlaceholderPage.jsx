import React from 'react';
import ComingSoonBanner from '../../components/ComingSoonBanner';
import { Layers } from 'lucide-react';

export const AdminPlaceholderPage = ({ title = 'Module', description }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-gov">
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System Administration Interface
        </p>
      </div>

      <ComingSoonBanner
        featureName={title}
        description={
          description ||
          `The backend API endpoints for ${title} are not present in the current Spring Boot service specification. This module will become functional as soon as the corresponding backend endpoints are deployed.`
        }
      />
    </div>
  );
};

export default AdminPlaceholderPage;
