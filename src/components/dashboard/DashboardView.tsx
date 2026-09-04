import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Award, 
  Clock, 
  Zap, 
  CheckCircle2,
  Filter,
  Plus
} from 'lucide-react';
import { PROOFS_CATALOG } from '../../data/proofsCatalog';
import { MathProofItem, ProofCategory } from '../../types';
import { MathView } from '../common/MathView';

interface DashboardViewProps {
  onSelectProof: (proofId: string) => void;
  onOpenCreateModal: () => void;
}

const CATEGORIES: ('All' | ProofCategory)[] = [
  'All',
  'Transformations & Symmetry',
  'Geometry',
  'Algebra',
  'Trigonometry',
  'Calculus',
  'Number Theory',
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectProof,
  onOpenCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProofCategory>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredProofs = useMemo(() => {
    return PROOFS_CATALOG.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.catalogId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesDifficulty = 
        difficultyFilter === 'All' || item.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, difficultyFilter]);

  const flagshipProof = PROOFS_CATALOG.find(p => p.id === 'line-rotational-symmetry') || PROOFS_CATALOG[0];

  return (
    <div className="flex-1 min-h-screen bg-[#f7f8fc] px-6 lg:px-12 py-8 overflow-y-auto">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-indigo-100/60">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              Interactive Mathematical Proof Engine
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Maths Universe Catalog
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Explore interactive visual proofs, test geometric transformations, and discover profound mathematical truths through direct tactile manipulation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              New Formula Proof
            </button>
            <button
              onClick={() => onSelectProof('line-rotational-symmetry')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              Launch Proof 166
            </button>
          </div>
        </header>

        {/* Featured Hero Banner — Visual Proof 166 */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 lg:p-10 shadow-xl shadow-indigo-950/10 border border-indigo-700/40">
          {/* Background Decorative Rings */}
          <div className="absolute right-0 top-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="absolute right-32 bottom-0 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-400/30">
                  Featured Interactive Proof #166
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded-full backdrop-blur-sm">
                  {flagshipProof.category}
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-200 text-xs font-medium rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-300" /> {flagshipProof.duration}
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
                {flagshipProof.title}
              </h2>

              <p className="text-indigo-100/90 text-sm lg:text-base leading-relaxed max-w-2xl">
                Test mirror lines and rotation angles that map a regular shape onto itself. Dock shapes into the active symmetry analyser, rotate through $360^\circ$, and uncover the fundamental $n$-gon equivalence theorem.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 inline-block max-w-full">
                <div className="text-xs text-indigo-200 font-semibold mb-1 uppercase tracking-wider">Theorem Statement:</div>
                <div className="text-base lg:text-lg text-white font-mono">
                  <MathView math="n \text{ sides} \implies n \text{ mirror lines} \quad \& \quad \text{rotational order } n" />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onSelectProof('line-rotational-symmetry')}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Launch Visual Proof 166</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
                <span className="text-xs text-indigo-200 hidden sm:inline">
                  Interactive 2D Canvas · Symmetry Guide · Step-by-Step Proof
                </span>
              </div>
            </div>

            {/* Interactive Preview Graphic */}
            <div className="lg:col-span-4 flex justify-center">
              <div 
                onClick={() => onSelectProof('line-rotational-symmetry')}
                className="w-56 h-56 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-all hover:scale-105 group relative shadow-2xl"
              >
                {/* SVG Hexagon Visual Preview */}
                <svg className="w-36 h-36 drop-shadow-md transition-transform duration-700 group-hover:rotate-60" viewBox="0 0 100 100">
                  {/* Mirror lines */}
                  <line x1="50" y1="5" x2="50" y2="95" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="11" y1="27.5" x2="89" y2="72.5" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="11" y1="72.5" x2="89" y2="27.5" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Hexagon Body */}
                  <polygon
                    points="50,15 85,35 85,65 50,85 15,65 15,35"
                    fill="rgba(199, 210, 254, 0.4)"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  {/* Center node */}
                  <circle cx="50" cy="50" r="4" fill="#ffffff" />
                  {/* Orbit arrow */}
                  <circle cx="50" cy="50" r="42" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.6" />
                </svg>
                <span className="text-[11px] font-bold text-indigo-200 mt-2 flex items-center gap-1 group-hover:text-white transition-colors">
                  Click to Explore Proof <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search, Categories & Filters */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search formulas, proofs, theorems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Difficulty:
              </span>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-300 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Proofs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProofs.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProof(item.id)}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
                style={{ backgroundColor: item.color }}
              />

              <div className="space-y-4">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {item.difficulty}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors font-sans leading-snug">
                  {item.title}
                </h3>

                {/* Formula Display Box */}
                <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 flex items-center justify-center min-h-[52px]">
                  <MathView math={item.formula} className="text-slate-800 text-sm font-semibold" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Learning Outcomes Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-indigo-50/60 text-indigo-600 text-[10px] font-medium rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {item.id === 'line-rotational-symmetry' ? 'Open Visual Studio' : 'Explore Proof'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {item.catalogId}
                </span>
              </div>
            </div>
          ))}
        </section>

        {filteredProofs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No formula proofs found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
