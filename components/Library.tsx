
import React from 'react';
import { SavedSummary, CourseModule } from '../types';
import { COURSES } from '../data/mockData';

interface LibraryProps {
  savedSummaries: SavedSummary[];
  onViewSummary: (summary: SavedSummary) => void;
  levelTitles: Record<number, string>;
}

const Library: React.FC<LibraryProps> = ({ savedSummaries, onViewSummary, levelTitles }) => {
  
  // Group summaries by level
  const summariesByLevel: Record<number, SavedSummary[]> = {};
  
  // Helper to find course details
  const getCourse = (moduleId: string): CourseModule | undefined => {
    return COURSES.find(c => c.id === moduleId);
  };

  savedSummaries.forEach(summary => {
    let course = getCourse(summary.moduleId);
    
    // Handle Market Reports or other dynamic content not in mockData
    if (!course) {
       // If it looks like a market report or has level info in tags
       if (summary.moduleId.startsWith('market-') || (summary.tags && summary.tags.some(t => t.includes('Market')))) {
          course = {
             id: summary.moduleId,
             title: summary.moduleTitle,
             category: 'Market Report',
             level: 0,
             duration: 'Recorded',
             thumbnail: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&auto=format&fit=crop&q=60', // Generic Market Thumb
             description: 'Daily Market Update',
             mockTranscript: ''
          };
       }
    }

    if (course) {
      if (!summariesByLevel[course.level]) {
        summariesByLevel[course.level] = [];
      }
      summariesByLevel[course.level].push(summary);
    }
  });

  // Sort levels
  const levels = Object.keys(summariesByLevel).map(Number).sort((a, b) => a - b);

  if (savedSummaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Library is Empty</h2>
          <p className="text-slate-400 max-w-md">
            Start by watching training videos or analyzing slides in the Education Center. Your AI-generated summaries will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
        <p className="text-slate-400">Your collection of AI-generated study guides, organized by curriculum level.</p>
      </div>

      <div className="space-y-12">
        {levels.map(level => (
          <div key={level} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
              <span className="bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded text-sm font-bold">
                 {level === 0 ? 'Market Updates' : `Level ${level}`}
              </span>
              <h2 className="text-xl font-bold text-white">{levelTitles[level] || 'General'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summariesByLevel[level].map(summary => {
                const course = getCourse(summary.moduleId);
                return (
                  <div 
                    key={summary.id}
                    onClick={() => onViewSummary(summary)}
                    className="group bg-[#1e293b] rounded-xl border border-slate-700 hover:border-indigo-500/50 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{summary.tags?.[0] || 'General'}</span>
                        <span className="text-xs text-slate-500">{new Date(summary.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {summary.moduleTitle}
                      </h3>
                      
                      {summary.instructor && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{summary.instructor}</span>
                        </div>
                      )}

                      {summary.notes && (
                        <p className="text-sm text-slate-400 line-clamp-3 italic mb-4 bg-[#0f172a]/50 p-3 rounded-lg border border-slate-700/50">
                          "{summary.notes}"
                        </p>
                      )}
                    </div>

                    <div className="bg-[#0f172a]/50 p-3 border-t border-slate-700 flex justify-between items-center group-hover:bg-indigo-900/10 transition-colors">
                       <span className="text-xs text-slate-500 font-mono">
                         {summary.videoUrl ? 'Video Analysis' : 'Slide Analysis'}
                       </span>
                       <span className="text-indigo-400 text-sm font-bold flex items-center gap-1">
                         Open Guide
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                         </svg>
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
