import React, { useRef } from 'react';
import { Download, QrCode, Check } from 'lucide-react';

/**
 * Generates an SVG pseudo QR pattern dynamically from the token
 */
export const QRCodeDisplay = ({ value, label = 'Scan at ration shop' }) => {
  const qrRef = useRef(null);

  // Deterministic 21x21 grid pattern generated from value hash
  const generateMatrix = (str) => {
    const size = 21;
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));

    // Corner Finder patterns (7x7)
    const addFinder = (startX, startY) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[startY + r][startX + c] = true;
          }
        }
      }
    };

    addFinder(0, 0); // Top Left
    addFinder(14, 0); // Top Right
    addFinder(0, 14); // Bottom Left

    // Seed hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    // Fill inner dots
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= 13) ||
          (r >= 13 && c < 8)
        ) {
          continue;
        }
        // Pseudo random bit based on hash and position
        const val = Math.sin(hash * 0.001 + r * 13 + c * 7) > 0;
        matrix[r][c] = val;
      }
    }

    return matrix;
  };

  const matrix = generateMatrix(value || 'SRQ-TOKEN');

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const SVGURL = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = SVGURL;
    downloadLink.download = `SmartRationQueue-${value || 'Token'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-inner inline-block">
        <svg
          ref={qrRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 21"
          className="w-36 h-36 md:w-44 md:h-44"
          shapeRendering="crispEdges"
        >
          <rect width="21" height="21" fill="#FFFFFF" />
          {matrix.map((row, rIdx) =>
            row.map(
              (cell, cIdx) =>
                cell && (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={cIdx}
                    y={rIdx}
                    width="1"
                    height="1"
                    fill="#166534"
                  />
                )
            )
          )}
        </svg>
      </div>

      <p className="text-xs font-semibold text-slate-700 mt-3">{label}</p>
      <p className="text-[11px] text-slate-500 font-mono tracking-wider">{value}</p>

      <button
        onClick={handleDownload}
        type="button"
        className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Download Token Pass
      </button>
    </div>
  );
};

export default QRCodeDisplay;
