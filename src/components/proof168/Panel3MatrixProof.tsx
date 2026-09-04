import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3MatrixProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Determinant as Area Scaling Factor)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>The original unit square has Area = <MathView math="1 \times 1 = 1" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Under <MathView math="M" />, it transforms into a parallelogram spanned by <MathView math="\hat{i}' = (a, b)" /> and <MathView math="\hat{j}' = (c, d)" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Dissecting the surrounding bounding box <MathView math="(a+c)(b+d)" /> reveals: <MathView math="\text{Area} = ad - bc = \det(M)" />.</span>
          </p>
        </div>

        {/* Right Column: Geometric Box Dissection Visual */}
        <div className="lg:col-span-7 flex items-center justify-center">
          <div className="bg-blue-50/40 p-3 rounded-2xl border border-blue-100 flex items-center gap-6">
            <svg className="w-40 h-32" viewBox="0 0 160 120">
              {/* Bounding Box */}
              <rect x="20" y="20" width="120" height="80" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

              {/* Parallelogram in center */}
              <polygon
                points="20,80 100,100 140,40 60,20"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#2563eb"
                strokeWidth="2"
              />

              {/* 4 Corner Dissection Triangles */}
              <polygon points="20,80 100,100 20,100" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
              <polygon points="100,100 140,40 140,100" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              <polygon points="140,40 60,20 140,20" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
              <polygon points="60,20 20,80 20,20" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

              {/* Labels */}
              <text x="75" y="65" fill="#1e3a8a" fontSize="11" fontWeight="bold" textAnchor="middle">
                ad - bc
              </text>
            </svg>

            <div className="text-[11px] font-mono text-slate-700 space-y-1">
              <div><strong className="text-blue-900">Total Box:</strong> (a+c)(b+d)</div>
              <div><strong className="text-rose-600">- Triangles:</strong> 2(½ab) + 2(½cd)</div>
              <div><strong className="text-amber-600">- Rectangles:</strong> 2(bc)</div>
              <div className="pt-1 border-t border-blue-200 font-bold text-blue-700">= ad - bc</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-blue-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Every 2D linear transformation scales area by <MathView math="|\det(M)| = |ad - bc|" />, and reverses orientation if <MathView math="\det(M) < 0" />.
        </p>
      </div>
    </div>
  );
};
