import React, { useState } from 'react';
import { X, Sparkles, Wand2, Compass, Layers, CheckCircle } from 'lucide-react';
import { MathView } from '../common/MathView';

interface NewProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchProof: (proofId: string) => void;
}

export const NewProofModal: React.FC<NewProofModalProps> = ({
  isOpen,
  onClose,
  onLaunchProof,
}) => {
  const [formulaTitle, setFormulaTitle] = useState('Rotational Symmetry & Tessellation');
  const [latexInput, setLatexInput] = useState('\\sum_{i=1}^n \\theta_i = (n-2) \\times 180^\\circ');
  const [category, setCategory] = useState('Transformations & Symmetry');
  const [description, setDescription] = useState('Interactive dissection of polygon interior angles into (n-2) non-overlapping triangles.');

  if (!isOpen) return null;

  const handleLaunch = () => {
    onClose();
    onLaunchProof('line-rotational-symmetry');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Create Custom Visual Proof</h3>
            <p className="text-xs text-slate-500">Configure parameters for interactive geometry proof</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proof / Theorem Name
            </label>
            <input
              type="text"
              value={formulaTitle}
              onChange={(e) => setFormulaTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              LaTeX Equation
            </label>
            <input
              type="text"
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              className="w-full px-3.5 py-2 font-mono rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
              <MathView math={latexInput} className="text-indigo-900 font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option>Transformations & Symmetry</option>
                <option>Geometry</option>
                <option>Algebra</option>
                <option>Trigonometry</option>
                <option>Calculus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Interaction Mode
              </label>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" /> 2D Rigid Motion
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pedagogical Target
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <Wand2 className="w-4 h-4" />
            Build & Launch Interactive Proof
          </button>
        </div>
      </div>
    </div>
  );
};
