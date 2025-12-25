import React, { useState, useEffect, useCallback } from 'react';
import {
  ViewState,
  Application,
  ProgramType,
  WaitlistEntry,
  Communique,
  StatureMetrics,
} from './types';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Mandate from './components/Mandate';
import About from './components/About';
import Contact from './components/Contact';
import TrainingSystems from './components/TrainingSystems';
import Admissions from './components/Admissions';
import Leadership from './components/Leadership';
import Resources from './components/Resources';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProgramDetail from './components/ProgramDetail';
import ApostolicGuide from './components/ApostolicGuide';
import ApplicantPortal from './components/ApplicantPortal';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(
    null
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Loading States
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isPostLoadShimmer, setIsPostLoadShimmer] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(
    'Initializing Institutional Gateway...'
  );
  const [loadProgress, setLoadProgress] = useState(0);

  const ADMIN_PASSWORD = 'APOSTOLIC_ORDER';

  const loadingMessages = [
    'Synchronizing Chancery Archives...',
    'Verifying Apostolic Credentials...',
    'Decrypting Doctrinal Data...',
    'Uplinking to Global Registry...',
    'Restoring Ancient Foundations...',
    'Authenticating Leadership Logic...',
    'Establishment Covenant Connection...',
    'Retrieving Ministerial Records...',
  ];

  const triggerUplink = useCallback((onComplete: () => void) => {
    setIsGlobalLoading(true);
    setLoadProgress(0);
    setLoadingMsg(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );

    const totalDelay = Math.floor(Math.random() * 2000) + 2000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDelay) * 100, 99);
      const jitteredProgress = Math.max(
        progress + (Math.random() * 5 - 2.5),
        0
      );
      setLoadProgress(jitteredProgress);

      if (elapsed >= totalDelay) {
        clearInterval(interval);
        setLoadProgress(100);
        setTimeout(() => {
          onComplete();
          setIsGlobalLoading(false);
          // Trigger a subtle post-load shimmer phase to simulate "hydrating" UI elements
          setIsPostLoadShimmer(true);
          setTimeout(() => setIsPostLoadShimmer(false), 800);
        }, 300);
      }
    }, 100);
  }, []);

  useEffect(() => {
    triggerUplink(() => {});

    const savedApps = localStorage.getItem('sfath_applications');
    const savedWaitlist = localStorage.getItem('sfath_waitlist');
    const savedCycle = localStorage.getItem('sfath_cycle_open');

    if (savedApps) setApplications(JSON.parse(savedApps));
    if (savedWaitlist) setWaitlist(JSON.parse(savedWaitlist));
    if (savedCycle !== null) setIsAdmissionsOpen(JSON.parse(savedCycle));
  }, []);

  const handleApply = (program?: ProgramType) => {
    if (program) setSelectedProgram(program);
    handleNavigate('ADMISSIONS');
  };

  const handleViewProgram = (program: ProgramType) => {
    setSelectedProgram(program);
    handleNavigate('PROGRAM_DETAIL');
  };

  const handleNavigate = (newView: ViewState) => {
    setLoginError('');
    triggerUplink(() => {
      setView(newView);
      window.scrollTo(0, 0);
    });
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setLoginError('');
      handleNavigate('ADMIN');
    } else {
      setLoginError('Invalid Credential. Access Denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    handleNavigate('HOME');
  };

  const toggleCycle = () => {
    const newState = !isAdmissionsOpen;
    setIsAdmissionsOpen(newState);
    localStorage.setItem('sfath_cycle_open', JSON.stringify(newState));
  };

  const addApplication = (
    app: Omit<
      Application,
      'id' | 'status' | 'submittedAt' | 'communiqueHistory'
    >
  ) => {
    const initialCommunique: Communique = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'System',
      subject: 'Application Recorded',
      content:
        app.acknowledgmentText ||
        'Your request for alignment has been recorded.',
      timestamp: new Date().toISOString(),
    };

    const newApp: Application = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'New',
      submittedAt: new Date().toISOString(),
      communiqueHistory: [initialCommunique],
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('sfath_applications', JSON.stringify(updated));
  };

  const addToWaitlist = (email: string) => {
    if (waitlist.some((e) => e.email === email)) return;
    const updated = [
      { email, joinedAt: new Date().toISOString() },
      ...waitlist,
    ];
    setWaitlist(updated);
    localStorage.setItem('sfath_waitlist', JSON.stringify(updated));
  };

  const clearWaitlist = () => {
    setWaitlist([]);
    localStorage.setItem('sfath_waitlist', JSON.stringify([]));
  };

  const updateApplicationStatus = (
    id: string,
    status: Application['status'],
    notes?: string,
    newCommunique?: Communique,
    stature?: StatureMetrics
  ) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        const history = [...app.communiqueHistory];
        if (newCommunique) history.unshift(newCommunique);
        return {
          ...app,
          status,
          internalNotes: notes || app.internalNotes,
          communiqueHistory: history,
          stature: stature || app.stature,
        };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem('sfath_applications', JSON.stringify(updated));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
        {/* GLOBAL CHANCERY UPLINK LOADER */}
        {isGlobalLoading && (
          <div className="fixed inset-0 z-[1000] bg-[#0B1C2D] flex flex-col items-center justify-center p-6 animate-reveal">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[#C9A24D] transition-all duration-300 ease-out shadow-[0_0_15px_#C9A24D]"
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>

            <div className="relative mb-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#C9A24D]/10 animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-t border-b border-[#C9A24D]/40 animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#C9A24D] drop-shadow-[0_0_10px_rgba(201,162,77,0.5)]">
                  S
                </span>
                <div className="text-[6px] text-[#C9A24D]/60 uppercase tracking-[0.4em] font-black mt-1">
                  Uplink
                </div>
              </div>
            </div>

            <div className="text-center space-y-6 max-w-sm w-full">
              <div className="space-y-2">
                <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-black animate-pulse">
                  {loadingMsg}
                </p>
                <div className="flex justify-center items-center gap-3">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <span className="text-white/30 font-mono text-[9px] tracking-widest">
                    {Math.floor(loadProgress)}%
                  </span>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>
              </div>

              <div className="flex gap-1.5 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-[#C9A24D] animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      opacity: loadProgress > i * 30 ? 1 : 0.2,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-12 w-full px-12 flex justify-between items-center text-[7px] uppercase tracking-[0.4em] text-white/10 font-mono">
              <span>Enc_Type: AES-XTS-256</span>
              <span className="animate-pulse">
                Buffer: {Math.floor(Math.random() * 9999)} KB/S
              </span>
              <span>Registry: SFATH_V4</span>
            </div>
          </div>
        )}

        <Navbar currentView={view} onNavigate={handleNavigate} />

        <main
          className={`flex-grow pt-20 transition-all duration-1000 ${isGlobalLoading ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'} ${isPostLoadShimmer ? 'shimmer' : ''}`}
        >
          {view === 'HOME' && (
            <Home
              onNavigate={handleNavigate}
              onViewProgram={handleViewProgram}
            />
          )}
          {view === 'ABOUT' && <About />}
          {view === 'MANDATE' && <Mandate />}
          {view === 'TRAINING' && (
            <TrainingSystems
              onViewProgram={handleViewProgram}
              onApply={handleApply}
            />
          )}
          {view === 'ADMISSIONS' && (
            <Admissions
              isOpen={isAdmissionsOpen}
              selectedProgram={selectedProgram}
              applications={applications}
              onSubmit={addApplication}
              onJoinWaitlist={addToWaitlist}
              onNavigate={handleNavigate}
            />
          )}
          {view === 'PORTAL' && (
            <ApplicantPortal
              applications={applications}
              onNavigate={handleNavigate}
            />
          )}
          {view === 'LEADERSHIP' && <Leadership />}
          {view === 'RESOURCES' && <Resources />}
          {view === 'CONTACT' && <Contact />}

          {view === 'ADMIN' &&
            (!isAdminAuthenticated ? (
              <AdminLogin
                onLogin={handleAdminLogin}
                onCancel={() => handleNavigate('HOME')}
                error={loginError}
              />
            ) : (
              <AdminDashboard
                applications={applications}
                waitlist={waitlist}
                isCycleOpen={isAdmissionsOpen}
                onUpdateStatus={updateApplicationStatus}
                onToggleCycle={toggleCycle}
                onClearWaitlist={clearWaitlist}
                onLogout={handleAdminLogout}
              />
            ))}

          {view === 'PROGRAM_DETAIL' && selectedProgram && (
            <ProgramDetail
              program={selectedProgram}
              onApply={() => handleApply(selectedProgram)}
            />
          )}
        </main>

        <ApostolicGuide onNavigate={handleNavigate} />

        <footer
          className={`bg-[#0B1C2D] text-[#F9F9F7] py-20 px-6 mt-20 transition-opacity duration-1000 ${isGlobalLoading ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-cinzel font-black mb-6 tracking-widest text-[#C9A24D]">
                SFATH
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Raising a global company of Spirit-filled apostles for Kingdom
                advancement. Restoring apostolic order across the nations.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] cursor-pointer hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all duration-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] cursor-pointer hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all duration-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] cursor-pointer hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all duration-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="X"
                  className="w-9 h-9 rounded-full bg-[#C9A24D]/10 flex items-center justify-center text-[#C9A24D] cursor-pointer hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all duration-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C9A24D] mb-8">
                Curriculum
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <button
                    onClick={() => handleViewProgram(ProgramType.NEXUS)}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Nexus (Foundations)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleViewProgram(ProgramType.PRAXIS)}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Praxis (Formation)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleViewProgram(ProgramType.EKBALLO)}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Ekballo Lab (Deployment)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleViewProgram(ProgramType.FELLOWSHIP)}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Fellowship (Covering)
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C9A24D] mb-8">
                Navigation
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <button
                    onClick={() => handleNavigate('ABOUT')}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Vision & Ethos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('LEADERSHIP')}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Governance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('RESOURCES')}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    The Vault
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('CONTACT')}
                    className="hover:text-[#C9A24D] transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C9A24D] mb-8">
                Institutional
              </h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li>
                  <button
                    onClick={() => handleNavigate('PORTAL')}
                    className="group flex items-center gap-3 text-stone-400 hover:text-[#C9A24D] text-xs transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C9A24D]/50 group-hover:scale-125 transition-all"></span>
                    Applicant Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('ADMIN')}
                    className="group flex items-center gap-3 text-stone-400 hover:text-[#C9A24D] text-xs transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-stone-700 group-hover:bg-[#C9A24D] transition-all"></span>
                    Governance Command
                  </button>
                </li>
              </ul>
              <div className="mt-8 text-xs text-stone-500 font-light italic">
                "Restoring the Ancient Foundations"
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-stone-800 text-center">
            <p className="text-stone-500 text-[10px] uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Spirit Filled Apostolic Training Hub.
              Divine Order for the Global Body.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
