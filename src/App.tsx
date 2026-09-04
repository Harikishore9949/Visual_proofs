import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { LineRotationalSymmetryProofPage } from './components/proof/LineRotationalSymmetryProofPage';
import { TessellationsRepeatedTransformationsProofPage } from './components/proof167/TessellationsRepeatedTransformationsProofPage';
import { TransformationMatrices2DProofPage } from './components/proof168/TransformationMatrices2DProofPage';
import { FirstOrderDifferentialEquationSlopeFieldProofPage } from './components/proof169/FirstOrderDifferentialEquationSlopeFieldProofPage';
import { SimpleHarmonicMotionProofPage } from './components/proof170/SimpleHarmonicMotionProofPage';
import { FourierSeriesWaveBuildingProofPage } from './components/proof171/FourierSeriesWaveBuildingProofPage';
import { LaplaceTransformDecaySystemProofPage } from './components/proof172/LaplaceTransformDecaySystemProofPage';
import { GradientSteepestIncreaseProofPage } from './components/proof173/GradientSteepestIncreaseProofPage';
import { DivergenceCurlVectorFieldProofPage } from './components/proof174/DivergenceCurlVectorFieldProofPage';
import { TrapezoidalRuleNumericalIntegrationProofPage } from './components/proof175/TrapezoidalRuleNumericalIntegrationProofPage';
import { LinearProgrammingFeasibleRegionProofPage } from './components/proof176/LinearProgrammingFeasibleRegionProofPage';
import { ArithmeticProgressionEqualStepsProofPage } from './components/proof177/ArithmeticProgressionEqualStepsProofPage';
import { NewProofModal } from './components/dashboard/NewProofModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [activeProofId, setActiveProofId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync with browser URL / hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('arithmetic-progression-equal-steps')) {
        setActiveProofId('arithmetic-progression-equal-steps');
      } else if (hash.includes('linear-programming-feasible-region')) {
        setActiveProofId('linear-programming-feasible-region');
      } else if (hash.includes('trapezoidal-rule-numerical-integration')) {
        setActiveProofId('trapezoidal-rule-numerical-integration');
      } else if (hash.includes('divergence-curl-vector-field')) {
        setActiveProofId('divergence-curl-vector-field');
      } else if (hash.includes('gradient-steepest-increase')) {
        setActiveProofId('gradient-steepest-increase');
      } else if (hash.includes('laplace-transform-decay-system')) {
        setActiveProofId('laplace-transform-decay-system');
      } else if (hash.includes('fourier-series-wave-building')) {
        setActiveProofId('fourier-series-wave-building');
      } else if (hash.includes('first-order-differential-equation-slope-field')) {
        setActiveProofId('first-order-differential-equation-slope-field');
      } else if (hash.includes('simple-harmonic-motion')) {
        setActiveProofId('simple-harmonic-motion');
      } else if (hash.includes('tessellations-repeated-transformations')) {
        setActiveProofId('tessellations-repeated-transformations');
      } else if (hash.includes('transformation-matrices-2d')) {
        setActiveProofId('transformation-matrices-2d');
      } else if (hash.includes('line-rotational-symmetry')) {
        setActiveProofId('line-rotational-symmetry');
      } else {
        setActiveProofId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectProof = (proofId: string) => {
    setActiveProofId(proofId);
    if (proofId === 'arithmetic-progression-equal-steps') {
      window.location.hash = `/visual-proofs/sequences-and-series/${proofId}`;
    } else if (
      proofId === 'first-order-differential-equation-slope-field' || 
      proofId === 'simple-harmonic-motion' ||
      proofId === 'fourier-series-wave-building' ||
      proofId === 'laplace-transform-decay-system' ||
      proofId === 'gradient-steepest-increase' ||
      proofId === 'divergence-curl-vector-field' ||
      proofId === 'trapezoidal-rule-numerical-integration' ||
      proofId === 'linear-programming-feasible-region'
    ) {
      window.location.hash = `/visual-proofs/engineering-mathematics/${proofId}`;
    } else {
      window.location.hash = `/visual-proofs/transformations-symmetry/${proofId}`;
    }
  };

  const handleBackToDashboard = () => {
    setActiveProofId(null);
    window.location.hash = '';
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'proofs' || tab === 'explore') {
      if (!activeProofId) {
        setActiveProofId('line-rotational-symmetry');
        window.location.hash = '/visual-proofs/transformations-symmetry/line-rotational-symmetry';
      }
    }
  };

  // Render the appropriate Proof studio or Dashboard
  const renderContent = () => {
    switch (activeProofId) {
      case 'arithmetic-progression-equal-steps':
        return <ArithmeticProgressionEqualStepsProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'linear-programming-feasible-region':
        return <LinearProgrammingFeasibleRegionProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'trapezoidal-rule-numerical-integration':
        return <TrapezoidalRuleNumericalIntegrationProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'divergence-curl-vector-field':
        return <DivergenceCurlVectorFieldProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'gradient-steepest-increase':
        return <GradientSteepestIncreaseProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'laplace-transform-decay-system':
        return <LaplaceTransformDecaySystemProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'fourier-series-wave-building':
        return <FourierSeriesWaveBuildingProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'first-order-differential-equation-slope-field':
        return <FirstOrderDifferentialEquationSlopeFieldProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'simple-harmonic-motion':
        return <SimpleHarmonicMotionProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'tessellations-repeated-transformations':
        return <TessellationsRepeatedTransformationsProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'transformation-matrices-2d':
        return <TransformationMatrices2DProofPage onBackToDashboard={handleBackToDashboard} />;
      case 'line-rotational-symmetry':
        return <LineRotationalSymmetryProofPage onBackToDashboard={handleBackToDashboard} />;
      default:
        return (
          <DashboardView
            onSelectProof={handleSelectProof}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f3f4f9] font-sans antialiased text-slate-800">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onGoToDashboard={handleBackToDashboard}
        currentProofId={activeProofId || undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {renderContent()}
      </main>

      {/* Custom Formula Proof Creator Modal */}
      <NewProofModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLaunchProof={handleSelectProof}
      />
    </div>
  );
};

export default App;
