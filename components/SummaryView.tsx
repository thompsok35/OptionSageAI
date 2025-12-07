
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface SummaryViewProps {
  content: string;
  isLoading: boolean;
  loadingMessage?: string; // New prop for custom status
  onClose: () => void;
  onSave: (instructor: string, notes: string) => void;
  isSaved: boolean;
  initialInstructor?: string;
  initialNotes?: string;
  videoUrl?: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ 
  content, 
  isLoading, 
  loadingMessage = "Analyzing training module...", // Default message
  onClose, 
  onSave, 
  isSaved,
  initialInstructor = '',
  initialNotes = '',
  videoUrl
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Metadata State
  const [instructor, setInstructor] = useState(initialInstructor);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    // Cleanup speech on unmount or close
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update local state if props change (e.g. viewing different summary)
  useEffect(() => {
    setInstructor(initialInstructor);
    setNotes(initialNotes);
  }, [initialInstructor, initialNotes]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Strip markdown symbols for better reading
      const cleanText = content
        .replace(/[#*`_]/g, '')
        .replace(/---/g, '')
        .replace(/\n\n/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSaveClick = () => {
    onSave(instructor, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#0f172a] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">AI Study Guide</h2>
                <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoading && content && (
              <button 
                onClick={toggleSpeech}
                className={`p-2 rounded-full transition-all flex items-center gap-2 px-3 text-sm font-medium ${
                  isSpeaking 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
              >
                {isSpeaking ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Read Aloud</span>
                  </>
                )}
              </button>
            )}

            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e293b] p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
              <div className="relative h-20 w-20">
                 <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center px-8">
                <p className="text-indigo-300 font-bold text-lg animate-pulse mb-2">{loadingMessage}</p>
                <p className="text-slate-500 text-sm">Please wait while Gemini processes the material.</p>
              </div>
            </div>
          ) : (
            <>
               {/* Video Source Link */}
               {videoUrl && (
                  <div className="bg-slate-900/50 px-6 py-2 border-b border-slate-700 flex items-center gap-2 text-xs text-slate-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                     </svg>
                     <span className="truncate max-w-2xl font-mono text-blue-300/80">{videoUrl}</span>
                  </div>
               )}

               {/* Session Details Form */}
               <div className="bg-slate-800/50 border-b border-slate-700 p-6">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Session Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Instructor</label>
                      <input 
                        type="text" 
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        placeholder="e.g. Greg Richards"
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Personal Notes / Description</label>
                      <input 
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Discussed the new adjustment rules for bullish reversals..."
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
               </div>

               {/* Markdown Content */}
               <div className="p-8 prose prose-invert prose-slate max-w-none">
                <ReactMarkdown 
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-indigo-400 border-b border-slate-700 pb-2 mt-8 mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                    p: ({node, ...props}) => <p className="leading-relaxed text-slate-300 mb-4" {...props} />
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-[#0f172a] rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
          {!isLoading && (
            <button 
              onClick={handleSaveClick}
              disabled={isSaved}
              className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                isSaved 
                  ? 'bg-green-600/20 text-green-400 cursor-default border border-green-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50'
              }`}
            >
              {isSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Updates Saved
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Summary
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
