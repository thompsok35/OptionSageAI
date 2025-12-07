
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-3xl -z-10 opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Graduation Project Wizard
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Master the Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Options Trading</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Your intelligent companion for the OptionsAnimal methodology. Summarize lectures, analyze slides, and build your trading plan with the power of AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-[#8cc63f] hover:bg-[#7ab332] text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-lime-900/20 transition-all transform hover:scale-105"
            >
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg rounded-xl border border-slate-700 transition-all">
              View Curriculum
            </button>
          </div>

          {/* Hero Image / UI Mockup */}
          <div className="mt-16 relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
             <img 
               src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1600&auto=format&fit=crop&q=80" 
               alt="Trading Dashboard" 
               className="rounded-xl shadow-2xl border border-slate-700 opacity-90"
             />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to graduate</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              OptionSage bridges the gap between educational content and practical application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Video Summaries</h3>
              <p className="text-slate-400 leading-relaxed">
                Don't just watch—understand. Paste any training video URL to get an instant breakdown of core concepts, risks, and setup mechanics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Slide Deck Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload course PDFs. Our multimodal AI reads the charts and bullet points to create study guides you can listen to on the go.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-6 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Graduation Wizard</h3>
              <p className="text-slate-400 leading-relaxed">
                Build your Level 8 Trading Plan with our 6-Step Wizard. Get real-time AI feedback on your strategy before you submit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Partners / Affiliate Section */}
      <div className="py-20 bg-[#0f172a] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
              Recommended Resources
           </div>
           <h2 className="text-3xl font-bold text-white mb-6">Trusted Partners in Your Trading Journey</h2>
           <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
             OptionSage is designed to work seamlessly with these premier platforms. Enhance your disciplined trading career with the best education and execution.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Options Animal */}
              <a 
                href="https://www.optionsanimal.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-[#8cc63f] transition-all hover:shadow-2xl hover:shadow-[#8cc63f]/10 flex flex-col h-full"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#8cc63f] transition-colors">OptionsAnimal</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Education</p>
                 </div>
                 <p className="text-slate-300 mb-6 flex-1">
                    The gold standard in options education. Master the proprietary 6-Step process and join a community that prioritizes capital preservation above all else.
                 </p>
                 <span className="inline-flex items-center text-[#8cc63f] font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    Explore Courses <span className="ml-2">&rarr;</span>
                 </span>
              </a>

              {/* Trader Oasis */}
              <a 
                href="https://traderoasis.com/get-started/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col h-full"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">Trader Oasis</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Analysis Platform</p>
                 </div>
                 <p className="text-slate-300 mb-6 flex-1">
                    The specialized platform built by OptionsAnimal for students. Visualize trades, analyze risk, and execute with tools designed specifically for the OA method.
                 </p>
                 <span className="inline-flex items-center text-teal-400 font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    Visit Oasis <span className="ml-2">&rarr;</span>
                 </span>
              </a>

              {/* Tradier */}
              <a 
                href="https://trade.tradier.com/raf-open/?mwr=keith-a847" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-[#1e293b] p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Tradier Brokerage</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Execution</p>
                 </div>
                 <p className="text-slate-300 mb-6 flex-1">
                    Seamless execution with low commissions and a powerful API ecosystem. The preferred brokerage for algorithmic and disciplined traders who demand control.
                 </p>
                 <span className="inline-flex items-center text-blue-400 font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    Open Account <span className="ml-2">&rarr;</span>
                 </span>
              </a>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0b1120] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-slate-500 mb-4">OptionSage AI Demo</p>
           <p className="text-slate-600 text-sm">
             Not affiliated with OptionsAnimal. Created for educational demonstration.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
