
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TradingPlan } from '../types';
import { reviewTradingPlan } from '../services/geminiService';

interface GraduationProjectProps {
  savedPlans: TradingPlan[];
  onSavePlan: (plan: TradingPlan) => void;
}

const GraduationProject: React.FC<GraduationProjectProps> = ({ savedPlans, onSavePlan }) => {
  const [activeView, setActiveView] = useState<'LIST' | 'EDITOR' | 'DOCUMENT'>('LIST');
  const [currentPlan, setCurrentPlan] = useState<TradingPlan>(getEmptyPlan());
  const [activeStep, setActiveStep] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);

  function getEmptyPlan(): TradingPlan {
    return {
      id: Date.now().toString(),
      symbol: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      step1: { fundamentals: '', technicals: '', sentiment: '', conclusion: 'Neutral' },
      step2: { impliedVolatility: 'Medium', candidateStrategies: [] },
      step3: { selectedStrategy: '', strikes: '', expiration: '', riskRewardRatio: '' },
      step4: { primaryExit: '', secondaryExitBullish: '', secondaryExitBearish: '' },
      step5_6: { placementNotes: '', monitoringPlan: '' }
    };
  }

  const handleEdit = (plan: TradingPlan) => {
    setCurrentPlan(plan);
    setActiveView('EDITOR');
    setActiveStep(1);
  };

  const handleViewDocument = (plan: TradingPlan) => {
    setCurrentPlan(plan);
    setActiveView('DOCUMENT');
  };

  const handleCreateNew = () => {
    setCurrentPlan(getEmptyPlan());
    setActiveView('EDITOR');
    setActiveStep(1);
  };

  const updatePlan = (section: keyof TradingPlan, field: string, value: any) => {
    setCurrentPlan(prev => {
      if (typeof prev[section] === 'object' && prev[section] !== null) {
        return {
          ...prev,
          [section]: {
            ...(prev[section] as any),
            [field]: value
          }
        };
      }
      return { ...prev, [section]: value }; // For top level fields
    });
  };

  const handleRequestReview = async () => {
    setIsReviewing(true);
    const feedback = await reviewTradingPlan(currentPlan);
    const updated = { ...currentPlan, aiFeedback: feedback, status: 'Graded' as const };
    setCurrentPlan(updated);
    onSavePlan(updated);
    setIsReviewing(false);
    setActiveView('DOCUMENT'); // Switch to document view to show feedback
  };

  if (activeView === 'LIST') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Graduation Projects</h1>
            <p className="text-slate-400">Build your trading plans using the 6-Step Process for Level 8 certification.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-[#8cc63f] hover:bg-[#7ab332] text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg shadow-lime-900/20 flex items-center gap-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Trade Plan
          </button>
        </div>

        {savedPlans.length === 0 ? (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 border-dashed p-12 text-center">
             <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🎓</div>
             <h3 className="text-xl font-bold text-white mb-2">Start Your Graduation Project</h3>
             <p className="text-slate-400 max-w-md mx-auto mb-6">
               To graduate, you must submit a complete trading plan demonstrating your mastery of the OptionsANIMAL methodology.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlans.map(plan => (
              <div key={plan.id} onClick={() => handleViewDocument(plan)} className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 hover:border-[#8cc63f]/50 cursor-pointer transition-all group shadow-lg flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#8cc63f] transition-colors">{plan.symbol || 'New Plan'}</h3>
                    <p className="text-xs text-slate-400">{plan.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    plan.status === 'Graded' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700' :
                    plan.status === 'Completed' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                    'bg-slate-700 text-slate-300 border border-slate-600'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4 flex-1">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Direction</span>
                      <span className="text-slate-300">{plan.step1.conclusion}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Strategy</span>
                      <span className="text-slate-300">{plan.step3.selectedStrategy || 'Pending'}</span>
                   </div>
                </div>
                {plan.aiFeedback ? (
                   <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-indigo-300 flex items-center gap-1 font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Instructor Feedback Available
                   </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
                    Draft in progress
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DOCUMENT VIEW (FULL READ-ONLY DISPLAY)
  if (activeView === 'DOCUMENT') {
    return (
      <div className="animate-in slide-in-from-right-4 duration-500 pb-12">
        {/* Nav Header */}
        <div className="flex items-center justify-between mb-8 sticky top-20 bg-[#0f172a]/95 backdrop-blur z-20 py-4 border-b border-slate-800">
           <div className="flex items-center gap-4">
             <button onClick={() => setActiveView('LIST')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Projects
             </button>
             <div className="h-6 w-px bg-slate-700"></div>
             <h2 className="text-xl font-bold text-white">
                {currentPlan.symbol ? `Plan: ${currentPlan.symbol}` : 'Untitled Plan'}
             </h2>
             <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                    currentPlan.status === 'Graded' ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {currentPlan.status}
             </span>
           </div>
           
           <div className="flex gap-3">
              <button 
                onClick={() => setActiveView('EDITOR')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Plan
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-900/50 hover:bg-blue-800 text-blue-200 border border-blue-800 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
           </div>
        </div>

        {/* AI FEEDBACK SECTION (Highlighted) */}
        {currentPlan.aiFeedback && (
          <div className="mb-8 bg-gradient-to-br from-indigo-900/40 to-[#1e293b] rounded-2xl border border-indigo-500/50 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-700">
             <div className="bg-indigo-900/50 px-6 py-4 border-b border-indigo-500/30 flex items-center gap-3">
                <div className="bg-indigo-500 p-2 rounded-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white">Coach's Critique</h3>
                   <p className="text-indigo-200 text-sm">AI Analysis of your 6-Step Plan</p>
                </div>
             </div>
             <div className="p-8 prose prose-invert prose-indigo max-w-none text-slate-200">
                <ReactMarkdown>{currentPlan.aiFeedback}</ReactMarkdown>
             </div>
          </div>
        )}

        {/* DOCUMENT CONTENT */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
           {/* Doc Header */}
           <div className="bg-slate-800 p-8 border-b border-slate-700 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">{currentPlan.symbol || '___'} Trading Plan</h1>
              <p className="text-slate-400">OptionsANIMAL 6-Step Methodology • {currentPlan.date}</p>
           </div>

           <div className="p-8 space-y-12">
              
              {/* STEP 1 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">1</div>
                    <h3 className="text-2xl font-bold text-white">Determine Direction</h3>
                    <span className={`ml-auto px-4 py-1 rounded-full text-sm font-bold border ${
                       currentPlan.step1.conclusion === 'Bullish' ? 'bg-green-900/50 text-green-400 border-green-700' :
                       currentPlan.step1.conclusion === 'Bearish' ? 'bg-red-900/50 text-red-400 border-red-700' :
                       'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                       {currentPlan.step1.conclusion}
                    </span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Fundamentals</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step1.fundamentals || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Technicals</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step1.technicals || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Sentiment</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step1.sentiment || 'N/A'}</p>
                    </div>
                 </div>
              </section>
              
              <hr className="border-slate-800" />

              {/* STEP 2 & 3 */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">2</div>
                        <h3 className="text-2xl font-bold text-white">Possibilities</h3>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-full">
                       <div className="mb-4">
                          <span className="text-sm text-slate-500 block mb-1">IV Environment</span>
                          <span className="text-lg font-bold text-white">{currentPlan.step2.impliedVolatility}</span>
                       </div>
                       <div>
                          <span className="text-sm text-slate-500 block mb-1">Strategies Considered</span>
                          <div className="flex flex-wrap gap-2">
                             {currentPlan.step2.candidateStrategies.map((s, i) => (
                               <span key={i} className="bg-slate-800 px-3 py-1 rounded-full text-sm text-slate-300 border border-slate-700">{s}</span>
                             ))}
                             {currentPlan.step2.candidateStrategies.length === 0 && <span className="text-slate-600 italic">None listed</span>}
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">3</div>
                        <h3 className="text-2xl font-bold text-white">Structure</h3>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-full space-y-4">
                       <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">Selected Strategy</span>
                          <span className="text-[#8cc63f] font-bold">{currentPlan.step3.selectedStrategy || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">Expiration</span>
                          <span className="text-white font-medium">{currentPlan.step3.expiration || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-800 pb-2">
                          <span className="text-slate-400">Strikes</span>
                          <span className="text-white font-medium">{currentPlan.step3.strikes || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-400">Risk / Reward</span>
                          <span className="text-white font-medium">{currentPlan.step3.riskRewardRatio || 'N/A'}</span>
                       </div>
                    </div>
                 </div>
              </section>

              <hr className="border-slate-800" />

              {/* STEP 4 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">4</div>
                    <h3 className="text-2xl font-bold text-white">Exit Plan</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-900/20 p-5 rounded-xl border border-green-900/50">
                       <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Primary Exit (Target)</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step4.primaryExit || 'N/A'}</p>
                    </div>
                    <div className="bg-red-900/20 p-5 rounded-xl border border-red-900/50">
                       <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Secondary (Bullish)</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step4.secondaryExitBullish || 'N/A'}</p>
                    </div>
                    <div className="bg-red-900/20 p-5 rounded-xl border border-red-900/50">
                       <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Secondary (Bearish)</h4>
                       <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step4.secondaryExitBearish || 'N/A'}</p>
                    </div>
                 </div>
              </section>

              <hr className="border-slate-800" />

              {/* STEP 5 & 6 */}
              <section>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-slate-600">5-6</div>
                    <h3 className="text-2xl font-bold text-white">Execution & Monitoring</h3>
                 </div>
                 <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <h4 className="text-slate-400 font-bold mb-2">Placement Notes</h4>
                          <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step5_6.placementNotes || 'N/A'}</p>
                       </div>
                       <div>
                          <h4 className="text-slate-400 font-bold mb-2">Monitoring Plan</h4>
                          <p className="text-slate-200 whitespace-pre-wrap">{currentPlan.step5_6.monitoringPlan || 'N/A'}</p>
                       </div>
                    </div>
                 </div>
              </section>

           </div>
           
           <div className="bg-slate-800 p-4 text-center text-slate-500 text-sm border-t border-slate-700">
              OptionsANIMAL Graduation Project • Generated via OptionsAI Companion
           </div>
        </div>
      </div>
    );
  }

  // EDITOR VIEW
  return (
    <div className="animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
        <button onClick={() => setActiveView('LIST')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             {currentPlan.symbol ? `Plan: ${currentPlan.symbol}` : 'New Trading Plan'}
             <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">
               Step {activeStep} of 6
             </span>
          </h2>
        </div>
        <div className="ml-auto flex gap-3">
           <input 
             type="text" 
             placeholder="Symbol" 
             value={currentPlan.symbol}
             onChange={(e) => updatePlan('symbol' as any, '', e.target.value.toUpperCase())}
             className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-bold w-24 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
           />
           <button 
             onClick={() => setActiveView('DOCUMENT')}
             className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
             Preview Plan
           </button>
           <button 
             onClick={() => {
                onSavePlan(currentPlan);
                alert('Plan saved Draft!');
             }}
             className="px-4 py-2 bg-[#8cc63f]/20 hover:bg-[#8cc63f]/30 text-[#8cc63f] border border-[#8cc63f]/50 rounded-lg font-medium transition-colors"
           >
             Save Draft
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Wizard Nav */}
        <div className="lg:col-span-1 space-y-2">
           {[
             { num: 1, title: 'Determine Direction' },
             { num: 2, title: 'Analyze Possibilities' },
             { num: 3, title: 'Select Strategy' },
             { num: 4, title: 'Determine Exits' },
             { num: 5, title: 'Place Trade' },
             { num: 6, title: 'Monitor & Adjust' },
           ].map(step => (
             <button
               key={step.num}
               onClick={() => setActiveStep(step.num)}
               className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                 activeStep === step.num 
                   ? 'bg-[#8cc63f] text-slate-900 font-bold shadow-lg shadow-lime-900/20' 
                   : 'bg-[#1e293b] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700'
               }`}
             >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs border ${
                   activeStep === step.num ? 'border-slate-900' : 'border-slate-500'
                }`}>
                   {step.num}
                </div>
                {step.title}
             </button>
           ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 bg-[#1e293b] rounded-2xl border border-slate-700 p-8 shadow-xl min-h-[600px] flex flex-col">
          
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Step 1: Determine the Direction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Fundamental Analysis</label>
                    <textarea 
                      className="w-full h-32 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="Earnings growth, PE ratio, Debt, Management..."
                      value={currentPlan.step1.fundamentals}
                      onChange={(e) => updatePlan('step1', 'fundamentals', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Technical Analysis</label>
                    <textarea 
                      className="w-full h-32 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="Support/Resistance, Trends, Indicators (RSI, MACD)..."
                      value={currentPlan.step1.technicals}
                      onChange={(e) => updatePlan('step1', 'technicals', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-300">Sentimental Analysis</label>
                    <textarea 
                      className="w-full h-24 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="Contrarian signals, Put/Call ratios, News sentiment..."
                      value={currentPlan.step1.sentiment}
                      onChange={(e) => updatePlan('step1', 'sentiment', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-300 block">Overall Directional Conclusion</label>
                    <div className="flex gap-4">
                      {['Bullish', 'Bearish', 'Neutral', 'Stagnant'].map(dir => (
                        <button 
                          key={dir}
                          onClick={() => updatePlan('step1', 'conclusion', dir)}
                          className={`flex-1 py-3 rounded-lg border font-bold transition-all ${
                             currentPlan.step1.conclusion === dir 
                               ? 'bg-[#8cc63f] text-slate-900 border-[#8cc63f]' 
                               : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {dir}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
             <div className="space-y-6 animate-in fade-in">
               <h3 className="text-xl font-bold text-white mb-4">Step 2: Analyze Trade Possibilities</h3>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6">
                  <label className="text-sm font-semibold text-slate-300 block mb-3">Implied Volatility (IV) Environment</label>
                  <div className="flex gap-4">
                      {['Low', 'Medium', 'High'].map(iv => (
                        <button 
                          key={iv}
                          onClick={() => updatePlan('step2', 'impliedVolatility', iv)}
                          className={`flex-1 py-2 rounded-lg border font-medium transition-all ${
                             currentPlan.step2.impliedVolatility === iv 
                               ? 'bg-indigo-600 text-white border-indigo-500' 
                               : 'bg-transparent text-slate-400 border-slate-600'
                          }`}
                        >
                          {iv}
                        </button>
                      ))}
                    </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Candidate Strategies</label>
                  <p className="text-xs text-slate-500 mb-2">Based on your Step 1 conclusion ({currentPlan.step1.conclusion}) and IV ({currentPlan.step2.impliedVolatility}), list strategies you are considering.</p>
                  <textarea 
                      className="w-full h-32 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="e.g. Long Call, Bull Put Spread, Calendar..."
                      value={currentPlan.step2.candidateStrategies.join(', ')}
                      onChange={(e) => updatePlan('step2', 'candidateStrategies', e.target.value.split(',').map(s => s.trim()))}
                    />
               </div>
             </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Step 3: Select & Structure Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Selected Strategy</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="e.g. Bull Put Spread"
                      value={currentPlan.step3.selectedStrategy}
                      onChange={(e) => updatePlan('step3', 'selectedStrategy', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Expiration Date</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="e.g. 3rd Friday of Month"
                      value={currentPlan.step3.expiration}
                      onChange={(e) => updatePlan('step3', 'expiration', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Strike Prices</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="e.g. Short 55 / Long 50"
                      value={currentPlan.step3.strikes}
                      onChange={(e) => updatePlan('step3', 'strikes', e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Risk / Reward Ratio</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="e.g. Risk $400 to make $100"
                      value={currentPlan.step3.riskRewardRatio}
                      onChange={(e) => updatePlan('step3', 'riskRewardRatio', e.target.value)}
                    />
                 </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Step 4: Determine Exit Points</h3>
              <p className="text-sm text-slate-400 mb-4">"Plan the trade, trade the plan." Define your exits BEFORE you enter.</p>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-green-400">Primary Exit (Target)</label>
                    <textarea 
                      className="w-full h-20 bg-[#0f172a] border border-green-900/50 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g. 50% max profit or stock hits $60"
                      value={currentPlan.step4.primaryExit}
                      onChange={(e) => updatePlan('step4', 'primaryExit', e.target.value)}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-400">Secondary Exit - Bullish Adjustment</label>
                    <textarea 
                      className="w-full h-24 bg-[#0f172a] border border-red-900/50 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="If stock goes higher than expected (testing call side)..."
                      value={currentPlan.step4.secondaryExitBullish}
                      onChange={(e) => updatePlan('step4', 'secondaryExitBullish', e.target.value)}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-400">Secondary Exit - Bearish Adjustment</label>
                    <textarea 
                      className="w-full h-24 bg-[#0f172a] border border-red-900/50 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="If stock drops (testing put side)..."
                      value={currentPlan.step4.secondaryExitBearish}
                      onChange={(e) => updatePlan('step4', 'secondaryExitBearish', e.target.value)}
                    />
                 </div>
              </div>
            </div>
          )}

          {/* STEP 5 & 6 */}
          {activeStep >= 5 && (
            <div className="space-y-6 animate-in fade-in">
               <h3 className="text-xl font-bold text-white mb-4">Step 5 & 6: Execution & Monitoring</h3>
               <div className="space-y-4">
                 <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl mb-4">
                    <p className="text-yellow-200 text-sm font-bold">⚠️ Virtual Trade Only</p>
                    <p className="text-yellow-100/70 text-xs">Verify this trade in your virtual brokerage account before confirming below.</p>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Placement Notes</label>
                    <textarea 
                      className="w-full h-24 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="Fill price, slippage, time of day..."
                      value={currentPlan.step5_6.placementNotes}
                      onChange={(e) => updatePlan('step5_6', 'placementNotes', e.target.value)}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Monitoring Plan</label>
                    <textarea 
                      className="w-full h-24 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-[#8cc63f] focus:outline-none"
                      placeholder="Check daily? Set alerts at support/resistance?"
                      value={currentPlan.step5_6.monitoringPlan}
                      onChange={(e) => updatePlan('step5_6', 'monitoringPlan', e.target.value)}
                    />
                 </div>
               </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-auto pt-8 border-t border-slate-700 flex justify-between items-center">
             <button 
               onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
               disabled={activeStep === 1}
               className="text-slate-400 hover:text-white disabled:opacity-30 font-medium px-4 py-2"
             >
               Back
             </button>
             
             {activeStep < 6 ? (
                <button 
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="bg-[#8cc63f] hover:bg-[#7ab332] text-slate-900 font-bold px-6 py-2 rounded-lg shadow-lg"
                >
                  Next Step
                </button>
             ) : (
                <div className="flex gap-3">
                   <button 
                     onClick={handleRequestReview}
                     disabled={isReviewing}
                     className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg flex items-center gap-2"
                   >
                     {isReviewing ? (
                       <>
                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Analyzing Plan...
                       </>
                     ) : 'Ask AI Coach to Review'}
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduationProject;
