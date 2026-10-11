import React from 'react';
import { Database } from 'lucide-react';

export const ModeToggle = () => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        title="Connected to Spring Boot API at http://localhost:8080"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shadow-xs border bg-emerald-50 text-emerald-900 border-emerald-300"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <Database className="w-3.5 h-3.5 text-emerald-700" />
        <span className="text-[11px] font-bold">Live API (8080)</span>
      </div>
    </div>
  );
};

export default ModeToggle;
