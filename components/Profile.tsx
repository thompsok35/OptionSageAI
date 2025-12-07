
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { COURSES } from '../data/mockData';
import { storageService } from '../services/storageService';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  levelTitles: Record<number, string>;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, levelTitles }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.friendlyName);
  
  // Integration State
  const [tradierKey, setTradierKey] = useState(user.apiKeys?.tradier || '');
  const [showKey, setShowKey] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    onUpdateUser({ ...user, friendlyName: editName });
    setIsEditing(false);
  };

  const handleSaveIntegrations = () => {
    onUpdateUser({
      ...user,
      apiKeys: {
        ...user.apiKeys,
        tradier: tradierKey
      }
    });
    alert('Integration settings saved.');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportData = () => {
    const data = storageService.getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `OptionSage_Backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(blob, filename);
  };

  const handleCloudExport = async () => {
    const data = storageService.getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `OptionSage_Backup_${new Date().toISOString().split('T')[0]}.json`;

    // Check if the browser supports the File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JSON Backup File',
            accept: {'application/json': ['.json']},
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert('Backup saved successfully! If you selected a Cloud Drive folder, it will sync automatically.');
      } catch (err: any) {
        // Ignore abort errors (user cancelled)
        if (err.name !== 'AbortError') {
          console.error(err);
          alert('Could not save directly. Downloading file instead...');
          downloadFile(blob, filename);
        }
      }
    } else {
      // Fallback for browsers without API support (Safari, Firefox)
      alert('Your browser will download the file. Please move it to your Cloud Drive folder manually.');
      downloadFile(blob, filename);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = storageService.restoreData(json);
        if (success) {
          alert('Data restored successfully! The page will now reload.');
          window.location.reload();
        } else {
          alert('Failed to restore data. Invalid file format.');
        }
      } catch (err) {
        console.error(err);
        alert('Error parsing backup file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
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
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Level Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Curriculum Progress</h2>
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

        {/* Data & Integrations Column */}
        <div className="space-y-8">
           
           {/* Integrations Card */}
           <div>
             <h2 className="text-xl font-bold text-white mb-4">Integrations</h2>
             <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 space-y-4">
                <div>
                   <h3 className="text-white font-bold flex items-center gap-2">
                      <span className="text-blue-400">Tradier</span> Brokerage
                   </h3>
                   <p className="text-xs text-slate-400 mt-1">
                      Connect your Tradier account to fetch real-time fundamental data instead of AI estimates.
                   </p>
                </div>
                
                <div>
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Access Token</label>
                   <div className="flex gap-2">
                      <input 
                        type={showKey ? "text" : "password"}
                        value={tradierKey}
                        onChange={(e) => setTradierKey(e.target.value)}
                        placeholder="Paste API Key here..."
                        className="flex-1 bg-[#0f172a] border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="px-3 bg-slate-700 rounded hover:bg-slate-600 text-slate-300"
                      >
                        {showKey ? 'Hide' : 'Show'}
                      </button>
                   </div>
                </div>

                <div className="pt-2">
                   <button 
                     onClick={handleSaveIntegrations}
                     className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20"
                   >
                     Save Integration
                   </button>
                </div>
                
                {user.apiKeys?.tradier && (
                   <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-2 rounded border border-green-900/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Connected to Tradier
                   </div>
                )}
             </div>
           </div>

           {/* Data Management Card */}
           <div>
             <h2 className="text-xl font-bold text-white mb-4">Data Management</h2>
             <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 space-y-6">
                <div className="text-sm text-slate-400">
                  <p className="mb-2">Your progress is currently saved in this browser. To sync with other devices, save your backup to a cloud folder (Google Drive, OneDrive, etc.).</p>
                </div>

                <button 
                  onClick={handleCloudExport}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-900/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save to Cloud / Disk
                </button>
                
                <button 
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 rounded-lg transition-colors border border-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Only
                </button>

                <div className="pt-6 border-t border-slate-700">
                   <input 
                     type="file" 
                     accept=".json"
                     ref={fileInputRef}
                     onChange={handleFileChange}
                     className="hidden"
                   />
                   <button 
                      onClick={handleImportClick}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors border border-slate-600"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                     Import Backup
                   </button>
                   <p className="text-xs text-slate-500 mt-2 text-center">
                     Restoring data will overwrite your current progress.
                   </p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
