import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-300';
  let dotColor = 'bg-slate-500';

  if (normalized === 'BOOKED' || normalized === 'ARRIVED' || normalized === 'ACTIVE') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dotColor = 'bg-emerald-600';
  } else if (normalized === 'PENDING' || normalized === 'WAITING') {
    styles = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-600';
  } else if (normalized === 'CANCELLED' || normalized === 'NO SHOW' || normalized === 'FAILED') {
    styles = 'bg-rose-50 text-rose-800 border-rose-300';
    dotColor = 'bg-rose-600';
  } else if (normalized === 'COMPLETED' || normalized === 'SERVED') {
    styles = 'bg-blue-50 text-blue-800 border-blue-300';
    dotColor = 'bg-blue-600';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {normalized}
    </span>
  );
};

export default StatusBadge;
