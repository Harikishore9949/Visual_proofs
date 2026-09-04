import React, { useState, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  Layers, 
  Maximize2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MATRIX_PRESETS, MatrixPreset } from '../../data/matricesData';
import { Matrix2x2, transformPoint, getDeterminant, generateTransformedGridLines } from '../../utils/matricesMath';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface Panel1Props {
  matrix: Matrix2x2;
  setMatrix: React.Dispatch<React.SetStateAction<Matrix2x2>>;
  showOriginalGrid: boolean;
  showTransformedGrid: boolean;
  showBasisVectors: boolean;
  showArea: boolean;
  snapEnabled: boolean;
  isCustomMatrix: boolean;
  setIsCustomMatrix: (val: boolean) => void;
  showDerivationShapes: boolean;
  setShowDerivationShapes: (val: boolean) => void;
}

export const Panel1MatrixCanvas: React.FC<Panel1Props> = ({
  matrix,
  setMatrix,
  showOriginalGrid,
  showTransformedGrid,
  showBasisVectors,
  showArea,
  snapEnabled,
  isCustomMatrix,
  setIsCustomMatrix,
  showDerivationShapes,
  setShowDerivationShapes,
}) => {
  const [activePreset, setActivePreset] = useState<string>('identity');
  const [draggingHandle, setDraggingHandle] = useState<'i' | 'j' | 'shape' | null>(null);
  const [draggingShape, setDraggingShape] = useState<number | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Derivation shapes positions (small movable shapes to show transformation process)
  const [derivationShapes, setDerivationShapes] = useState([
    { id: 1, x: -1.5, y: 0.5, originalX: -1.5, originalY: 0.5, color: '#f59e0b' },
    { id: 2, x: -0.5, y: -0.5, originalX: -0.5, originalY: -0.5, color: '#10b981' },
    { id: 3, x: 0.5, y: 0.8, originalX: 0.5, originalY: 0.8, color: '#8b5cf6' },
  ]);

  const det = getDeterminant(matrix);
  const scale = 36; // 36 px per coordinate unit
  const cx = 140;
  const cy = 120;

  // Screen coordinates for origin and basis vectors
  const iScreen = { x: cx + matrix.a * scale, y: cy - matrix.b * scale };
  const jScreen = { x: cx + matrix.c * scale, y: cy - matrix.d * scale };
  const sumScreen = { x: cx + (matrix.a + matrix.c) * scale, y: cy - (matrix.b + matrix.d) * scale };

  // Parallelogram path
  const parallelogramPath = `M ${cx},${cy} L ${iScreen.x.toFixed(1)},${iScreen.y.toFixed(1)} L ${sumScreen.x.toFixed(1)},${sumScreen.y.toFixed(1)} L ${jScreen.x.toFixed(1)},${jScreen.y.toFixed(1)} Z`;

  // Transformed grid lines
  const { xLines, yLines } = generateTransformedGridLines(matrix, 3, scale, cx, cy);

  const handleApplyPreset = (preset: MatrixPreset) => {
    sound.playClick();
    setActivePreset(preset.id);
    setMatrix({
      a: preset.matrix[0],
      c: preset.matrix[1],
      b: preset.matrix[2],
      d: preset.matrix[3],
    });
  };

  const handlePointerDown = (handle: 'i' | 'j' | 'shape', shapeId?: number, e?: React.PointerEvent) => {
    if (e) {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
    }
    if (handle === 'shape' && shapeId !== undefined) {
      setDraggingShape(shapeId);
    }
    setDraggingHandle(handle);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingHandle || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 240 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let mathX = (mouseX - cx) / scale;
    let mathY = (cy - mouseY) / scale;

    if (snapEnabled) {
      mathX = Math.round(mathX * 2) / 2; // snap to 0.5 increments
      mathY = Math.round(mathY * 2) / 2;
    } else {
      mathX = Math.round(mathX * 100) / 100;
      mathY = Math.round(mathY * 100) / 100;
    }

    if (draggingHandle === 'shape' && draggingShape !== null) {
      setDerivationShapes(prev => prev.map(shape => 
        shape.id === draggingShape ? { ...shape, x: mathX, y: mathY } : shape
      ));
    } else {
      setMatrix(prev => {
        if (draggingHandle === 'i') {
          return { ...prev, a: mathX, b: mathY };
        } else {
          return { ...prev, c: mathX, d: mathY };
        }
      });
      setActivePreset('custom');
    }
  }, [draggingHandle, draggingShape, snapEnabled, setMatrix, cx, cy, scale]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingHandle) {
      setDraggingHandle(null);
      setDraggingShape(null);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Interactive 2D Matrix Canvas
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Drag the basis vector arrowheads directly on the canvas or edit matrix values below.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left 2x2 Matrix Controls */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 shadow-inner w-full max-w-[220px]">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Matrix M = [ î' | ĵ' ]
            </div>

            {/* Matrix 2x2 bracket editor */}
            <div className="flex items-center justify-center gap-2">
              <div className="text-3xl text-slate-400 font-light">[</div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {/* a = i_x */}
                <div>
                  <label className="block text-[9px] text-emerald-700 font-bold mb-0.5">î.x (a)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.a}
                    onChange={(e) => setMatrix(prev => ({ ...prev, a: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
                {/* c = j_x */}
                <div>
                  <label className="block text-[9px] text-rose-700 font-bold mb-0.5">ĵ.x (c)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.c}
                    onChange={(e) => setMatrix(prev => ({ ...prev, c: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-rose-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
                {/* b = i_y */}
                <div>
                  <label className="block text-[9px] text-emerald-700 font-bold mb-0.5">î.y (b)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.b}
                    onChange={(e) => setMatrix(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
                {/* d = j_y */}
                <div>
                  <label className="block text-[9px] text-rose-700 font-bold mb-0.5">ĵ.y (d)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.d}
                    onChange={(e) => setMatrix(prev => ({ ...prev, d: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-rose-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-3xl text-slate-400 font-light">]</div>
            </div>

            {/* Determinant Readout Box */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">det(M):</span>
              <span className="font-mono font-extrabold text-blue-700 px-2 py-0.5 bg-blue-50 rounded-md border border-blue-200">
                {det.toFixed(2)}
              </span>
            </div>

            {/* Custom Matrix Toggle */}
            <div className="mt-2 pt-2 border-t border-slate-200/80">
              <button
                onClick={() => setIsCustomMatrix(!isCustomMatrix)}
                className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  isCustomMatrix
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isCustomMatrix ? '✏️ Custom Mode ON' : '✏️ Enable Custom Matrix'}
              </button>
            </div>

            {/* Derivation Shapes Toggle */}
            <div className="mt-2">
              <button
                onClick={() => setShowDerivationShapes(!showDerivationShapes)}
                className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  showDerivationShapes
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {showDerivationShapes ? '🎯 Derivation Shapes ON' : '🎯 Show Derivation Steps'}
              </button>
            </div>
          </div>
        </div>

        {/* Middle / Right Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] h-[250px] rounded-2xl bg-slate-50/50 border border-blue-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg
              ref={canvasRef}
              className="w-full h-full touch-none"
              viewBox="0 0 280 240"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* 1. Base Cartesian Grid */}
              {showOriginalGrid && (
                <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                  {[-3, -2, -1, 1, 2, 3].map(i => (
                    <React.Fragment key={`bg-${i}`}>
                      <line x1={cx + i * scale} y1="10" x2={cx + i * scale} y2="230" />
                      <line x1="10" y1={cy + i * scale} x2="270" y2={cy + i * scale} />
                    </React.Fragment>
                  ))}
                </g>
              )}

              {/* 2. Main Fixed Axes (x, y) */}
              <g stroke="#94a3b8" strokeWidth="1.5" opacity="0.7">
                <line x1="10" y1={cy} x2="270" y2={cy} />
                <line x1={cx} y1="10" x2={cx} y2="230" />
              </g>

              {/* 3. Transformed Warped Grid */}
              {showTransformedGrid && (
                <g stroke="#93c5fd" strokeWidth="1.2" opacity="0.65">
                  {xLines.map((l, idx) => (
                    <line key={`tx-${idx}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                  ))}
                  {yLines.map((l, idx) => (
                    <line key={`ty-${idx}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                  ))}
                </g>
              )}

              {/* 4. Original Unit Square Outline */}
              <rect
                x={cx}
                y={cy - scale}
                width={scale}
                height={scale}
                fill="rgba(148, 163, 184, 0.15)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />

              {/* 5. Transformed Parallelogram (Determinant Area) */}
              {showArea && Math.abs(det) > 0.001 && (
                <path
                  d={parallelogramPath}
                  fill={det >= 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
                  stroke={det >= 0 ? '#2563eb' : '#e11d48'}
                  strokeWidth="2"
                  className="transition-colors"
                />
              )}

              {/* 6. Basis Vector î' (Green) */}
              {showBasisVectors && (
                <g>
                  {/* Arrow body */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={iScreen.x}
                    y2={iScreen.y}
                    stroke="#059669"
                    strokeWidth="2.5"
                  />
                  {/* Draggable Tip Handle */}
                  <g
                    onPointerDown={(e) => handlePointerDown('i', undefined, e)}
                    className="cursor-grab active:cursor-grabbing group/i"
                  >
                    <circle cx={iScreen.x} cy={iScreen.y} r="18" fill="transparent" />
                    <circle
                      cx={iScreen.x}
                      cy={iScreen.y}
                      r="7"
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="group-hover/i:scale-125 transition-transform shadow-md"
                    />
                    <text x={iScreen.x + 8} y={iScreen.y - 4} fill="#047857" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      î'({matrix.a},{matrix.b})
                    </text>
                  </g>
                </g>
              )}

              {/* 7. Basis Vector ĵ' (Rose/Orange) */}
              {showBasisVectors && (
                <g>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={jScreen.x}
                    y2={jScreen.y}
                    stroke="#e11d48"
                    strokeWidth="2.5"
                  />
                  <g
                    onPointerDown={(e) => handlePointerDown('j', undefined, e)}
                    className="cursor-grab active:cursor-grabbing group/j"
                  >
                    <circle cx={jScreen.x} cy={jScreen.y} r="18" fill="transparent" />
                    <circle
                      cx={jScreen.x}
                      cy={jScreen.y}
                      r="7"
                      fill="#e11d48"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="group-hover/j:scale-125 transition-transform shadow-md"
                    />
                    <text x={jScreen.x + 8} y={jScreen.y - 4} fill="#be123c" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      ĵ'({matrix.c},{matrix.d})
                    </text>
                  </g>
                </g>
              )}

              {/* Center Origin Node */}
              <circle cx={cx} cy={cy} r="4" fill="#1e293b" />

              {/* Derivation Shapes (movable small shapes to show transformation process) */}
              {showDerivationShapes && derivationShapes.map((shape) => {
                // Original position
                const originalScreen = { 
                  x: cx + shape.originalX * scale, 
                  y: cy - shape.originalY * scale 
                };
                // Transformed position
                const transformed = transformPoint({ x: shape.originalX, y: shape.originalY }, matrix);
                const transformedScreen = { 
                  x: cx + transformed.x * scale, 
                  y: cy - transformed.y * scale 
                };

                return (
                  <g key={shape.id}>
                    {/* Original position (faded) */}
                    <circle
                      cx={originalScreen.x}
                      cy={originalScreen.y}
                      r="6"
                      fill={shape.color}
                      opacity={0.3}
                    />
                    <text
                      x={originalScreen.x}
                      y={originalScreen.y - 10}
                      fill={shape.color}
                      fontSize="8"
                      textAnchor="middle"
                      opacity={0.5}
                    >
                      P{shape.id}
                    </text>

                    {/* Arrow showing transformation */}
                    <line
                      x1={originalScreen.x}
                      y1={originalScreen.y}
                      x2={transformedScreen.x}
                      y2={transformedScreen.y}
                      stroke={shape.color}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                      opacity={0.6}
                    />

                    {/* Transformed position (movable) */}
                    <g
                      onPointerDown={(e) => handlePointerDown('shape', shape.id, e)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle
                        cx={transformedScreen.x}
                        cy={transformedScreen.y}
                        r="8"
                        fill="transparent"
                      />
                      <circle
                        cx={transformedScreen.x}
                        cy={transformedScreen.y}
                        r="6"
                        fill={shape.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="hover:scale-125 transition-transform"
                      />
                      <text
                        x={transformedScreen.x}
                        y={transformedScreen.y - 12}
                        fill={shape.color}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        P{shape.id}'
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Top Right Orientation Badge */}
            <div className="absolute top-2 right-2">
              {det > 0.01 ? (
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Preserved Orientation (Det = {det.toFixed(2)})</span>
                </span>
              ) : det < -0.01 ? (
                <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Inverted Orientation (Reflected)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Singular (Det = 0, Collapsed)</span>
                </span>
              )}
            </div>

            {/* Bottom Left Status */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-blue-100 text-[10px] font-mono font-bold text-slate-700 shadow-sm">
              Area Scale = |det| = {Math.abs(det).toFixed(2)}×
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-blue-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Presets:</span>
          {MATRIX_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
