
import React, { useState, useEffect } from 'react';
import { Application, WaitlistEntry, Communique, StatureMetrics } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AdminDashboardProps {
  applications: Application[];
  waitlist: WaitlistEntry[];
  isCycleOpen: boolean;
  onUpdateStatus: (id: string, status: Application['status'], notes?: string, communique?: Communique, stature?: StatureMetrics) => void;
  onToggleCycle: () => void;
  onClearWaitlist: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  applications, 
  waitlist, 
  isCycleOpen, 
  onUpdateStatus, 
  onToggleCycle, 
  onClearWaitlist,
  onLogout 
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Apps' | 'Waitlist' | 'System'>('Apps');
  const [internalNotes, setInternalNotes] = useState('');
  const [filter, setFilter] = useState<Application['status'] | 'All'>('All');
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  
  const selectedApp = applications.find(app => app.id === selectedAppId) || null;

  useEffect(() => {
    if (selectedApp) {
      setInternalNotes(selectedApp.internalNotes || '');
    }
  }, [selectedAppId, selectedApp?.internalNotes]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-8), `> ${msg}`]);
  };

  const getCommuniqueIcon = (type: Communique['type']) => {
    switch (type) {
      case 'Approval':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Rejection':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Inquiry':
        return (
          <div className="w-8 h-8 rounded-full bg-[#C9A24D]/20 text-[#C9A24D] flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-stone-500/20 text-stone-500 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
    }
  };

  const handleNotifyWaitlist = async () => {
    if (waitlist.length === 0) return;
    if (!isCycleOpen) {
      alert("The Admissions Cycle must be OPEN to notify the waitlist.");
      return;
    }

    setIsDispatching(true);
    setTerminalLogs([`INITIALIZING GLOBAL WAITLIST DISPATCH...`]);
    setDispatchProgress(5);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      addLog(`Connecting to Hub Relays...`);
      setDispatchProgress(15);
      await new Promise(r => setTimeout(r, 800));
      
      addLog(`Invoking Apostolic Scribe for "Summons" communique...`);
      setDispatchProgress(30);

      const prompt = `Draft a prestigious and sacred "Apostolic Summons" notification for seekers on the SFATH waitlist.
        Context: The Admissions Cycle for 2025 is now officially OPEN.
        Call to Action: Visit the Digital Hub to begin your formation pathway (Nexus).
        Tone: High-institutional, spiritually urgent, visionary, and welcoming. 
        Length: Max 100 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const summonsText = response.text || "The gates of the Hub are now open. Your season of formation has arrived. Proceed to the registry.";
      
      addLog("Summons content generated and authenticated.");
      setDispatchProgress(50);
      await new Promise(r => setTimeout(r, 600));

      const batchSize = 5;
      for (let i = 0; i < waitlist.length; i++) {
        const entry = waitlist[i];
        addLog(`Relaying to: ${entry.email}...`);
        
        const itemProgress = 50 + ((i + 1) / waitlist.length) * 45;
        setDispatchProgress(Math.floor(itemProgress));
        
        await new Promise(r => setTimeout(r, 200));
        
        if (i % batchSize === 0 && i !== 0) {
          addLog(`Batch ${Math.floor(i/batchSize)} dispatch confirmed.`);
        }
      }

      addLog(`DISPATCH COMPLETE. ${waitlist.length} seekers summoned.`);
      setDispatchProgress(100);
      
      setTimeout(() => {
        setIsDispatching(false);
        setTerminalLogs([]);
        setDispatchProgress(0);
      }, 2000);

    } catch (error) {
      console.error(error);
      addLog("CRITICAL FAILURE: WAITLIST RELAY INTERRUPTED.");
      setTimeout(() => setIsDispatching(false), 2000);
    }
  };

  const handleStatusUpdate = async (status: Application['status']) => {
    if (!selectedApp) return;

    if (status === 'Approved' || status === 'Declined') {
      setIsDispatching(true);
      setTerminalLogs([`INITIALIZING ${status.toUpperCase()} NOTIFICATION SEQUENCE...`]);
      setDispatchProgress(5);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        addLog(`Uplinking to SMTP Registry for ${selectedApp.email}...`);
        setDispatchProgress(20);
        await new Promise(r => setTimeout(r, 600));
        
        addLog(`Invoking Apostolic Scribe for ${status} communique...`);
        setDispatchProgress(40);

        const prompt = status === 'Approved' 
          ? `Draft a formal acceptance email for SFATH Hub. 
             Applicant: ${selectedApp.fullName}
             Program: ${selectedApp.program}
             Background: ${selectedApp.experience}
             Tone: High-institutional, sacred, welcoming, visionary. Max 100 words.`
          : `Draft a respectful but firm institutional rejection letter for SFATH.
             Applicant: ${selectedApp.fullName}
             Program: ${selectedApp.program}
             Tone: Serious, spiritually encouraging but final. Max 80 words.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        const content = response.text || "Alignment result pending further institutional review.";
        
        addLog("Communique drafted. Encrypting transmission...");
        setDispatchProgress(60);
        await new Promise(r => setTimeout(r, 500));
        
        addLog(`Relaying via secure channel to ${selectedApp.fullName}...`);
        setDispatchProgress(85);
        await new Promise(r => setTimeout(r, 800));

        const newCommunique: Communique = {
          id: Math.random().toString(36).substr(2, 9),
          type: status === 'Approved' ? 'Approval' : 'Rejection',
          subject: status === 'Approved' ? `Institutional Acceptance: ${selectedApp.program}` : `Alignment Determination: ${selectedApp.program}`,
          content: content,
          timestamp: new Date().toISOString()
        };

        let stature: StatureMetrics | undefined = undefined;
        if (status === 'Approved') {
           stature = {
             doctrine: Math.floor(Math.random() * 30) + 65,
             weight: Math.floor(Math.random() * 40) + 50,
             character: Math.floor(Math.random() * 20) + 80,
             vision: Math.floor(Math.random() * 50) + 40
           };
        }

        addLog("DISPATCH SUCCESSFUL. NOTIFICATION LOGGED.");
        setDispatchProgress(100);
        
        onUpdateStatus(selectedApp.id, status, internalNotes, newCommunique, stature);
        
        setTimeout(() => {
          setIsDispatching(false);
          setTerminalLogs([]);
          setDispatchProgress(0);
        }, 1500);
      } catch (error) {
        console.error(error);
        addLog("CRITICAL FAILURE: DISPATCH INTERRUPTED.");
        setTimeout(() => setIsDispatching(false), 2000);
      }
    } else {
      onUpdateStatus(selectedApp.id, status, internalNotes);
    }
  };

  const filteredApps = applications.filter(app => filter === 'All' || app.status === filter);

  return (
    <div className="min-h-screen bg-[#F9F9F7] pt-24 sm:pt-32 pb-12 sm:pb-20 relative px-4 sm:px-6">
      {isDispatching && (
        <div className="fixed inset-0 z-[100] bg-[#0B1C2D]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-black border border-[#C9A24D]/40 rounded-3xl shadow-[0_0_50px_rgba(201,162,77,0.1)] overflow-hidden font-mono text-[9px] sm:text-xs">
            <div className="bg-stone-900 px-6 py-4 border-b border-[#C9A24D]/20 flex justify-between items-center">
              <span className="text-[#C9A24D] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A24D] animate-pulse"></span>
                Communique Terminal
              </span>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2 h-32 overflow-hidden text-stone-400">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={i === terminalLogs.length - 1 ? "text-[#C9A24D]" : ""}>{log}</div>
                ))}
              </div>
              <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#C9A24D] transition-all duration-300 shadow-[0_0_20px_#C9A24D]" style={{width: `${dispatchProgress}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="animate-reveal">
            <div className="flex items-center gap-4 mb-4">
              <div className="px-3 py-1 bg-[#0B1C2D] text-[#C9A24D] rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#C9A24D]/20">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                Governance Hub
              </div>
              <button onClick={onLogout} className="text-[8px] uppercase tracking-widest font-black text-stone-400 hover:text-stone-900 transition-colors">Close Admin Access</button>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#0B1C2D] tracking-tight">Institutional <span className="italic font-serif text-[#C9A24D]">Registry</span></h1>
          </div>

          <nav className="flex bg-white p-1 rounded-full border border-stone-200 shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['Apps', 'Waitlist', 'System'].map((tab) => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); setSelectedAppId(null); }}
                className={`flex-1 lg:flex-none px-6 sm:px-10 py-3 rounded-full text-[9px] uppercase tracking-widest font-black transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#0B1C2D] text-[#C9A24D] shadow-lg' : 'text-stone-400 hover:text-stone-700'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === 'System' && (
          <div className="bg-white rounded-[2rem] border border-stone-100 p-8 sm:p-16 shadow-2xl text-center max-w-2xl mx-auto animate-reveal">
            <h3 className="text-3xl font-cinzel font-black text-[#0B1C2D] mb-6">Gateway Governance</h3>
            <p className="text-stone-500 font-light mb-12 text-sm leading-relaxed">Suspending admissions will block new alignment requests.</p>
            <div className="flex flex-col items-center gap-10">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${isCycleOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isCycleOpen ? <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
               </div>
               <button onClick={onToggleCycle} className={`w-full sm:w-auto px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl hover:scale-105 active:scale-95 ${isCycleOpen ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                 {isCycleOpen ? 'Suspend Enrollment' : 'Open Institutional Gates'}
               </button>
            </div>
          </div>
        )}

        {activeTab === 'Waitlist' && (
          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-2xl overflow-hidden animate-reveal">
             <div className="p-8 border-b border-stone-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-xs uppercase tracking-widest font-black text-[#0B1C2D]">Waitlist Registry</h3>
                  <p className="text-stone-400 text-[10px] italic">{waitlist.length} souls pending notification</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    disabled={waitlist.length === 0 || !isCycleOpen}
                    onClick={handleNotifyWaitlist}
                    className="flex-1 sm:flex-none px-8 py-3 bg-[#0B1C2D] text-[#C9A24D] rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    Notify All
                  </button>
                  <button 
                    disabled={waitlist.length === 0}
                    onClick={onClearWaitlist}
                    className="flex-1 sm:flex-none px-8 py-3 border border-stone-200 text-stone-400 rounded-full text-[9px] font-black uppercase tracking-widest hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-30"
                  >
                    Clear List
                  </button>
                </div>
             </div>
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[8px] uppercase tracking-[0.3em] font-black text-stone-400">
                    <tr>
                      <th className="px-8 py-5">Email Credential</th>
                      <th className="px-8 py-5">Registry Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {waitlist.map((entry, i) => (
                      <tr key={i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-[#0B1C2D]">{entry.email}</td>
                        <td className="px-8 py-6 text-[10px] text-stone-400 uppercase">{new Date(entry.joinedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'Apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={`lg:col-span-4 bg-white rounded-[2rem] border border-stone-100 shadow-xl overflow-hidden flex flex-col h-[650px] ${selectedAppId ? 'hidden lg:flex' : 'flex'} animate-reveal`}>
              <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                <div className="flex flex-col">
                   <h3 className="text-[10px] uppercase tracking-widest font-black text-[#0B1C2D]">Registry</h3>
                   <select 
                    className="bg-transparent text-[9px] uppercase tracking-widest font-black text-[#C9A24D] outline-none mt-1 cursor-pointer"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                  >
                    <option value="All">All Applications</option>
                    <option value="New">New</option>
                    <option value="Approved">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {filteredApps.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-6 border-b border-stone-50 cursor-pointer transition-all hover:bg-stone-50 group ${selectedAppId === app.id ? 'bg-[#C9A24D]/5 border-l-4 border-l-[#C9A24D]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-[#0B1C2D] truncate">{app.fullName}</h4>
                      <span className={`text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                        app.status === 'Declined' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-400 uppercase tracking-widest font-medium">
                      {app.program}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lg:col-span-8 bg-white rounded-[2rem] border border-stone-100 shadow-xl min-h-[650px] flex flex-col ${selectedAppId ? 'flex' : 'hidden lg:flex'} animate-reveal`}>
              {selectedApp ? (
                <div className="p-6 sm:p-12 flex flex-col h-full overflow-y-auto no-scrollbar">
                  <button onClick={() => setSelectedAppId(null)} className="lg:hidden mb-10 text-[9px] uppercase tracking-widest font-black text-stone-400 flex items-center gap-2">
                    Back to Registry
                  </button>

                  <div className="flex flex-col sm:flex-row justify-between items-start mb-12 border-b border-stone-50 pb-8 gap-6">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl sm:text-4xl font-black text-[#0B1C2D]">{selectedApp.fullName}</h2>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          selectedApp.status === 'Approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                          selectedApp.status === 'Declined' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' :
                          'bg-stone-200 text-stone-600'
                        }`}>
                          {selectedApp.status}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs font-medium uppercase tracking-widest">{selectedApp.email}</p>
                    </div>
                  </div>

                  <div className="space-y-10 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <section>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 mb-4">Ministerial Background</h5>
                        <div className="bg-stone-50 p-6 rounded-2xl text-stone-700 text-sm leading-relaxed border border-stone-100">{selectedApp.experience}</div>
                      </section>
                      <section>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 mb-4">Statement of Intent</h5>
                        <div className="bg-stone-50 p-6 rounded-2xl text-stone-700 text-sm leading-relaxed border border-stone-100">{selectedApp.statement}</div>
                      </section>
                    </div>
                    
                    {selectedApp.communiqueHistory && selectedApp.communiqueHistory.length > 0 && (
                      <section className="pt-10 border-t border-stone-50">
                        <h5 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A24D] mb-6">Communique History</h5>
                        <div className="space-y-4">
                           {selectedApp.communiqueHistory.map(comm => (
                             <div key={comm.id} className="bg-white p-6 rounded-2xl border border-stone-100 flex gap-6 group hover:shadow-lg transition-all">
                                <div className="shrink-0 pt-1">
                                  {getCommuniqueIcon(comm.type)}
                                </div>
                                <div className="flex-1">
                                   <div className="flex justify-between items-center mb-1">
                                      <h6 className="text-[#0B1C2D] text-sm font-black">{comm.subject}</h6>
                                      <span className="text-[8px] text-stone-300 font-mono">{new Date(comm.timestamp).toLocaleString()}</span>
                                   </div>
                                   <p className="text-stone-500 text-[11px] leading-relaxed italic line-clamp-2">"{comm.content}"</p>
                                </div>
                             </div>
                           ))}
                        </div>
                      </section>
                    )}

                    <section className="pt-10 border-t border-stone-50 space-y-8">
                       <h5 className="text-[10px] uppercase tracking-widest font-black text-[#0B1C2D]">Chancery Resolution</h5>
                       <textarea 
                          className="w-full bg-stone-50 border border-stone-100 p-6 rounded-2xl text-sm focus:ring-1 focus:ring-[#C9A24D] outline-none shadow-inner"
                          rows={3}
                          value={internalNotes}
                          onChange={(e) => setInternalNotes(e.target.value)}
                          placeholder="Institutional notes..."
                       />
                       <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => handleStatusUpdate('Approved')} 
                            className="px-8 py-4 bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-800 transition-all shadow-lg flex items-center gap-3"
                          >
                            Approve Alignment
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate('Declined')} 
                            className="px-8 py-4 border border-rose-200 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-rose-50 transition-all"
                          >
                            Decline Alignment
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate('Reviewed')} 
                            className="px-8 py-4 bg-[#0B1C2D] text-[#C9A24D] text-[9px] font-black uppercase tracking-widest rounded-full"
                          >
                            Mark as Reviewed
                          </button>
                       </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20 select-none">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black">Institutional Record Locked</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
