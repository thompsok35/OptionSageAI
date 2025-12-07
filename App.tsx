
import React, { useState, useEffect, useRef } from 'react';
import { 
  AppView, 
  UserProfile, 
  CourseModule, 
  SavedSummary, 
  TradingPlan 
} from './types';
import { COURSES } from './data/mockData';
import { generateSummary } from './services/geminiService';
import { storageService } from './services/storageService';

import Login from './components/Login';
import LandingPage from './components/LandingPage';
import CourseList from './components/CourseList';
import SummaryView from './components/SummaryView';
import Profile from './components/Profile';
import GraduationProject from './components/GraduationProject';
import RoutineBuilder from './components/RoutineBuilder';
import Library from './components/Library';
import MarketReport from './components/MarketReport';

const LEVEL_TITLES: Record<number, string> = {
  0: 'Daily Market Updates',
  1: 'Due Diligence',
  2: 'Options Instruments',
  3: 'Credit Spreads',
  4: 'Debit Spreads',
  5: 'Hedged Trades',
  6: 'Trade Application',
  7: 'Trade Adjustments',
  8: 'Advanced Application'
};

// Analysis Modal Tabs
type AnalysisTab = 'LINK' | 'TRANSCRIPT' | 'UPLOAD' | 'CAPTURE';

function App() {
  // State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null);
  
  // Summary & AI State
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummaryId, setCurrentSummaryId] = useState<string>('');
  const [summaryVideoUrl, setSummaryVideoUrl] = useState<string | undefined>(undefined);
  const [summaryInstructor, setSummaryInstructor] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // Analyze Modal State
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<AnalysisTab>('LINK');
  const [inputLink, setInputLink] = useState('');
  const [inputTranscript, setInputTranscript] = useState('');
  const [browserUrl, setBrowserUrl] = useState('https://members.optionsanimal.com/member/edu/archives');

  // Live Capture State
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStream, setCaptureStream] = useState<MediaStream | null>(null);
  const [isInitializingCapture, setIsInitializingCapture] = useState(false);
  const [showCaptureComplete, setShowCaptureComplete] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Data State
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [savedPlans, setSavedPlans] = useState<TradingPlan[]>([]);

  // Init
  useEffect(() => {
    const loadedUser = storageService.getUserProfile();
    if (loadedUser) {
      setUser(loadedUser);
      // If user is logged in, default to Dashboard unless they were on Landing
      if (currentView === AppView.LANDING) {
        setCurrentView(AppView.DASHBOARD);
      }
    }
    
    setSavedSummaries(storageService.getSummaries());
    setSavedPlans(storageService.getPlans());
  }, []);

  // Update video preview when stream changes
  useEffect(() => {
    if (videoRef.current && captureStream) {
      videoRef.current.srcObject = captureStream;
    }
  }, [captureStream, showAnalyzeModal]);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    storageService.saveUserProfile(loggedInUser);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LANDING);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    storageService.saveUserProfile(updatedUser);
  };

  // --- VOICE FEEDBACK ---
  const speakStatus = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // --- SCREEN CAPTURE LOGIC ---

  const startScreenCapture = async () => {
    try {
      setIsInitializingCapture(true);
      speakStatus("A system dialog will open. Please select the Options Animal window and click Share.");

      // Request display media
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // Crucial for capturing the video sound
      });

      setCaptureStream(stream);
      setIsInitializingCapture(false);
      
      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = []; // Reset chunks

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setCaptureStream(null);
        setIsCapturing(false);
        speakStatus("Recording complete.");
        setShowCaptureComplete(true);
      };

      mediaRecorder.start();
      setIsCapturing(true);
      speakStatus("Recording started. Play the video now.");

      // Handle user clicking "Stop Sharing" from browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenCapture();
      };

    } catch (err) {
      console.error("Error starting screen capture:", err);
      setIsInitializingCapture(false);
      alert("Could not start screen capture. Please ensure you grant permission.");
    }
  };

  const stopScreenCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const processCapturedVideo = async () => {
    if (!selectedCourse) return;
    
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(',')[1];
      
      setShowAnalyzeModal(false);
      setShowCaptureComplete(false);
      
      await handleStartAnalysis(
        selectedCourse.title, 
        '', 
        { mimeType: 'video/webm', data: base64data },
        'Captured Video'
      );
    };
  };

  // --- ANALYSIS HANDLERS ---

  const handleWatchVideo = async (course: CourseModule) => {
     // Always Open Analysis Hub regardless of existing summary
     setSelectedCourse(course);
     setShowAnalyzeModal(true);
     setActiveAnalysisTab('LINK');
     setShowCaptureComplete(false);
     setCaptureStream(null);
  };

  const handleStartAnalysis = async (
    title: string, 
    context: string, 
    fileData?: { mimeType: string, data: string },
    sourceInfo?: string
  ) => {
    setSummaryContent('');
    setShowSummaryModal(true);
    setIsGeneratingSummary(true);
    
    // Set feedback message based on input
    if (fileData?.mimeType.startsWith('video')) {
       setLoadingMessage("Processing video content: Analyzing charts, audio, and on-screen text...");
    } else if (fileData?.mimeType.startsWith('audio')) {
       setLoadingMessage("Transcribing instructor audio...");
    } else {
       setLoadingMessage("Analyzing content...");
    }

    setSummaryVideoUrl(sourceInfo);
    setSummaryInstructor('');
    setSummaryNotes('');
    setCurrentSummaryId(''); 

    try {
      const summary = await generateSummary(title, context, fileData);
      setSummaryContent(summary);
      
      // Update completion progress (Video Analysis component)
      updateModuleProgress('VIDEO');

    } catch (error) {
      setSummaryContent("Error generating summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const updateModuleProgress = (type: 'SLIDES' | 'VIDEO') => {
    if (!user || !selectedCourse) return;

    const currentProgress = user.moduleProgress?.[selectedCourse.id] || { slides: false, video: false };
    
    // If we are doing VIDEO and SLIDES is already done (or vice versa), mark complete
    const willBeComplete = 
      (type === 'VIDEO' && currentProgress.slides) ||
      (type === 'SLIDES' && currentProgress.video);

    const updatedUser = {
      ...user,
      moduleProgress: {
        ...user.moduleProgress,
        [selectedCourse.id]: {
          ...currentProgress,
          [type.toLowerCase()]: true
        }
      }
    };

    // If both done, add to completedModules
    if (willBeComplete && !user.completedModules.includes(selectedCourse.id)) {
      updatedUser.completedModules = [...user.completedModules, selectedCourse.id];
      // Show Completion Toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-[#8cc63f] text-slate-900 px-6 py-4 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-500 z-50 flex items-center gap-3';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p>Module Complete!</p>
          <p class="text-xs opacity-80 font-normal">Great job finishing ${selectedCourse.title}</p>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    } else if (type === 'SLIDES' && !currentProgress.video) {
       // Feedback for partial
       alert("Slides checked! Analyze the video content to complete this module.");
    }

    handleUpdateUser(updatedUser);
  };

  // --- SLIDE ANALYSIS (Direct from CourseList) ---
  const handleAnalyzeFileDirectly = async (course: CourseModule, file: File) => {
    setSelectedCourse(course);
    
    // Read file as Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      const mimeType = file.type;
      
      // Trigger Analysis
      await handleStartAnalysis(course.title, '', { mimeType, data: base64Data });
      
      // Update completion progress (Slides component)
      updateModuleProgress('SLIDES');
    };
  };

  const handleViewSummary = (summary: SavedSummary) => {
    const course = COURSES.find(c => c.id === summary.moduleId);
    // If not found in static COURSES (e.g. daily market update), create a dummy course object
    const moduleToView = course || {
      id: summary.moduleId,
      title: summary.moduleTitle,
      category: summary.tags[0],
      level: 0,
      duration: 'N/A',
      thumbnail: '',
      description: '',
      mockTranscript: ''
    };

    setSelectedCourse(moduleToView);
    setSummaryContent(summary.content);
    setCurrentSummaryId(summary.id);
    setSummaryInstructor(summary.instructor || '');
    setSummaryNotes(summary.notes || '');
    setSummaryVideoUrl(summary.videoUrl);
    setShowSummaryModal(true);
    setIsGeneratingSummary(false);
  };

  const handleSaveSummary = (instructor: string, notes: string) => {
    if (!selectedCourse || !summaryContent) return;

    const newSummary: SavedSummary = {
      id: currentSummaryId || Date.now().toString(),
      moduleId: selectedCourse.id,
      moduleTitle: selectedCourse.title,
      content: summaryContent,
      createdAt: Date.now(),
      tags: [selectedCourse.category, `Level ${selectedCourse.level}`],
      instructor,
      notes,
      videoUrl: summaryVideoUrl
    };

    const updated = storageService.saveSummary(newSummary);
    setSavedSummaries(updated);
    setCurrentSummaryId(newSummary.id);
    setSummaryInstructor(instructor);
    setSummaryNotes(notes);
  };

  const handleSavePlan = (plan: TradingPlan) => {
    const updated = storageService.savePlan(plan);
    setSavedPlans(updated);
  };

  // --- RENDER ---

  if (currentView === AppView.LANDING) {
    return <LandingPage onGetStarted={() => setCurrentView(AppView.LOGIN)} />;
  }

  if (currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">OptionSage <span className="text-indigo-400">AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: AppView.DASHBOARD, label: 'Education Center' },
                { id: AppView.MARKET_REPORT, label: 'Market Report' },
                { id: AppView.LIBRARY, label: 'My Library' },
                { id: AppView.ROUTINE, label: '6-Step Routine' },
                { id: AppView.GRADUATION, label: 'Graduation' },
                { id: AppView.PROFILE, label: 'Profile' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.id 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white">{user?.friendlyName}</p>
                <p className="text-xs text-slate-500">{user?.memberLevel}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === AppView.DASHBOARD && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-white mb-2">Education Center</h1>
                   <p className="text-slate-400">Access your OptionsAnimal curriculum and AI-powered study tools.</p>
                </div>
             </div>

             {/* Level Sections */}
             {[1, 2, 3, 4, 5, 6, 7, 8].map(level => {
                const levelCourses = COURSES.filter(c => c.level === level);
                if (levelCourses.length === 0) return null;

                return (
                  <div key={level} className="space-y-4">
                     <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-bold">Level {level}</span>
                        <h2 className="text-xl font-bold text-indigo-400">{LEVEL_TITLES[level]}</h2>
                     </div>
                     <CourseList 
                       courses={levelCourses}
                       savedSummaries={savedSummaries}
                       onSelectCourse={handleWatchVideo}
                       onAnalyzeFile={handleAnalyzeFileDirectly}
                       onViewSummary={handleViewSummary}
                     />
                  </div>
                );
             })}
          </div>
        )}

        {currentView === AppView.LIBRARY && (
           <Library 
             savedSummaries={savedSummaries}
             onViewSummary={handleViewSummary}
             levelTitles={LEVEL_TITLES}
           />
        )}

        {currentView === AppView.MARKET_REPORT && (
           <MarketReport onWatch={handleWatchVideo} />
        )}

        {currentView === AppView.GRADUATION && (
           <GraduationProject 
             savedPlans={savedPlans}
             onSavePlan={handleSavePlan}
           />
        )}

        {currentView === AppView.ROUTINE && user && (
           <RoutineBuilder user={user} />
        )}

        {currentView === AppView.PROFILE && user && (
           <Profile 
             user={user} 
             onUpdateUser={handleUpdateUser}
             levelTitles={LEVEL_TITLES}
           />
        )}

      </main>

      {/* ANALYZE CONTENT MODAL */}
      {showAnalyzeModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-700 overflow-hidden">
             
             {/* Modal Header */}
             <div className="p-4 bg-[#0f172a] border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="text-indigo-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                   </div>
                   <h2 className="font-bold text-white">Analyze Content</h2>
                </div>
                <button onClick={() => { setShowAnalyzeModal(false); stopScreenCapture(); }} className="text-slate-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             </div>

             {/* Tab Navigation */}
             <div className="flex bg-slate-800 border-b border-slate-700">
                {(['LINK', 'TRANSCRIPT', 'UPLOAD', 'CAPTURE'] as const).map(tab => (
                   <button
                     key={tab}
                     onClick={() => { setActiveAnalysisTab(tab); stopScreenCapture(); }}
                     className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
                        activeAnalysisTab === tab 
                          ? 'border-indigo-500 text-indigo-400 bg-slate-800' 
                          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                     }`}
                   >
                      {tab === 'CAPTURE' && <span className="mr-2 text-red-500">●</span>}
                      {tab.replace('_', ' ')}
                   </button>
                ))}
             </div>

             {/* Tab Content */}
             <div className="p-8 flex-1 overflow-y-auto bg-[#1e293b]">
                
                {activeAnalysisTab === 'LINK' && (
                   <div className="space-y-6">
                      <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30">
                         <h3 className="text-white font-bold mb-1">Analyze External Video</h3>
                         <p className="text-sm text-slate-400">Paste a link to a video. Note: AI can only access public links. For protected content, use the <strong>LIVE CAPTURE</strong> tab.</p>
                      </div>
                      <input 
                        type="text" 
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        placeholder="https://vimeo.com/..."
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button 
                        onClick={() => { setShowAnalyzeModal(false); handleStartAnalysis(selectedCourse.title, '', undefined, inputLink); }}
                        disabled={!inputLink}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
                      >
                         Generate Summary
                      </button>
                   </div>
                )}

                {activeAnalysisTab === 'TRANSCRIPT' && (
                   <div className="space-y-6 h-full flex flex-col">
                      <p className="text-sm text-slate-400">Paste the text transcript or closed captions from the video player.</p>
                      <textarea 
                        value={inputTranscript}
                        onChange={(e) => setInputTranscript(e.target.value)}
                        placeholder="Paste transcript text here..."
                        className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 min-h-[300px]"
                      />
                      <button 
                         onClick={() => { setShowAnalyzeModal(false); handleStartAnalysis(selectedCourse.title, inputTranscript); }}
                         disabled={!inputTranscript}
                         className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
                      >
                         Analyze Text
                      </button>
                   </div>
                )}

                {activeAnalysisTab === 'UPLOAD' && (
                   <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-600 rounded-xl bg-[#0f172a]/50">
                      <input 
                        type="file" 
                        id="video-upload" 
                        className="hidden" 
                        accept="video/*,audio/*"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if(file) {
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => {
                                 const base64 = (reader.result as string).split(',')[1];
                                 setShowAnalyzeModal(false);
                                 handleStartAnalysis(selectedCourse.title, '', { mimeType: file.type, data: base64 }, file.name);
                              }
                           }
                        }}
                      />
                      <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center text-center p-12">
                         <div className="h-16 w-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                         </div>
                         <span className="text-xl font-bold text-white">Upload Video or Audio</span>
                         <span className="text-sm text-slate-500 mt-2">MP4, WEBM, MP3 (Max 200MB)</span>
                      </label>
                   </div>
                )}

                {activeAnalysisTab === 'CAPTURE' && (
                   <div className="flex flex-col h-full">
                      {/* Workflow Bar */}
                      <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700 flex items-center gap-2 mb-4">
                         <div className="flex-1 flex bg-[#1e293b] rounded border border-slate-600 items-center px-3">
                           <span className="text-slate-500 text-xs font-bold mr-2">BROWSER:</span>
                           <input 
                             type="text" 
                             value={browserUrl} 
                             onChange={(e) => setBrowserUrl(e.target.value)}
                             className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none py-2"
                           />
                         </div>
                         <button 
                           onClick={() => window.open(browserUrl, '_blank', 'width=1200,height=800')}
                           className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold flex items-center gap-1"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                           </svg>
                           Pop Out
                         </button>
                      </div>

                      <div className="relative flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-700 group">
                         {/* Video Preview */}
                         <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-contain bg-black z-0"></video>
                         
                         {/* Instruction Overlay (Only visible if not capturing and not finished) */}
                         {!isCapturing && !showCaptureComplete && (
                           <div className="relative z-10 bg-[#1e293b]/95 p-8 rounded-2xl border border-slate-600 max-w-md text-center shadow-2xl">
                              <h3 className="text-xl font-bold text-white mb-4">How to Analyze Protected Video</h3>
                              <div className="space-y-4 text-left">
                                 <div className="flex gap-3">
                                    <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                                    <p className="text-sm text-slate-300">Click <strong>'Pop Out'</strong> above to open the video in a new window.</p>
                                 </div>
                                 <div className="flex gap-3">
                                    <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                                    <p className="text-sm text-slate-300">Start the video in that window.</p>
                                 </div>
                                 <div className="flex gap-3">
                                    <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                                    <p className="text-sm text-slate-300">Click <strong>Open System Recording Dialog</strong> below. Select the Pop-out window and <span className="text-red-400 font-bold">ensure 'Share Audio' is checked</span>.</p>
                                 </div>
                                 <div className="mt-4 p-3 bg-black/40 rounded border border-slate-700">
                                    <p className="text-xs text-slate-400 text-center mb-2">Look for this browser dialog:</p>
                                    <div className="h-16 w-full bg-slate-800 rounded border border-slate-600 flex items-center justify-center relative">
                                       <div className="w-3/4 h-3/4 border border-dashed border-slate-500 rounded flex items-center justify-center text-[10px] text-slate-500">Window Selection</div>
                                       <div className="absolute bottom-1 left-2 w-3 h-3 border border-slate-500 rounded-sm bg-blue-500/20"></div>
                                       <span className="absolute bottom-1 left-6 text-[8px] text-slate-400">Share system audio</span>
                                    </div>
                                 </div>
                              </div>
                              <button 
                                onClick={startScreenCapture}
                                disabled={isInitializingCapture}
                                className="mt-6 w-full py-3 bg-[#8cc63f] hover:bg-[#7ab332] text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                              >
                                {isInitializingCapture ? 'Initializing...' : '● Open System Recording Dialog'}
                              </button>
                              <p className="mt-3 text-xs text-slate-500">
                                 Position windows side-by-side for best results.
                              </p>
                           </div>
                         )}

                         {/* Capture Complete Overlay */}
                         {showCaptureComplete && (
                            <div className="relative z-10 bg-[#1e293b]/95 p-8 rounded-2xl border border-green-500/50 max-w-md text-center shadow-2xl animate-in zoom-in duration-300">
                               <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                               </div>
                               <h3 className="text-2xl font-bold text-white mb-2">Capture Complete!</h3>
                               <p className="text-slate-400 mb-6">Video and audio have been recorded successfully.</p>
                               <button 
                                 onClick={processCapturedVideo}
                                 className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/40 transition-all transform hover:scale-105"
                               >
                                 Analyze Video Now
                               </button>
                               <button 
                                 onClick={() => { setShowCaptureComplete(false); setCaptureStream(null); }}
                                 className="mt-4 text-slate-400 hover:text-white text-sm"
                               >
                                 Discard and Try Again
                               </button>
                            </div>
                         )}
                      </div>

                      {/* Controls */}
                      {isCapturing && (
                         <div className="mt-4 flex items-center justify-between bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                               <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                               <span className="text-red-200 font-mono text-sm">REC ● Capturing Window</span>
                            </div>
                            <button 
                              onClick={stopScreenCapture}
                              className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded shadow-lg"
                            >
                              Stop Recording
                            </button>
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && (
        <SummaryView 
          content={summaryContent}
          isLoading={isGeneratingSummary}
          loadingMessage={loadingMessage}
          onClose={() => setShowSummaryModal(false)}
          onSave={handleSaveSummary}
          isSaved={!!currentSummaryId && savedSummaries.some(s => s.id === currentSummaryId && s.content === summaryContent && s.notes === summaryNotes && s.instructor === summaryInstructor)}
          initialInstructor={summaryInstructor}
          initialNotes={summaryNotes}
          videoUrl={summaryVideoUrl}
        />
      )}
    </div>
  );
}

export default App;
