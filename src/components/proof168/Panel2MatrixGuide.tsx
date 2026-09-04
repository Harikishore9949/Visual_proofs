import React from 'react';
import { Info, Check } from 'lucide-react';
import { MATRIX_PRESETS, MatrixPreset } from '../../data/matricesData';
import { Matrix2x2 } from '../../utils/matricesMath';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface Panel2Props {
  currentMatrix: Matrix2x2;
  onApplyMatrix: (preset: MatrixPreset) => void;
}

export const Panel2MatrixGuide: React.FC<Panel2Props> = ({
  currentMatrix,
  onApplyMatrix,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Matrix Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Standard 2D linear transformation matrix dictionary.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-blue-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-blue-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-blue-100/80">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-2 text-center">Matrix Form</th>
              <th className="py-2 px-2 text-center">det</th>
              <th className="py-2 px-2 text-center">Area Effect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/80">
            {MATRIX_PRESETS.slice(0, 6).map((preset) => (
              <tr
                key={preset.id}
                onClick={() => {
                  sound.playClick();
                  onApplyMatrix(preset);
                }}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <td className="py-2 px-3 font-semibold text-slate-800">
                  {preset.name.split(' (')[0]}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] text-blue-950 font-bold">
                  [{preset.matrix[0]}, {preset.matrix[1]}; {preset.matrix[2]}, {preset.matrix[3]}]
                </td>
                <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">
                  {preset.det}
                </td>
                <td className="py-2 px-2 text-center font-medium text-[11px] text-slate-600">
                  {Math.abs(preset.det)}× {preset.det < 0 ? '(Flipped)' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-blue-900 bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-blue-950">Basis Vector Mapping:</strong> The 1st column is <MathView math="M\hat{i}" /> and the 2nd column is <MathView math="M\hat{j}" />. Every point <MathView math="(x,y)" /> is transformed to <MathView math="x M\hat{i} + y M\hat{j}" />.
        </p>
      </div>
    </div>
  );
};
