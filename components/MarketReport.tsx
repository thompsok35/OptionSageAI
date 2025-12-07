
import React, { useState } from 'react';
import { CourseModule } from '../types';

interface MarketReportProps {
  onWatch: (module: CourseModule) => void;
}

const MarketReport: React.FC<MarketReportProps> = ({ onWatch }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Helper to get dates for a specific week offset (Mon-Fri)
  const getWeekDates = (offset: number) => {
    const curr = new Date();
    // Adjust current date by weeks offset
    curr.setDate(curr.getDate() + (offset * 7));
    
    const week = [];
    // Starting Monday
    // If today is Sunday (0), we need to go back 6 days to get previous Monday, not just 1.
    // If today is Monday (1), we go back 0.
    const currentDay = curr.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(curr.setDate(curr.getDate() + distanceToMonday));
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(weekOffset);

  // Mock data generator for daily summaries
  const getDailyBrief = (date: Date) => {
    const day = date.getDay();
    const isFuture = date > new Date();
    
    if (isFuture) return "Market data not yet available.";

    // Deterministic mock data based on date to keep it consistent
    const seed = date.getDate() + date.getMonth();
    
    const topics = [
      "CPI inflation data came in hotter than expected, causing a morning sell-off.",
      "Tech sector rally led by semiconductor earnings surprises.",
      "Fed minutes released: Powell hints at 'higher for longer' rate policy.",
      "Oil prices surged past $85/barrel, impacting transportation stocks.",
      "Quiet trading day with low volume ahead of Friday's jobs report.",
      "Consumer confidence index hits a 6-month high, boosting retail.",
      "Banking sector under pressure as treasury yields invert further.",
      "VIX drops below 13 as markets consolidate near all-time highs."
    ];

    return topics[seed % topics.length];
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const brief = getDailyBrief(date);
    
    // Construct a temporary CourseModule object to fit the existing "Watch" architecture
    const marketModule: CourseModule = {
      id: `market-${date.toISOString().split('T')[0]}`,
      title: `Market Update - ${dateStr}`,
      category: 'Market Report',
      level: 0, // 0 for General/Market
      duration: 'Live',
      thumbnail: `https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60`,
      description: `Daily market briefing for ${dateStr}. ${brief}`,
      mockTranscript: ''
    };

    onWatch(marketModule);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Market Report</h1>
        <p className="text-slate-400">Daily briefings on market direction, economic events, and volatility.</p>
      </div>

      {/* Market Ticker / High Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">S&P 500</span>
              <span className="text-green-400 text-xs font-bold">+0.45%</span>
           </div>
           <div className="text-2xl font-bold text-white">SPX</div>
           <div className="h-10 mt-2 flex items-end gap-1">
              {[40, 45, 30, 50, 60, 55, 70].map((h, i) => (
                 <div key={i} className="flex-1 bg-green-500/20 rounded-sm" style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Nasdaq 100</span>
              <span className="text-green-400 text-xs font-bold">+0.82%</span>
           </div>
           <div className="text-2xl font-bold text-white">NDX</div>
           <div className="h-10 mt-2 flex items-end gap-1">
              {[30, 40, 35, 55, 65, 70, 80].map((h, i) => (
                 <div key={i} className="flex-1 bg-green-500/20 rounded-sm" style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Russell 2000</span>
              <span className="text-red-400 text-xs font-bold">-0.21%</span>
           </div>
           <div className="text-2xl font-bold text-white">RUT</div>
           <div className="h-10 mt-2 flex items-end gap-1">
              {[60, 50, 55, 40, 35, 45, 40].map((h, i) => (
                 <div key={i} className="flex-1 bg-red-500/20 rounded-sm" style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </div>

        <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/> 
              </svg>
           </div>
           <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Bitcoin</span>
              <span className="text-green-400 text-xs font-bold">+1.2%</span>
           </div>
           <div className="text-2xl font-bold text-white">BTC</div>
           <div className="h-10 mt-2 flex items-end gap-1">
              {[50, 55, 60, 65, 55, 70, 85].map((h, i) => (
                 <div key={i} className="flex-1 bg-orange-500/20 rounded-sm" style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </div>
      </div>

      {/* Week Navigation Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-2">
         <h2 className="text-xl font-bold text-white">Weekly Briefings</h2>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Previous Week"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
               </svg>
            </button>
            <span className="text-sm font-bold text-white min-w-[120px] text-center">
               {weekOffset === 0 ? 'Current Week' : weekOffset === -1 ? 'Last Week' : `${Math.abs(weekOffset)} Weeks Ago`}
            </span>
            <button 
              onClick={() => setWeekOffset(weekOffset + 1)}
              disabled={weekOffset >= 0}
              className={`p-2 rounded-lg transition-colors ${
                 weekOffset >= 0 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Next Week"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
               </svg>
            </button>
         </div>
      </div>

      {/* Daily Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {weekDates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isFuture = date > new Date();
          const summary = getDailyBrief(date);
          
          return (
            <div 
              key={index} 
              className={`bg-[#1e293b] rounded-xl overflow-hidden border transition-all flex flex-col h-full ${
                isTodayDate ? 'border-[#8cc63f] shadow-lg shadow-[#8cc63f]/10' : 'border-slate-700'
              } ${isFuture ? 'opacity-50 grayscale' : 'hover:border-slate-500'}`}
            >
              <div className="h-32 bg-slate-800 relative shrink-0">
                 <img 
                   src={`https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&auto=format&fit=crop&q=60&rand=${date.getTime()}`} 
                   alt="Market" 
                   className="w-full h-full object-cover opacity-50"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-3xl font-black text-white/40 tracking-widest uppercase">
                       {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                 </div>
                 {isTodayDate && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                       LIVE
                    </div>
                 )}
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                 <div className="mb-3">
                    <h3 className="text-white font-bold">{date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                    <p className="text-slate-400 text-xs mb-3">{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    
                    {/* Daily Brief Summary */}
                    {!isFuture && (
                       <div className="bg-[#0f172a]/50 p-2 rounded border border-slate-700/50 min-h-[60px]">
                          <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                             {summary}
                          </p>
                       </div>
                    )}
                 </div>
                 
                 <div className="mt-auto pt-2">
                    {isFuture ? (
                       <button disabled className="w-full py-2 bg-slate-800 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                          Upcoming
                       </button>
                    ) : (
                       <button 
                         onClick={() => handleDayClick(date)}
                         className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                            isTodayDate 
                              ? 'bg-[#8cc63f] hover:bg-[#7ab332] text-slate-900' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                         }`}
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {isTodayDate ? 'Watch Live' : 'Watch Replay'}
                       </button>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketReport;
