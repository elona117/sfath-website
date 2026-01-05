import React, { useEffect, useRef, useState } from 'react';
import { ViewState, ProgramType } from '../types';
import { supabase } from '../lib/supabaseClient';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
  onViewProgram: (program: ProgramType) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onViewProgram }) => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submits & show loading

  const heartbeat = [
    'Nexus Cohort 2026: 92% Capacity Reached',
    'New Alignment Recorded: London, UK',
    'Vault Update: Governance Vol II Released',
    'Praxis Intensive: 14 Days to Launch',
    'Regional Hub Opening: Cape Town, SA',
    'Registry API Updated to v4.0',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % heartbeat.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Nations', value: '40+' },
    { label: 'Leaders', value: '2.5k+' },
    { label: 'Churches', value: '120' },
    { label: 'Cohorts', value: '12' },
  ];

  const joinWaitlist = async () => {
    const email = waitlistEmail.trim();

    if (!email) {
      setWaitlistMessage('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setWaitlistMessage('Please enter a valid email address.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setWaitlistMessage(''); // Clear previous message

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email }])
        .select();

      if (error) {
        console.error('INSERT ERROR FULL DETAILS:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          request: { email },
        });
        throw error;
      }

      console.log('Successfully joined waitlist!', data);
      setWaitlistMessage('Thank you! You have been added to the waitlist.');
      setWaitlistEmail(''); // Clear input
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      setWaitlistMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-[#F9F9F7]">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 lg:py-12 overflow-hidden bg-[#0B1C2D]">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
          <h1 className="text-[45vw] font-cinzel font-black tracking-tighter text-[#C9A24D]">
            SFATH
          </h1>
        </div>

        {/* Heartbeat Pulse */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 rounded-full bg-[#C9A24D] animate-ping shrink-0"></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[6px] sm:text-[7px] uppercase tracking-[0.4em] text-[#C9A24D] font-black mb-1">
                Institutional Heartbeat
              </p>
              <p
                key={pulseIndex}
                className="text-[9px] sm:text-[10px] text-white font-mono tracking-tighter animate-reveal truncate"
              >
                {heartbeat[pulseIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl w-full z-10 flex flex-col items-center text-center px-4">
          <div className="mb-8 sm:mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#C9A24D]/30 bg-[#C9A24D]/10 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-[#C9A24D] animate-pulse"></span>
            <p className="text-[#C9A24D] uppercase tracking-[0.4em] text-[7px] sm:text-[8px] font-black">
              Kingdom Authority & Order
            </p>
          </div>

          <h1 className="text-[10vw] sm:text-7xl lg:text-[8.5rem] font-black text-white mb-8 leading-[1] tracking-tighter max-w-5xl">
            Raising Spirit-Filled{' '}
            <span className="italic font-serif text-[#C9A24D]">Apostles.</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-xl lg:text-2xl font-light max-w-3xl mx-auto mb-12 leading-relaxed">
            A prestigious global hub dedicated to apostolic formation, doctrinal
            precision, and kingdom deployment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md">
            <button
              onClick={() => onNavigate('ADMISSIONS')}
              className="w-full sm:flex-1 bg-[#C9A24D] text-[#0B1C2D] px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Begin Journey
            </button>
            <button
              onClick={() => onNavigate('ABOUT')}
              className="w-full sm:flex-1 border border-[#C9A24D]/30 text-white bg-white/5 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all backdrop-blur"
            >
              Vision & Ethos
            </button>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl border-t border-white/10 pt-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-[#C9A24D] font-cinzel text-2xl sm:text-4xl font-black mb-1">
                  {stat.value}
                </p>
                <p className="text-stone-500 uppercase tracking-[0.2em] text-[7px] sm:text-[9px] font-bold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTINCTIVES */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="fade-in-section py-20 sm:py-32 px-4 sm:px-6 bg-[#F9F9F7]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24 px-4">
            <p className="text-[#0B1C2D]/50 uppercase tracking-[0.5em] text-[9px] sm:text-[10px] font-black mb-4">
              The Mandate
            </p>
            <h2 className="text-3xl sm:text-6xl font-black text-[#0B1C2D] mb-6 leading-tight">
              Our{' '}
              <span className="italic font-serif text-[#C9A24D]">
                Distinctives
              </span>
            </h2>
            <div className="w-12 h-1 bg-[#C9A24D] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
            {[
              {
                title: 'Spirit-Led Formation',
                desc: 'Imparting transformation through the active presence of God, refusing to divorce the Word from the Spirit.',
              },
              {
                title: 'Apostolic Doctrine',
                desc: 'Returning to the ancient foundations laid by the apostles for doctrinal integrity.',
              },
              {
                title: 'Deployment Focused',
                desc: 'Serving as a launching pad to equip students with practical tools to plant and govern.',
              },
            ].map((d, i) => (
              <div
                key={i}
                className="group p-8 sm:p-10 bg-white border border-stone-100 hover:border-[#C9A24D]/30 transition-all duration-700 shadow-xl flex flex-col items-center text-center rounded-3xl"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B1C2D] text-[#C9A24D] flex items-center justify-center mb-8 font-cinzel text-lg sm:text-xl font-black">
                  0{i + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-cinzel font-black text-[#0B1C2D] mb-4 sm:mb-6 group-hover:text-[#C9A24D] transition-colors">
                  {d.title}
                </h3>
                <p className="text-stone-500 font-light leading-relaxed text-sm sm:text-base">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PATHWAYS PREVIEW */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="fade-in-section py-20 sm:py-32 px-4 sm:px-6 bg-[#0B1C2D]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 sm:mb-24 gap-8 px-4">
            <div className="max-w-2xl">
              <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[9px] sm:text-[10px] font-black mb-6">
                Formation Pathways
              </p>
              <h2 className="text-3xl sm:text-6xl font-black text-white leading-tight">
                Structured{' '}
                <span className="italic font-serif text-[#C9A24D]">
                  Progression
                </span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('TRAINING')}
              className="text-[#C9A24D] uppercase tracking-[0.3em] text-[10px] font-black border-b border-[#C9A24D] pb-1 hover:text-white hover:border-white transition-all"
            >
              Curriculum Systems
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {[
              {
                id: ProgramType.NEXUS,
                name: 'Nexus',
                sub: 'Foundations',
                icon: 'Ω',
              },
              {
                id: ProgramType.PRAXIS,
                name: 'Praxis',
                sub: 'Formation',
                icon: 'Ψ',
              },
              {
                id: ProgramType.EKBALLO,
                name: 'Ekballo',
                sub: 'Deployment',
                icon: 'Δ',
              },
              {
                id: ProgramType.FELLOWSHIP,
                name: 'Fellowship',
                sub: 'Covering',
                icon: 'Σ',
              },
            ].map((p, i) => (
              <div
                key={p.id}
                onClick={() => onViewProgram(p.id)}
                className="group relative h-[320px] sm:h-[400px] overflow-hidden cursor-pointer rounded-[2rem] border border-white/5"
              >
                <div className="absolute inset-0 bg-stone-900 group-hover:bg-[#C9A24D]/10 transition-all duration-700"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 group-hover:-translate-y-4">
                  <span className="text-5xl sm:text-6xl text-[#C9A24D]/20 font-cinzel mb-8 group-hover:text-[#C9A24D] transition-colors">
                    {p.icon}
                  </span>
                  <p className="text-[#C9A24D] uppercase tracking-[0.3em] text-[8px] sm:text-[10px] font-black mb-2">
                    {p.sub}
                  </p>
                  <h4 className="text-2xl sm:text-3xl font-cinzel text-white mb-4">
                    {p.name}
                  </h4>
                  <div className="h-[1px] w-8 bg-[#C9A24D] group-hover:w-16 transition-all duration-700"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-white text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-2">
                    System Details <span className="text-[#C9A24D]">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-48 px-6 relative bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-12 sm:space-y-16">
          <h2 className="text-2xl sm:text-6xl font-black text-[#0B1C2D] leading-tight px-4">
            Step into your calling with the backing of{' '}
            <span className="italic font-serif text-[#C9A24D]">
              world-class apostolic covering.
            </span>
          </h2>
          <button
            onClick={() => onNavigate('ADMISSIONS')}
            className="w-full sm:w-auto px-16 py-6 bg-[#0B1C2D] text-[#C9A24D] rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            Submit Integration Request
          </button>
        </div>
      </section>

      {/* Waitlist Join Form */}
      <section className="py-16 px-6 bg-[#F9F9F7] border-t border-stone-200">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-black text-[#0B1C2D] mb-6">
            Join the Waitlist
          </h3>
          <p className="text-stone-600 mb-8">
            Be notified when the next admissions cycle opens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@example.com"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24D] text-sm disabled:opacity-50"
            />
            <button
              onClick={joinWaitlist}
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all ${
                isSubmitting
                  ? 'bg-[#C9A24D]/50 cursor-not-allowed'
                  : 'bg-[#C9A24D] text-[#0B1C2D] hover:bg-[#b58f3e]'
              }`}
            >
              {isSubmitting ? 'Joining...' : 'Join Now'}
            </button>
          </div>

          {waitlistMessage && (
            <p
              className="mt-4 text-sm font-medium"
              style={{
                color: waitlistMessage.includes('Thank you') ? '#10B981' : '#EF4444',
              }}
            >
              {waitlistMessage}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;