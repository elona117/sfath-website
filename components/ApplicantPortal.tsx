import React, { useState } from 'react';
import { Application, ViewState, StatureMetrics } from '../types';

interface ApplicantPortalProps {
  applications: Application[];
  onNavigate: (view: ViewState) => void;
}

const ApplicantPortal: React.FC<ApplicantPortalProps> = ({
  applications,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [error, setError] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (app) {
      // If approved but no metrics, inject some for the visual demo
      if (app.status === 'Approved' && !app.stature) {
        app.stature = {
          doctrine: 85,
          weight: 70,
          character: 90,
          vision: 65,
        };
      }
      setFoundApp(app);
      setError(false);
    } else {
      setError(true);
      setFoundApp(null);
    }
  };

  if (foundApp) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] py-12 sm:py-24 px-4 sm:px-6 animate-reveal">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-200 pb-10 gap-6">
            <div>
              <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black mb-4">
                Apostolic Correspondence
              </p>
              <h1 className="text-4xl sm:text-6xl font-black text-[#0B1C2D]">
                Digital{' '}
                <span className="italic font-serif text-[#C9A24D]">
                  Mailroom
                </span>
              </h1>
            </div>
            <button
              onClick={() => setFoundApp(null)}
              className="text-[9px] uppercase tracking-widest font-black text-stone-400 hover:text-[#0B1C2D] transition-colors border-b border-transparent hover:border-[#0B1C2D] pb-1"
            >
              Disconnect Registry
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Profile Pane */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl space-y-8">
                <div className="w-20 h-20 bg-[#0B1C2D] text-[#C9A24D] rounded-full flex items-center justify-center font-cinzel text-xl font-black shadow-lg">
                  {foundApp.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                    Identity Credential
                  </p>
                  <h3 className="text-xl font-bold text-[#0B1C2D]">
                    {foundApp.fullName}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-1">
                    {foundApp.email}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-50">
                  <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold mb-2">
                    Registry Pathway
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1C2D]">
                    {foundApp.program}
                  </span>
                </div>
                <div className="pt-6 border-t border-stone-50">
                  <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold mb-2">
                    Institutional Status
                  </p>
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      foundApp.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : foundApp.status === 'Declined'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-stone-50 text-stone-500 border border-stone-100'
                    }`}
                  >
                    {foundApp.status}
                  </span>
                </div>
              </div>

              {/* STANDOUT FEATURE: STATURE MATRIX */}
              {foundApp.status === 'Approved' && foundApp.stature && (
                <div className="bg-[#0B1C2D] p-8 rounded-[2rem] shadow-2xl space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg
                      className="w-16 h-16 text-[#C9A24D]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-[#C9A24D] font-black">
                    Formation Matrix
                  </p>
                  <div className="space-y-4 pt-4">
                    {[
                      {
                        label: 'Doctrinal Accuracy',
                        val: foundApp.stature.doctrine,
                      },
                      {
                        label: 'Spiritual Weight',
                        val: foundApp.stature.weight,
                      },
                      {
                        label: 'Character Integrity',
                        val: foundApp.stature.character,
                      },
                      {
                        label: 'Strategic Vision',
                        val: foundApp.stature.vision,
                      },
                    ].map((m, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[7px] uppercase tracking-widest font-black">
                          <span className="text-stone-400">{m.label}</span>
                          <span className="text-[#C9A24D]">{m.val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A24D] transition-all duration-1000 delay-300"
                            style={{ width: `${m.val}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] text-stone-500 font-light leading-relaxed italic pt-4">
                    "Your current alignment metrics based on institutional
                    review. These will mature during your labor."
                  </p>
                </div>
              )}
            </div>

            {/* Message View */}
            <div className="lg:col-span-8 space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#0B1C2D] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24D]"></span>
                Chancery Communiques
              </h3>

              {foundApp.communiqueHistory.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] border border-stone-100 text-center opacity-30 italic">
                  <p className="text-sm">
                    No institutional records found in the current cycle.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {foundApp.communiqueHistory.map((comm) => (
                    <div
                      key={comm.id}
                      className="bg-white rounded-[2rem] border border-stone-100 shadow-xl overflow-hidden animate-reveal group"
                    >
                      <div className="bg-stone-50 px-8 py-5 border-b border-stone-100 flex justify-between items-center">
                        <span
                          className={`text-[8px] uppercase font-black tracking-widest ${
                            comm.type === 'Approval'
                              ? 'text-emerald-600'
                              : comm.type === 'Rejection'
                                ? 'text-rose-600'
                                : 'text-stone-400'
                          }`}
                        >
                          {comm.type} Decree
                        </span>
                        <span className="text-[7px] text-stone-300 font-mono">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-8 sm:p-12 space-y-6">
                        <h4 className="text-2xl font-cinzel font-black text-[#0B1C2D]">
                          {comm.subject}
                        </h4>
                        <div className="h-[1px] w-12 bg-[#C9A24D] group-hover:w-20 transition-all duration-700"></div>
                        <blockquote className="text-lg font-serif italic text-stone-600 leading-relaxed">
                          "{comm.content}"
                        </blockquote>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-20 text-center no-print">
            <button
              onClick={() => onNavigate('HOME')}
              className="px-10 py-4 border border-stone-200 text-stone-400 rounded-full text-[9px] font-black uppercase tracking-widest hover:text-[#0B1C2D] hover:border-[#0B1C2D] transition-all"
            >
              Return to Public Gateway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 animate-reveal">
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="space-y-4">
          <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black">
            Authorized Access
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-[#0B1C2D] leading-tight">
            Applicant{' '}
            <span className="italic font-serif text-[#C9A24D]">Portal</span>
          </h1>
          <p className="text-stone-500 font-light text-lg">
            Retrieve your institutional records and determine your alignment
            status.
          </p>
        </div>

        <form
          onSubmit={handleLookup}
          className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C9A24D]"></div>
          <div className="space-y-6">
            <label
              htmlFor="lookup-email"
              className="block text-[9px] uppercase tracking-widest text-stone-400 font-black mb-1"
            >
              Enter Alignment Credential (Email)
            </label>
            <input
              id="lookup-email"
              type="email"
              required
              placeholder="apostle@example.org"
              className="w-full bg-stone-50 border border-stone-100 p-6 rounded-2xl text-center text-lg outline-none focus:ring-1 focus:ring-[#C9A24D] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="text-rose-600 text-[10px] uppercase tracking-widest font-black animate-pulse">
                Credential not found in institutional registry.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-6 bg-[#0B1C2D] text-[#C9A24D] text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.02] transition-all shadow-xl active:scale-95"
          >
            Retrieve Registry Record
          </button>
        </form>

        <p className="text-stone-400 text-[9px] uppercase tracking-[0.3em] font-bold">
          Registry Data is Encrypted & Secure
        </p>
      </div>
    </div>
  );
};

export default ApplicantPortal;
