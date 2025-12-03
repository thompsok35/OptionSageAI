import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import CourseList from './components/CourseList';
import SummaryView from './components/SummaryView';
import Profile from './components/Profile';
import GraduationProject from './components/GraduationProject';
import { COURSES } from './data/mockData';
import { generateSummary } from './services/geminiService';
import { AppView, CourseModule, SavedSummary, UserProfile, TradingPlan } from './types';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Due Diligence',
  2: 'Options Instruments',
  3: 'Credit Spreads',
  4: 'Debit Spreads',
  5: 'Hedged Trades',
  6: 'Trade Application',
  7: 'Trade Adjustments',
  8: 'Advanced Application'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null);
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [savedPlans, setSavedPlans] = useState<TradingPlan[]>([]);
  const [isSummarySaved, setIsSummarySaved] = useState<boolean>(false);
  
  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load saved data from local storage on mount
  useEffect(() => {
    const savedSumms = localStorage.getItem('optionsAI_summaries');
    if (savedSumms) setSavedSummaries(JSON.parse(savedSumms));
    
    const savedProjs = localStorage.getItem('optionsAI_plans');
    if (savedProjs) setSavedPlans(JSON.parse(savedProjs));
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setCurrentView(AppView.DASHBOARD);
  };

  const showCompletionToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const markModuleCompleted = (moduleId: string) => {
    if (user && !user.completedModules.includes(moduleId)) {
      const updatedUser = {
        ...user,
        completedModules: [...user.completedModules, moduleId]
      };
      setUser(updatedUser);
      showCompletionToast('Module Marked Completed! 🎉');
    }
  };

  const handleSelectCourse = async (course: CourseModule) => {
    setSelectedCourse(course);
    setSummaryContent('');
    setIsGenerating(true);
    setShowSummaryModal(true);
    setIsSummarySaved(false);

    // Mark as completed since user is "Watching" it
    markModuleCompleted(course.id);

    // Call Gemini API with Mock Transcript
    const summary = await generateSummary(course.title, course.mockTranscript);
    setSummaryContent(summary);
    setIsGenerating(false);
  };

  const handleAnalyzeFile = async (course: CourseModule, file: File) => {
    setSelectedCourse(course);
    setSummaryContent('');
    setIsGenerating(true);
    setShowSummaryModal(true);
    setIsSummarySaved(false);
    
    // Mark as completed
    markModuleCompleted(course.id);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64Data.split(',')[1];
        const mimeType = file.type;

        // Call Gemini API with File Data
        const summary = await generateSummary(course.title, '', { 
          mimeType, 
          data: base64Content 
        });
        
        setSummaryContent(summary);
        setIsGenerating(false);
      };
      reader.onerror = (error) => {
        console.error("File reading error", error);
        setSummaryContent("## Error\nFailed to read the file. Please try again.");
        setIsGenerating(false);
      }
    } catch (e) {
      console.error(e);
      setSummaryContent("## Error\nAn unexpected error occurred during file upload.");
      setIsGenerating(false);
    }
  };

  const handleSaveSummary = () => {
    if (!selectedCourse || !summaryContent) return;

    // Check if exists to update instead of duplicate
    const existingIndex = savedSummaries.findIndex(s => s.moduleId === selectedCourse.id);
    
    const newSummary: SavedSummary = {
      id: existingIndex >= 0 ? savedSummaries[existingIndex].id : Date.now().toString(),
      moduleId: selectedCourse.id,
      moduleTitle: selectedCourse.title,
      content: summaryContent,
      createdAt: Date.now(),
      tags: [selectedCourse.category, `Level ${selectedCourse.level}`]
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...savedSummaries];
      updated[existingIndex] = newSummary;
    } else {
      updated = [newSummary, ...savedSummaries];
    }

    setSavedSummaries(updated);
    localStorage.setItem('optionsAI_summaries', JSON.stringify(updated));
    setIsSummarySaved(true);
  };

  const handleViewSavedSummary = (summary: SavedSummary) => {
    // Find the course context
    const course = COURSES.find(c => c.id === summary.moduleId);
    if (course) {
      setSelectedCourse(course);
    }
    
    setSummaryContent(summary.content);
    setShowSummaryModal(true);
    setIsGenerating(false);
    setIsSummarySaved(true);
  };

  const handleSavePlan = (plan: TradingPlan) => {
     const existingIdx = savedPlans.findIndex(p => p.id === plan.id);
     let updatedPlans;
     if (existingIdx >= 0) {
       updatedPlans = [...savedPlans];
       updatedPlans[existingIdx] = plan;
     } else {
       updatedPlans = [plan, ...savedPlans];
     }
     setSavedPlans(updatedPlans);
     localStorage.setItem('optionsAI_plans', JSON.stringify(updatedPlans));
     showCompletionToast('Trading Plan Saved');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  const filteredCourses = COURSES.filter(course => course.level === activeLevel);

  if (currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-300">
           <div className="bg-[#8cc63f] text-[#0f172a] px-6 py-3 rounded-lg shadow-2xl font-bold flex items-center gap-3">
             <div className="bg-white/20 p-1 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
               </svg>
             </div>
             {toastMessage}
           </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
               </div>
               <span className="text-xl font-bold text-white tracking-tight">OptionSage <span className="text-indigo-400">AI</span></span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
                <button 
                  onClick={() => setCurrentView(AppView.DASHBOARD)}
                  className={`${currentView === AppView.DASHBOARD ? 'text-white' : 'hover:text-white'} transition-colors`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.LIBRARY)}
                  className={`${currentView === AppView.LIBRARY ? 'text-white' : 'hover:text-white'} transition-colors`}
                >
                  Saved Guides
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.GRADUATION)}
                  className={`${currentView === AppView.GRADUATION ? 'text-[#8cc63f] font-bold' : 'hover:text-[#8cc63f]'} transition-colors`}
                >
                  Graduation Project
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.PROFILE)}
                  className={`${currentView === AppView.PROFILE ? 'text-white' : 'hover:text-white'} transition-colors`}
                >
                  Profile
                </button>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="text-sm font-semibold text-white">{user?.friendlyName || user?.username}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === AppView.PROFILE && user && (
           <Profile 
             user={user} 
             onUpdateUser={setUser} 
             levelTitles={LEVEL_TITLES} 
           />
        )}

        {currentView === AppView.GRADUATION && (
           <GraduationProject 
             savedPlans={savedPlans}
             onSavePlan={handleSavePlan}
           />
        )}
        
        {currentView === AppView.DASHBOARD && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-8 border border-blue-800/50 relative overflow-hidden">
               <div className="relative z-10">
                 <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.friendlyName}</h1>
                 <p className="text-blue-200 max-w-2xl">
                   Your education portal is synced. Select a level to view your curriculum.
                 </p>
               </div>
               <div className="absolute right-0 top-0 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            {/* Level Navigation */}
            <div>
              <div className="flex overflow-x-auto pb-6 gap-3 no-scrollbar mb-2 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`whitespace-nowrap px-4 py-3 rounded-xl transition-all border flex flex-col items-start justify-center min-w-[170px] ${
                      activeLevel === level
                        ? 'bg-[#8cc63f] text-[#0f172a] border-[#8cc63f] shadow-lg shadow-lime-900/40 transform scale-105 z-10 ring-1 ring-[#8cc63f]'
                        : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                     <span className={`text-xs uppercase tracking-wider font-bold mb-0.5 ${activeLevel === level ? 'opacity-70' : 'text-slate-500'}`}>
                        Level {level}
                     </span>
                     <span className="font-bold text-sm">
                        {LEVEL_TITLES[level]}
                     </span>
                  </button>
                ))}
              </div>

              {/* Level Header */}
              <div className="mb-6 pb-4 border-b border-slate-700">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#8cc63f]/20 text-[#8cc63f] px-2 py-0.5 rounded text-xs font-bold border border-[#8cc63f]/30">
                      LEVEL {activeLevel}
                    </span>
                    <h2 className="text-2xl font-bold text-white">{LEVEL_TITLES[activeLevel]}</h2>
                 </div>
              </div>
              
              {/* Courses Grid */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200">
                  {filteredCourses.length} Modules Available
                </h3>
              </div>
              
              {filteredCourses.length > 0 ? (
                <CourseList 
                  courses={filteredCourses} 
                  savedSummaries={savedSummaries}
                  onSelectCourse={handleSelectCourse} 
                  onAnalyzeFile={handleAnalyzeFile}
                  onViewSummary={handleViewSavedSummary}
                />
              ) : (
                <div className="text-center py-16 bg-[#1e293b] rounded-xl border border-slate-700 border-dashed">
                  <p className="text-slate-500">No modules loaded for this level in the demo.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === AppView.LIBRARY && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-white">My Saved Study Guides</h2>
              {savedSummaries.length === 0 ? (
                <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-slate-700 border-dashed">
                  <div className="inline-flex h-16 w-16 bg-slate-800 rounded-full items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">No summaries saved yet.</p>
                  <p className="text-slate-500 text-sm mt-2">Go to the Dashboard to analyze a video or PDF.</p>
                  <button 
                    onClick={() => setCurrentView(AppView.DASHBOARD)}
                    className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedSummaries.map(summary => (
                    <div key={summary.id} className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                           <h3 className="text-lg font-bold text-white mb-1">{summary.moduleTitle}</h3>
                           <div className="flex gap-2">
                            {summary.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                {tag}
                              </span>
                            ))}
                           </div>
                        </div>
                      </div>
                      <div className="prose prose-invert prose-sm line-clamp-4 mb-4 text-slate-400">
                         {summary.content.replace(/#/g, '')}
                      </div>
                      <button 
                        onClick={() => {
                          handleViewSavedSummary(summary);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                      >
                        Read Full Guide
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            OptionSage AI Companion Demo. 
            <br/>
            This application is a demonstration using mock data and simulated connections to third-party services.
            <br/>
            Real-time AI analysis provided by Google Gemini 2.5 Flash.
          </p>
        </div>
      </footer>

      {/* Summary Modal */}
      {showSummaryModal && (
        <SummaryView 
          content={summaryContent} 
          isLoading={isGenerating} 
          onClose={() => setShowSummaryModal(false)}
          onSave={handleSaveSummary}
          isSaved={isSummarySaved}
        />
      )}
    </div>
  );
};

export default App;