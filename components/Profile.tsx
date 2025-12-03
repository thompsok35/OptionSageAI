import React, { useState } from 'react';
import { UserProfile } from '../types';
import { COURSES } from '../data/mockData';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  levelTitles: Record<number, string>;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, levelTitles }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.friendlyName);

  const handleSaveName = () => {
    onUpdateUser({ ...user, friendlyName: editName });
    setIsEditing(false);
  };

  // Calculate Progress
  const totalModules = COURSES.length;
  const completedCount = user.completedModules.length;
  const globalProgress = Math.round((completedCount / totalModules) * 100);

  // Calculate Current Level
  // Logic: The lowest level that is NOT 100% complete.
  let currentLevel = 8;
  for (let i = 1; i <= 8; i++) {
    const levelModules = COURSES.filter(c => c.level === i);
    const completedInLevel = levelModules.filter(c => user.completedModules.includes(c.id)).length;
    if (levelModules.length > 0 && completedInLevel < levelModules.length) {
      currentLevel = i;
      break;
    }
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="h-24 w-24 rounded-full bg-slate-800 border-4 border-[#1e293b] flex items-center justify-center text-4xl shadow-xl">
               👨‍💻
            </div>
          </div>
        </div>
        <div className="pt-12 pb-6 px-8 flex justify-between items-end">
           <div>
             {isEditing ? (
               <div className="flex items-center gap-2 mb-1">
                 <input 
                   type="text" 
                   value={editName}
                   onChange={(e) => setEditName(e.target.value)}
                   className="bg-slate-900 border border-slate-600 rounded px-3 py-1 text-xl font-bold text-white focus:outline-none focus:border-indigo-500"
                   autoFocus
                 />
                 <button 
                   onClick={handleSaveName}
                   className="p-1 bg-green-600 rounded text-white hover:bg-green-500"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                 </button>
               </div>
             ) : (
                <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-3xl font-bold text-white">{user.friendlyName}</h1>
                   <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                     </svg>
                   </button>
                </div>
             )}
             <p className="text-slate-400 font-medium">{user.username} • {user.memberLevel}</p>
           </div>
           
           <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Level</span>
              <div className="flex items-center gap-2 text-[#8cc63f]">
                 <span className="text-4xl font-black">{currentLevel}</span>
                 <span className="text-lg font-bold opacity-80">{levelTitles[currentLevel]}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
           <div className="text-slate-400 text-sm font-medium mb-1">Total Modules Completed</div>
           <div className="text-3xl font-bold text-white">{completedCount} <span className="text-slate-500 text-lg">/ {totalModules}</span></div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
           <div className="text-slate-400 text-sm font-medium mb-1">Overall Completion</div>
           <div className="text-3xl font-bold text-white">{globalProgress}%</div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#8cc63f] h-full rounded-full transition-all duration-1000" style={{ width: `${globalProgress}%` }}></div>
           </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
           <div className="text-slate-400 text-sm font-medium mb-1">Estimated Study Hours</div>
           <div className="text-3xl font-bold text-white">~{Math.round(completedCount * 0.9)} <span className="text-sm font-normal text-slate-500">hours</span></div>
        </div>
      </div>

      {/* Level Breakdown */}
      <h2 className="text-xl font-bold text-white mb-6">Curriculum Progress</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(level => {
          const levelModules = COURSES.filter(c => c.level === level);
          const completedInLevel = levelModules.filter(c => user.completedModules.includes(c.id)).length;
          const percentage = levelModules.length > 0 ? Math.round((completedInLevel / levelModules.length) * 100) : 0;
          const isCurrent = level === currentLevel;

          return (
            <div 
              key={level} 
              className={`bg-[#1e293b] rounded-xl p-5 border transition-all ${
                isCurrent ? 'border-[#8cc63f] shadow-lg shadow-[#8cc63f]/10' : 'border-slate-700 opacity-90'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      percentage === 100 ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                       {percentage === 100 ? '✓' : level}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Level {level}: {levelTitles[level]}</h3>
                    </div>
                 </div>
                 <div className="text-sm font-medium text-slate-300">
                    {completedInLevel}/{levelModules.length} Modules
                 </div>
              </div>
              
              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                     percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                   }`}
                   style={{ width: `${percentage}%` }}
                 ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;