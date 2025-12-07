
import React, { useState, useEffect } from 'react';
import { StockFundamentalAnalysis, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { getStockFundamentals } from '../services/geminiService';
import { getTradierData } from '../services/tradierService';

interface RoutineBuilderProps {
  user?: UserProfile;
}

const RoutineBuilder: React.FC<RoutineBuilderProps> = ({ user }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [watchlist, setWatchlist] = useState<StockFundamentalAnalysis[]>([]);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Check if user has Tradier API key
  const hasTradierIntegration = !!user?.apiKeys?.tradier;

  // Form State
  const [formData, setFormData] = useState<Partial<StockFundamentalAnalysis>>({
    symbol: '',
    name: '',
    overview: '',
    avgVolume: '',
    institutionalOwnership: '',
    earningsDate: '',
    range52Week: '',
    // Financial Health
    debtToEquity: '',
    peRatio: '',
    dividend: '',
    intrinsicValue: '',
    analystTargetPrice: '',
    // Management
    management: { roic: '', roa: '', roe: '' },
    // Growth
    growth: {
      currentQtr: '',
      nextQtr: '',
      currentYear: '',
      nextYear: '',
      next5Years: '',
      past5Years: '',
      industryAvg: ''
    },
    notes: ''
  });

  useEffect(() => {
    setWatchlist(storageService.getWatchlist());
  }, []);

  const handleAutoFill = async () => {
    if (!formData.symbol) {
      alert("Please enter a symbol first.");
      return;
    }
    
    setIsAutoFilling(true);
    
    try {
      // STRATEGY: 
      // 1. If Tradier Key exists, fetch HARD data (Price, Range, Volume) from Tradier.
      // 2. Always fetch SOFT data (Overview, Management, Growth Estimates) from AI, 
      //    as Tradier Quotes don't usually contain this deep fundamental info.
      
      let tradierData = {};
      
      if (hasTradierIntegration && user?.apiKeys?.tradier) {
        try {
          tradierData = await getTradierData(formData.symbol, user.apiKeys.tradier);
        } catch (tradierError) {
          console.error("Tradier fetch failed", tradierError);
          alert("Could not fetch Tradier data. Falling back to AI estimate. Check your API Key or Console for CORS errors.");
        }
      }

      // Always fetch AI data to fill in the gaps (Overview, detailed financials)
      // The AI will "hallucinate" the range, but we will overwrite it with Tradier data if available.
      const aiData = await getStockFundamentals(formData.symbol);

      setFormData(prev => ({
        ...prev,
        ...aiData,       // Fill with AI estimates first
        ...tradierData,  // Overwrite with Real Tradier Data (Range, Volume, etc)
        symbol: prev.symbol // Keep user symbol
      }));

    } catch (e) {
      alert("Failed to fetch data.");
    }
    
    setIsAutoFilling(false);
  };

  const handleSaveStock = () => {
    if (!formData.symbol) return;
    
    const newStock: StockFundamentalAnalysis = {
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      symbol: formData.symbol.toUpperCase(),
      name: formData.name || '',
      overview: formData.overview || '',
      avgVolume: formData.avgVolume || '',
      institutionalOwnership: formData.institutionalOwnership || '',
      earningsDate: formData.earningsDate || '',
      range52Week: formData.range52Week || '',
      // New Fields
      debtToEquity: formData.debtToEquity || '',
      peRatio: formData.peRatio || '',
      dividend: formData.dividend || '',
      intrinsicValue: formData.intrinsicValue || '',
      analystTargetPrice: formData.analystTargetPrice || '',
      management: {
        roic: formData.management?.roic || '',
        roa: formData.management?.roa || '',
        roe: formData.management?.roe || ''
      },
      growth: {
        currentQtr: formData.growth?.currentQtr || '',
        nextQtr: formData.growth?.nextQtr || '',
        currentYear: formData.growth?.currentYear || '',
        nextYear: formData.growth?.nextYear || '',
        next5Years: formData.growth?.next5Years || '',
        past5Years: formData.growth?.past5Years || '',
        industryAvg: formData.growth?.industryAvg || ''
      },
      notes: formData.notes || ''
    };

    const updatedList = [...watchlist, newStock];
    setWatchlist(updatedList);
    storageService.saveWatchlist(updatedList);
    setIsAddingStock(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = watchlist.filter(s => s.id !== id);
    setWatchlist(updated);
    storageService.saveWatchlist(updated);
  };

  const resetForm = () => {
    setFormData({
        symbol: '',
        name: '',
        overview: '',
        avgVolume: '',
        institutionalOwnership: '',
        earningsDate: '',
        range52Week: '',
        debtToEquity: '',
        peRatio: '',
        dividend: '',
        intrinsicValue: '',
        analystTargetPrice: '',
        management: { roic: '', roa: '', roe: '' },
        growth: { currentQtr: '', nextQtr: '', currentYear: '', nextYear: '', next5Years: '', past5Years: '', industryAvg: '' },
        notes: ''
    });
  };

  const updateGrowth = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      growth: {
        ...prev.growth!,
        [field]: value
      }
    }));
  };

  const updateManagement = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      management: {
        ...prev.management!,
        [field]: value
      }
    }));
  };

  const steps = [
    { id: 1, title: 'Determine Direction', desc: 'Fundamental, Technical, & Sentiment Analysis' },
    { id: 2, title: 'Analyze Trade Possibilities', desc: 'Evaluate Bullish, Bearish, Stagnant trades' },
    { id: 3, title: 'Select/Structure Strategy', desc: 'Build appropriate strategy based on analysis' },
    { id: 4, title: 'Determine Exit Points', desc: 'Define Primary and Secondary exits' },
    { id: 5, title: 'Place Trade', desc: 'Execute the chosen strategy' },
    { id: 6, title: 'Monitor & Adjust', desc: 'Observe and adjust per plan' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-6">6-Step Process</h3>
           <div className="space-y-2">
             {steps.map(step => (
               <button
                 key={step.id}
                 onClick={() => setActiveStep(step.id)}
                 className={`w-full text-left p-4 rounded-xl transition-all border ${
                   activeStep === step.id 
                     ? 'bg-[#8cc63f] text-slate-900 border-[#8cc63f] shadow-lg shadow-lime-900/20' 
                     : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                      activeStep === step.id ? 'border-slate-900' : 'border-slate-600'
                   }`}>
                     {step.id}
                   </div>
                   <span className="font-bold">{step.title}</span>
                 </div>
                 {activeStep === step.id && (
                   <p className="mt-2 text-xs opacity-80 pl-9">{step.desc}</p>
                 )}
               </button>
             ))}
           </div>
        </div>
        
        {/* Helper Tip Card */}
        {activeStep === 1 && (
           <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-xl">
              <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
                 OA Fundamental Rules
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                 <li><strong className="text-white">Volume:</strong> {'>'} 1M shares/day (Liquidity)</li>
                 <li><strong className="text-white">Inst. Ownership:</strong> {'>'} 50% (Smart Money)</li>
                 <li><strong className="text-white">Growth:</strong> Look for accelerating earnings growth vs industry.</li>
              </ul>
           </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
         
         {activeStep === 1 ? (
           <>
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-3xl font-bold text-white">Step 1: Determine Direction</h2>
                   <p className="text-slate-400">Build your watchlist by analyzing company fundamentals.</p>
                </div>
                {!isAddingStock && (
                   <button 
                     onClick={() => setIsAddingStock(true)}
                     className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-900/40 flex items-center gap-2 transition-all"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                     </svg>
                     Add Stock to Watchlist
                   </button>
                )}
             </div>

             {/* ADD STOCK FORM */}
             {isAddingStock && (
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 mb-8 shadow-2xl animate-in slide-in-from-top-4">
                   <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-white">New Fundamental Analysis</h3>
                      <button onClick={() => setIsAddingStock(false)} className="text-slate-400 hover:text-white">Cancel</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Search / Symbol */}
                      <div className="md:col-span-2 flex gap-4 items-end">
                         <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ticker Symbol</label>
                            <input 
                              type="text" 
                              value={formData.symbol}
                              onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="e.g. AAPL"
                              autoFocus
                            />
                         </div>
                         <button 
                           onClick={handleAutoFill}
                           disabled={isAutoFilling}
                           className={`font-bold px-6 py-3.5 rounded-lg shadow-lg flex items-center gap-2 mb-[1px] disabled:opacity-50 ${
                             hasTradierIntegration 
                               ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                               : 'bg-purple-600 hover:bg-purple-500 text-white'
                           }`}
                         >
                           {isAutoFilling ? (
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                           ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                           )}
                           {hasTradierIntegration ? 'Fetch Tradier Data' : 'Auto-Fill with AI'}
                         </button>
                      </div>

                      {/* DATA SOURCE BADGE */}
                      <div className="md:col-span-2">
                         {hasTradierIntegration ? (
                            <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-lg flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                  <span className="text-sm font-bold text-blue-200">Source: Tradier Real-time Data + AI Analysis</span>
                               </div>
                               <span className="text-xs text-blue-400">Connected</span>
                            </div>
                         ) : (
                            <div className="bg-yellow-900/20 border border-yellow-700/30 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                               <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                  <span className="text-sm font-bold text-yellow-200">Source: AI Estimate (Educational)</span>
                               </div>
                               <div className="flex gap-2">
                                  <a href={`https://finance.yahoo.com/quote/${formData.symbol}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white underline">Verify on Yahoo</a>
                                  <span className="text-slate-600">|</span>
                                  <a href={`https://www.google.com/finance/quote/${formData.symbol}:NASDAQ`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white underline">Verify on Google</a>
                               </div>
                            </div>
                         )}
                      </div>

                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Overview</label>
                         <textarea 
                            value={formData.overview}
                            onChange={(e) => setFormData({...formData, overview: e.target.value})}
                            className="w-full h-20 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="What does the company do? How do they make money?"
                         />
                      </div>

                      {/* Key Metrics - Column 1 */}
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Avg Daily Volume</label>
                         <input 
                           type="text" 
                           value={formData.avgVolume}
                           onChange={(e) => setFormData({...formData, avgVolume: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Target: > 1 Million"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Institutional Ownership</label>
                         <input 
                           type="text" 
                           value={formData.institutionalOwnership}
                           onChange={(e) => setFormData({...formData, institutionalOwnership: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Target: > 50%"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Earnings Release Date</label>
                         <input 
                           type="text" 
                           value={formData.earningsDate}
                           onChange={(e) => setFormData({...formData, earningsDate: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Next Date"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">52-Week Range</label>
                         <input 
                           type="text" 
                           value={formData.range52Week}
                           onChange={(e) => setFormData({...formData, range52Week: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Low - High"
                         />
                      </div>

                      {/* New Financial Metrics - Column 2 Mixed */}
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">P/E Ratio</label>
                         <input 
                           type="text" 
                           value={formData.peRatio}
                           onChange={(e) => setFormData({...formData, peRatio: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Price / Earnings"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Dividend</label>
                         <input 
                           type="text" 
                           value={formData.dividend}
                           onChange={(e) => setFormData({...formData, dividend: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Yield / Amount"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Base Case Intrinsic Value</label>
                         <input 
                           type="text" 
                           value={formData.intrinsicValue}
                           onChange={(e) => setFormData({...formData, intrinsicValue: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Estimated Value"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Analyst Target Price</label>
                         <input 
                           type="text" 
                           value={formData.analystTargetPrice}
                           onChange={(e) => setFormData({...formData, analystTargetPrice: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Consensus Target"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Long Term Debt / Equity</label>
                         <input 
                           type="text" 
                           value={formData.debtToEquity}
                           onChange={(e) => setFormData({...formData, debtToEquity: e.target.value})}
                           className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                           placeholder="Ratio"
                         />
                      </div>

                      {/* Management Performance */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Management Performance</label>
                         <div className="grid grid-cols-3 gap-4 bg-[#0f172a] p-4 rounded-lg border border-slate-600">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">ROIC</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none text-white font-medium" 
                                  placeholder="%"
                                  value={formData.management?.roic}
                                  onChange={(e) => updateManagement('roic', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">ROA</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none text-white font-medium" 
                                  placeholder="%"
                                  value={formData.management?.roa}
                                  onChange={(e) => updateManagement('roa', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">ROE</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 focus:outline-none text-white font-medium" 
                                  placeholder="%"
                                  value={formData.management?.roe}
                                  onChange={(e) => updateManagement('roe', e.target.value)}
                                />
                            </div>
                         </div>
                      </div>

                      {/* Growth Table */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Growth Trends Analysis</label>
                         <div className="bg-[#0f172a] border border-slate-600 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                               <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                  <tr>
                                     <th className="px-4 py-2">Metric</th>
                                     <th className="px-4 py-2">Value</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-700">
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Current Qtr</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.currentQtr} onChange={(e) => updateGrowth('currentQtr', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Next Qtr</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.nextQtr} onChange={(e) => updateGrowth('nextQtr', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Current Year</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.currentYear} onChange={(e) => updateGrowth('currentYear', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Next Year</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.nextYear} onChange={(e) => updateGrowth('nextYear', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Next 5 Years</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.next5Years} onChange={(e) => updateGrowth('next5Years', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium">Past 5 Years</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-indigo-400" placeholder="%" value={formData.growth?.past5Years} onChange={(e) => updateGrowth('past5Years', e.target.value)} /></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2 font-medium text-slate-400">Industry Average</td>
                                     <td className="p-1"><input type="text" className="w-full bg-transparent p-1 focus:outline-none text-slate-400" placeholder="%" value={formData.growth?.industryAvg} onChange={(e) => updateGrowth('industryAvg', e.target.value)} /></td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>

                      {/* Student Comments */}
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Student Analysis / Comments</label>
                         <textarea 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full h-24 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Your thoughts on the direction of this stock..."
                         />
                      </div>
                      
                      <div className="md:col-span-2">
                         <button 
                           onClick={handleSaveStock}
                           disabled={!formData.symbol}
                           className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                         >
                            Save to Watchlist
                         </button>
                      </div>
                   </div>
                </div>
             )}

             {/* WATCHLIST GRID */}
             {watchlist.length === 0 ? (
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700 border-dashed p-12 text-center">
                   <p className="text-slate-500">Your watchlist is empty. Add a stock to begin your fundamental analysis.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {watchlist.map(stock => (
                      <div key={stock.id} className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 hover:border-indigo-500/50 transition-all shadow-lg group relative">
                         <button 
                           onClick={() => handleDelete(stock.id)}
                           className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                           title="Remove"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                         </button>

                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <h3 className="text-2xl font-bold text-white">{stock.symbol}</h3>
                               <p className="text-sm text-slate-400">{stock.name}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-xs text-slate-500 uppercase">Valuation</p>
                               <p className="text-sm font-medium text-slate-300">P/E: {stock.peRatio || 'N/A'}</p>
                            </div>
                         </div>
                         
                         <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{stock.overview}</p>

                         <div className="grid grid-cols-2 gap-4 text-sm bg-[#0f172a] p-3 rounded-lg mb-4">
                            <div>
                               <span className="block text-xs text-slate-500">Earnings</span>
                               <span className="font-semibold text-indigo-400">{stock.earningsDate}</span>
                            </div>
                            <div>
                               <span className="block text-xs text-slate-500">Intrinsic Val</span>
                               <span className="font-semibold text-white">{stock.intrinsicValue || 'N/A'}</span>
                            </div>
                            <div>
                               <span className="block text-xs text-slate-500">Debt/Eq</span>
                               <span className="font-semibold text-white">{stock.debtToEquity || 'N/A'}</span>
                            </div>
                            <div>
                               <span className="block text-xs text-slate-500">Div Yield</span>
                               <span className="font-semibold text-green-400">{stock.dividend || 'N/A'}</span>
                            </div>
                         </div>
                         
                         {stock.notes && (
                            <div className="mt-2 pt-2 border-t border-slate-700/50">
                               <p className="text-xs text-slate-500 italic">"{stock.notes}"</p>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             )}
           </>
         ) : (
           <div className="bg-[#1e293b] rounded-2xl border border-slate-700 border-dashed p-12 text-center">
              <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚧</div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-slate-400">Tools for Step {activeStep} are currently being built.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default RoutineBuilder;
