import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: ViewState }[] = [
    { label: 'ABOUT', view: 'ABOUT' },
    { label: 'COURSES', view: 'TRAINING' },
    { label: 'PROFILE', view: 'PORTAL' },
    { label: 'Leadership', view: 'LEADERSHIP' },
    { label: 'Vault', view: 'RESOURCES' },
    { label: 'Contact', view: 'CONTACT' },
  ];

  const handleLinkClick = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0B1C2D] text-[7px] sm:text-[9px] uppercase tracking-[0.4em] text-[#C9A24D] h-6 sm:h-8 flex items-center overflow-hidden whitespace-nowrap border-b border-[#C9A24D]/20">
        <div className="animate-marquee flex gap-12 sm:gap-16 items-center">
          <span>• ADMISSIONS OPEN FOR NEXUS COHORT 2026</span>
          <span>• APOSTOLIC SYNOD GATHERING: OCTOBER 12TH</span>
          <span>• RESTORING APOSTOLIC ORDER ACROSS THE NATIONS</span>
          <span>• SPIRIT-FILLED APPRENTICESHIP PROGRAM NOW ACTIVE</span>
          <span className="hidden sm:inline">
            • ADMISSIONS OPEN FOR NEXUS COHORT 2026
          </span>
          <span className="hidden sm:inline">
            • APOSTOLIC SYNOD GATHERING: OCTOBER 12TH
          </span>
        </div>
      </div>

      <nav
        className={`fixed top-6 sm:top-8 left-0 right-0 z-50 transition-all duration-700 px-3 sm:px-6 ${scrolled ? 'py-1 sm:py-2' : 'py-3 sm:py-6'}`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-full px-5 sm:px-8 ${scrolled ? 'glass shadow-2xl border border-[#C9A24D]/10 h-14 sm:h-16' : 'bg-transparent border border-transparent h-16 sm:h-20'}`}
        >
          <div
            className="flex items-center cursor-pointer group select-none shrink-0"
            onClick={() => handleLinkClick('HOME')}
          >
            <div className="text-lg sm:text-2xl font-cinzel font-black tracking-[0.2em] text-[#0B1C2D] flex items-center">
              SFATH<span className="text-[#C9A24D] animate-pulse">.</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`text-[9px] xl:text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 relative group py-2`}
              >
                <span
                  className={
                    currentView === link.view
                      ? 'text-[#C9A24D]'
                      : 'text-[#0B1C2D]/60 group-hover:text-[#0B1C2D]'
                  }
                >
                  {link.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#C9A24D] transition-all duration-500 rounded-full ${currentView === link.view ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}
                ></span>
              </button>
            ))}
            <div className="h-4 w-[1px] bg-stone-200 mx-1"></div>
            <button
              onClick={() => handleLinkClick('ADMISSIONS')}
              className="px-6 py-2.5 bg-[#0B1C2D] text-[#C9A24D] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all duration-300 rounded-full shadow-lg border border-[#C9A24D]/20 active:scale-95"
            >
              Enroll
            </button>
          </div>

          <button
            className="lg:hidden p-2.5 text-[#0B1C2D] rounded-full hover:bg-[#0B1C2D]/5 transition-colors focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-4.5 flex flex-col justify-between items-end">
              <span
                className={`h-[2px] bg-current transition-all duration-500 ${isMenuOpen ? 'w-6 translate-y-2.5 rotate-45' : 'w-6'}`}
              ></span>
              <span
                className={`h-[2px] bg-current transition-all duration-500 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}
              ></span>
              <span
                className={`h-[2px] bg-current transition-all duration-500 ${isMenuOpen ? 'w-6 -translate-y-1.5 -rotate-45' : 'w-5'}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-[#0B1C2D] transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) flex flex-col items-center justify-center space-y-8 z-[100] ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 sm:top-10 right-8 sm:right-10 text-[#C9A24D] text-[10px] uppercase tracking-[0.3em] font-black p-4"
          >
            [ Close ]
          </button>

          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
            {navLinks.map((link, idx) => (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`text-2xl sm:text-4xl font-cinzel tracking-[0.2em] transition-all duration-500 hover:scale-110 ${currentView === link.view ? 'text-[#C9A24D]' : 'text-stone-500 hover:text-white'}`}
                style={{
                  transitionDelay: isMenuOpen ? `${idx * 100}ms` : '0ms',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-10 sm:pt-16 w-full px-10 sm:px-12 max-w-sm">
            <button
              onClick={() => handleLinkClick('ADMISSIONS')}
              className="w-full py-5 sm:py-6 bg-[#C9A24D] text-[#0B1C2D] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-transform"
            >
              Begin Integration
            </button>
            <div className="mt-8 text-center">
              <p className="text-[#C9A24D]/40 text-[7px] sm:text-[8px] uppercase tracking-[0.5em] font-black italic">
                Apostolic Training Digital Hub
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
