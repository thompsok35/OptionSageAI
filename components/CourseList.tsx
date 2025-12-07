import React, { useRef } from 'react';
import { CourseModule, SavedSummary } from '../types';

interface CourseListProps {
  courses: CourseModule[];
  savedSummaries: SavedSummary[];
  onSelectCourse: (course: CourseModule) => void;
  onAnalyzeFile: (course: CourseModule, file: File) => void;
  onViewSummary: (summary: SavedSummary) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  savedSummaries, 
  onSelectCourse, 
  onAnalyzeFile,
  onViewSummary 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedCourseRef = useRef<CourseModule | null>(null);

  const getCategoryColor = (category: string) => {
    if (category.includes('Orientation')) return 'bg-emerald-600 text-white';
    if (category.includes('Live Class')) return 'bg-blue-600 text-white';
    if (category.includes('Test')) return 'bg-purple-600 text-white';
    if (category === 'Beginner') return 'bg-green-500/90 text-white';
    if (category === 'Intermediate') return 'bg-yellow-500/90 text-black';
    return 'bg-slate-600 text-white';
  };

  const handleUploadClick = (course: CourseModule, e: React.MouseEvent) => {
    e.stopPropagation();
    selectedCourseRef.current = course;
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
      fileInputRef.current.click();
    }
  };

  const handleWatchClick = (course: CourseModule, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCourse(course);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCourseRef.current) {
      onAnalyzeFile(selectedCourseRef.current, file);
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept=".pdf,application/pdf" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const savedSummary = savedSummaries.find(s => s.moduleId === course.id);
          
          return (
            <div 
              key={course.id}
              className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700 shadow-xl hover:shadow-2xl hover:border-slate-600 transition-all cursor-pointer group flex flex-col"
              onClick={() => onSelectCourse(course)}
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10" />
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-20">
                  <span className={`px-2 py-1 rounded text-xs font-semibold shadow-md ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  {course.duration}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                  {course.description}
                </p>
                
                <div className="mt-auto space-y-3">
                  {savedSummary && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSummary(savedSummary);
                      }}
                      className="w-full py-2 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      View Saved Summary
                    </button>
                  )}
                  
                  <div className="flex gap-2">
                    <div className="flex-1 relative group/tooltip">
                      <button 
                        onClick={(e) => handleWatchClick(course, e)}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-700 shadow-xl z-50 text-center pointer-events-none animate-in fade-in zoom-in duration-200">
                        Paste video URL to generate AI summary
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>

                    <div className="flex-1 relative group/tooltip">
                      <button 
                        onClick={(e) => handleUploadClick(course, e)}
                        className="w-full py-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Slides
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-700 shadow-xl z-50 text-center pointer-events-none animate-in fade-in zoom-in duration-200">
                        Upload PDF slides for visual AI analysis
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CourseList;