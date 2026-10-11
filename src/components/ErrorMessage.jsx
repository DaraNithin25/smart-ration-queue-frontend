import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, title = 'Error Encountered' }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 flex items-start gap-3 my-4 shadow-sm">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-rose-900">{title}</h4>
        <p className="text-xs text-rose-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
