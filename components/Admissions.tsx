import React, { useState, useEffect } from 'react';
import { ProgramType, ViewState, Application } from '../types';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabaseClient';

interface AdmissionsProps {
  isOpen: boolean;
  selectedProgram: ProgramType | null;
  applications: Application[];
  onSubmit: (
    app: Omit<Application, 'id' | 'status' | 'submittedAt'> & {
      acknowledgmentText?: string;
    }
  ) => void;
  onJoinWaitlist: (email: string) => void;
  onNavigate: (view: ViewState) => void;
}

const Admissions: React.FC<AdmissionsProps> = ({
  isOpen,
  selectedProgram,
  applications,
  onSubmit,
  onJoinWaitlist,
  onNavigate,
}) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStep, setDispatchStep] = useState('');
  const [personalDecree, setPersonalDecree] = useState('');
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const getInitialFormState = () => ({
    fullName: '',
    email: '',
    phone: '',
    program: selectedProgram || ProgramType.NEXUS,
    experience: '',
    statement: '',
  });

  const [formData, setFormData] = useState(getInitialFormState());

  useEffect(() => {
    if (selectedProgram) {
      setFormData((prev) => ({ ...prev, program: selectedProgram }));
    }
  }, [selectedProgram]);

  const handleNext = () => {
    setDuplicateError(null);
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleBack = () => {
    setDuplicateError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgramBrief = (type: ProgramType) => {
    const briefs = {
      [ProgramType.NEXUS]: {
        tagline: 'Foundational Recalibration',
        weight: 'Level I',
        labor: '4-6 Hours / Week',
        pillars: [
          'Apostolic Order',
          'Kingdom Identity',
          'Doctrinal Accuracy',
          'Intercessory Weight',
        ],
        description:
          'Nexus is the mandatory gateway for all seekers. It strips away cultural religion to lay the ancient apostolic foundations of the faith.',
      },
      [ProgramType.PRAXIS]: {
        tagline: 'Character & Formation',
        weight: 'Level II',
        labor: '8-10 Hours / Week',
        pillars: [
          'Inner Governance',
          'Character Integrity',
          'Leadership Logic',
          'Spiritual Vitality',
        ],
        description:
          'Praxis focuses on the "weight of the leader." It is an intense formation of the soul, ensuring the leader is structured internally to carry global influence.',
      },
      [ProgramType.EKBALLO]: {
        tagline: 'Strategic Deployment',
        weight: 'Level III',
        labor: 'Project Driven',
        pillars: [
          'Territorial Mapping',
          'Apostolic Planting',
          'Resource Management',
          'Mission Execution',
        ],
        description:
          'The "sending out" phase. Ekballo Lab is a hands-on strategic environment where theoretical formation meets active territorial assignment.',
      },
      [ProgramType.FELLOWSHIP]: {
        tagline: 'Institutional Covering',
        weight: 'Senior Tier',
        labor: 'Ongoing / Relational',
        pillars: [
          'Peer Accountability',
          'Governing Wisdom',
          'Network Synergy',
          'Prophetic Insight',
        ],
        description:
          'A dedicated tier for ordained alumni and recognized leaders seeking long-term institutional alignment and collective apostolic covering.',
      },
    };
    return briefs[type];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    const isDuplicate = applications.some(
      (app) =>
        app.email.toLowerCase() === formData.email.toLowerCase() &&
        app.program === formData.program
    );

    if (isDuplicate) {
      setDuplicateError(
        `An institutional alignment request for the ${formData.program} pathway has already been recorded for this credential (${formData.email}).`
      );
      return;
    }

    setIsDispatching(true);
    setDuplicateError(null);

    try {
      setDispatchStep('Verifying Credentials...');
      await new Promise((r) => setTimeout(r, 800));
      setDispatchStep('Securing Institutional Data...');
      await new Promise((r) => setTimeout(r, 800));
      setDispatchStep('Preparing Your Official Decree...');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a prestigious, spiritually weighty "Decree of Receipt" for an applicant.
        Name: ${formData.fullName}
        Pathway: ${formData.program}
        Context: They have just submitted their application to SFATH. 
        Tone: Institutional, sacred, encouraging, visionary. 
        Length: 3-4 sentences.`,
      });

      const decree =
        response.text ||
        'Your alignment request has been successfully recorded within the Chancery archives. Prepare for the labor ahead.';
      setPersonalDecree(decree);

      setDispatchStep('Finalizing Submission...');
      await new Promise((r) => setTimeout(r, 1000));

      // Save real application to Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            program: formData.program,
            experience: formData.experience,
            statement: formData.statement,
            status: 'New',
            acknowledgmentText: decree, // Store decree
            phone: formData.phone || null, // Optional phone
          },
        ])
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      onSubmit({
        ...formData,
        acknowledgmentText: decree,
      });

      setIsDispatching(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission Error:', error);
      setIsDispatching(false);
      onSubmit({
        ...formData,
        acknowledgmentText: personalDecree || 'Fallback decree due to error.',
      });
      setSubmitted(true);
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail) {
      onJoinWaitlist(waitlistEmail);
      setWaitlistEmail('');
      setWaitlistJoined(true);
    }
  };

  if (isDispatching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F9F9F7] animate-reveal">
        <div className="w-16 h-16 sm:w-24 sm:h-24 relative mb-12">
          <div className="absolute inset-0 border-4 border-[#C9A24D]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#C9A24D] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center space-y-4 px-4">
          <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black">
            Chancery Uplink Active
          </p>
          <h2 className="text-xl sm:text-2xl font-cinzel font-black text-[#0B1C2D] animate-pulse max-w-md mx-auto">
            {dispatchStep}
          </h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-widest italic font-bold">
            Encrypted Relay Pathway 11
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const recordId = Math.random().toString(36).substr(2, 9).toUpperCase();
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center py-8 sm:py-24 px-4 sm:px-6 animate-reveal overflow-x-hidden">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 sm:mb-16 no-print">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-emerald-800 uppercase tracking-[0.4em] text-[8px] sm:text-[9px] font-black">
                Registry Authenticated
              </p>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black text-[#0B1C2D] leading-[1.1] mb-6 px-2">
              The Decree of{' '}
              <span className="italic font-serif text-[#C9A24D]">Receipt</span>
            </h1>
            <p className="text-stone-500 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
              Your institutional alignment request has been officially recorded
              within the Chancery Archives.
            </p>
          </div>

          <div className="relative bg-white border border-stone-200 shadow-2xl rounded-[2rem] sm:rounded-[3rem] overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] academic-grid pointer-events-none"></div>
            <div className="relative p-6 sm:p-24 space-y-12 sm:space-y-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-b border-stone-100 pb-12">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#0B1C2D] rounded-full flex items-center justify-center text-[#C9A24D] font-cinzel text-2xl sm:text-3xl font-black shadow-xl shrink-0">
                    S
                  </div>
                  <div>
                    <h3 className="text-[10px] sm:text-[13px] uppercase tracking-[0.5em] font-black text-[#0B1C2D] mb-1">
                      Apostolic Chancery
                    </h3>
                    <p className="text-stone-400 text-[7px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">
                      Institutional Registry • Global Hub
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-[8px] uppercase tracking-[0.3em] font-black text-[#C9A24D] mb-2">
                    Record Index
                  </p>
                  <p className="text-base sm:text-xl font-mono font-black text-[#0B1C2D] tracking-tighter">
                    #{recordId}
                  </p>
                </div>
              </div>

              <div className="space-y-12 sm:space-y-16 max-w-2xl mx-auto text-center">
                <div className="space-y-4">
                  <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.6em] font-black text-[#C9A24D] animate-reveal">
                    Alignment Pathway
                  </p>
                  <h4 className="text-2xl sm:text-5xl font-serif italic text-[#0B1C2D] leading-tight">
                    {formData.program}{' '}
                    <span className="text-stone-300 font-cinzel not-italic text-xl sm:text-4xl ml-2 font-light">
                      System
                    </span>
                  </h4>
                </div>

                <blockquote className="text-base sm:text-2xl font-serif text-[#0B1C2D] leading-relaxed italic animate-reveal border-x border-stone-100 px-4 sm:px-10 py-6">
                  "{personalDecree}"
                </blockquote>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 py-10 border-y border-stone-100 text-left sm:text-center">
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-stone-400 font-black">
                      Credential Name
                    </p>
                    <p className="text-sm font-bold text-[#0B1C2D] uppercase tracking-wider">
                      {formData.fullName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-stone-400 font-black">
                      Institutional Status
                    </p>
                    <p className="text-sm font-black text-emerald-600 uppercase tracking-wider">
                      Registry Active
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-stone-400 font-black">
                      Filing Date
                    </p>
                    <p className="text-sm font-bold text-[#0B1C2D] uppercase tracking-wider">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest text-stone-400 font-black">
                      Registry Type
                    </p>
                    <p className="text-sm font-bold text-[#C9A24D] uppercase tracking-wider">
                      SECURE_SFATH_V4
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-10 pt-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F9F9F7] border border-[#C9A24D]/30 flex flex-col items-center justify-center text-[#C9A24D] shadow-inner shrink-0">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 font-black mb-1">
                        Authorized
                      </p>
                      <p className="text-sm sm:text-base font-cinzel font-black text-[#0B1C2D]">
                        CHANCERY SCRIBE
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B1C2D]"></div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center no-print px-4">
            <button
              onClick={() => onNavigate('HOME')}
              className="w-full sm:w-auto px-10 py-5 bg-[#0B1C2D] text-[#C9A24D] rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all shadow-xl active:scale-95"
            >
              Return Home
            </button>
            <a
              href="https://chat.whatsapp.com/CejCgdY9Qld34OdH1qeiaw"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.457-5.47-1.32l-6.537 1.728zm11.887-21.547c-5.319 0-9.648 4.328-9.65 9.649 0 2.115.682 4.102 1.954 5.714l-1.033 3.77 3.868-1.015c1.551.846 3.297 1.293 5.071 1.294h.004c5.318 0 9.648-4.33 9.65-9.651 0-2.578-1.003-5.002-2.824-6.824-1.821-1.822-4.246-2.824-6.83-2.825zm5.291 7.235c-.289-.145-1.713-.847-1.978-.942-.264-.096-.458-.145-.65.145-.192.291-.745.942-.913 1.135-.167.194-.335.218-.624.073-.289-.145-1.22-.449-2.324-1.433-.859-.767-1.439-1.714-1.607-2.005-.168-.291-.018-.448.126-.592.13-.129.289-.338.434-.508.145-.17.193-.29.289-.483.097-.193.048-.363-.024-.508-.072-.146-.65-1.568-.89-2.148-.234-.56-.471-.484-.65-.494-.168-.008-.362-.01-.555-.01-.192 0-.506.072-.77.362-.265.291-1.012.99-1.012 2.416 0 1.426 1.036 2.804 1.18 3.0z" />
              </svg>
              Join WhatsApp Group
            </a>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-10 py-5 border border-stone-200 bg-white text-stone-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#0B1C2D] hover:border-[#0B1C2D] transition-all shadow-md active:scale-95"
            >
              Print Decree
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 bg-[#F9F9F7] text-center">
        <div className="max-w-xl w-full space-y-12 animate-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-stone-200 bg-white shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-stone-300 animate-pulse"></span>
            <p className="text-stone-400 uppercase tracking-[0.4em] text-[8px] font-black">
              Institutional Gates Temporarily Closed
            </p>
          </div>
          <h1 className="text-4xl sm:text-7xl font-black text-[#0B1C2D] leading-none">
            Access{' '}
            <span className="italic font-serif text-stone-300">Suspended.</span>
          </h1>
          {!waitlistJoined ? (
            <div className="bg-white p-8 sm:p-12 shadow-2xl rounded-[2.5rem] border border-stone-100 w-full">
              <h3 className="text-xs uppercase tracking-[0.4em] font-black text-[#0B1C2D] mb-8">
                Join the Outer Court
              </h3>
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter Registry Email"
                  className="w-full bg-stone-50 border border-stone-100 p-5 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#C9A24D] text-center"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full py-5 bg-[#0B1C2D] text-[#C9A24D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-lg active:scale-95 transition-transform"
                >
                  Await Summons
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 text-emerald-800 animate-reveal">
              <p className="text-sm font-black uppercase tracking-widest">
                Souls Recorded • Prepare for Alignment
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Pathway' },
    { num: 3, label: 'Statement' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 animate-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black">
              2026 Cycle Active
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-[#0B1C2D] leading-none">
              Begin Hub{' '}
              <span className="italic font-serif text-[#C9A24D]">
                Integration
              </span>
            </h1>
            <p className="text-stone-500 font-light text-lg leading-relaxed">
              The apostolic journey requires structural alignment. Provide your
              credentials to initiate the process.
            </p>
          </div>

          <div className="hidden lg:block space-y-10 border-t border-stone-100 pt-10">
            <h3 className="text-xs uppercase tracking-[0.4em] font-black text-[#0B1C2D]">
              Integration Path
            </h3>
            <div className="space-y-8">
              {steps.map((s) => (
                <div key={s.num} className="flex items-center gap-6">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-cinzel text-xs font-black border-2 transition-all duration-500 ${
                      step === s.num
                        ? 'bg-[#0B1C2D] text-[#C9A24D] border-[#C9A24D] shadow-lg scale-110'
                        : step > s.num
                          ? 'bg-[#C9A24D] text-[#0B1C2D] border-[#C9A24D]'
                          : 'bg-stone-50 text-stone-300 border-stone-100'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <p
                    className={`text-[10px] uppercase tracking-widest font-black ${step >= s.num ? 'text-[#0B1C2D]' : 'text-stone-300'}`}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-stone-100 px-6 py-10 sm:p-16 shadow-2xl rounded-[2rem] sm:rounded-[3rem] relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-stone-50 rounded-t-full overflow-hidden">
            <div
              className="h-full bg-[#C9A24D] transition-all duration-700"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-8 animate-reveal">
                <h4 className="text-xl font-cinzel font-black text-[#0B1C2D]">
                  Step 1: Credential Data
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-3 ml-2">
                      Legal Identity
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base focus:ring-1 focus:ring-[#C9A24D] outline-none transition-all shadow-inner"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-3 ml-2">
                        Registry Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base outline-none focus:ring-1 focus:ring-[#C9A24D] shadow-inner"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Email Address"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-3 ml-2">
                        Uplink Number
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base outline-none focus:ring-1 focus:ring-[#C9A24D] shadow-inner"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Phone (Optional)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-reveal">
                <h4 className="text-xl font-cinzel font-black text-[#0B1C2D]">
                  Step 2: Pathway Designation
                </h4>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-4 ml-2">
                      Choose Integration Path
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base font-bold text-[#0B1C2D] outline-none focus:ring-1 focus:ring-[#C9A24D] cursor-pointer appearance-none shadow-inner"
                        value={formData.program}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            program: e.target.value as ProgramType,
                          })
                        }
                      >
                        <option value={ProgramType.NEXUS}>
                          Nexus (Foundations)
                        </option>
                        <option value={ProgramType.PRAXIS}>
                          Praxis (Formation)
                        </option>
                        <option value={ProgramType.EKBALLO}>
                          Ekballo Lab (Deployment)
                        </option>
                        <option value={ProgramType.FELLOWSHIP}>
                          Fellowship (Covering)
                        </option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#C9A24D]">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 9l-7 7-7-7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    key={formData.program}
                    className="bg-stone-50/50 border border-stone-100 rounded-3xl p-6 sm:p-10 transition-all animate-reveal"
                  >
                    <p className="text-[#C9A24D] text-[10px] uppercase tracking-[0.4em] font-black mb-2">
                      {getProgramBrief(formData.program).tagline}
                    </p>
                    <p className="text-stone-500 text-sm leading-relaxed mb-6 font-light italic">
                      "{getProgramBrief(formData.program).description}"
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                        <p className="text-[7px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                          Duration
                        </p>
                        <p className="text-[10px] font-black text-[#0B1C2D]">
                          {getProgramBrief(formData.program).labor}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                        <p className="text-[7px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                          Tier
                        </p>
                        <p className="text-[10px] font-black text-[#C9A24D]">
                          {getProgramBrief(formData.program).weight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-reveal">
                <h4 className="text-xl font-cinzel font-black text-[#0B1C2D]">
                  Step 3: Vision Alignment
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-4 ml-2">
                      Salvation Experience
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base outline-none resize-none focus:ring-1 focus:ring-[#C9A24D] shadow-inner"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      placeholder="Describe your journey..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-black mb-4 ml-2">
                      Statement of Intent
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full bg-stone-50 border-none p-6 rounded-2xl text-base outline-none resize-none focus:ring-1 focus:ring-[#C9A24D] shadow-inner"
                      value={formData.statement}
                      onChange={(e) =>
                        setFormData({ ...formData, statement: e.target.value })
                      }
                      placeholder="Why are you applying?"
                    />
                  </div>
                </div>
              </div>
            )}

            {duplicateError && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs animate-reveal">
                <p className="font-black uppercase tracking-widest mb-1">
                  Access Restrict
                </p>
                {duplicateError}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-4 pt-10 border-t border-stone-50">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-5 border border-stone-200 text-stone-400 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-stone-50 transition-all flex items-center justify-center active:scale-95"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-6 bg-[#0B1C2D] text-[#C9A24D] text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all shadow-xl active:scale-[0.98]"
              >
                {step === 3 ? 'Apply' : 'Continue Integration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admissions;