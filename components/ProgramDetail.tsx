import React from 'react';
import { ProgramType } from '../types';

interface ProgramDetailProps {
  program: ProgramType;
  onApply: () => void;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onApply }) => {
  const getProgramData = () => {
    switch (program) {
      case ProgramType.NEXUS:
        return {
          title: 'Nexus',
          tagline: 'The Foundational Gateway',
          objective:
            'To provide a unified doctrinal base and clear apostolic perspective for new leaders.',
          whoFor:
            'Emerging leaders, seasoned ministers seeking new alignment, and ministry students.',
          duration: '12 Weeks',
          delivery: 'Online Interactive Modules + Monthly Synod',
          outcomes: [
            'Apostolic Doctrinal Clarity',
            'Personal Calling Audit',
            'Systematic Theology Foundation',
          ],
          commitment: '4 hours per week',
        };
      case ProgramType.PRAXIS:
        return {
          title: 'Praxis',
          tagline: 'The Formation of Weight',
          objective:
            'To forge the internal spiritual structures required to carry high-level apostolic weight.',
          whoFor:
            'Graduates of Nexus or approved leaders ready for intense character formation.',
          duration: '6 Months',
          delivery: 'Residential Intensives + Weekly Mentorship',
          outcomes: [
            'Spiritual Disciplines Mastery',
            'Character Resilience',
            'Leadership Logic Development',
          ],
          commitment: '8 hours per week',
        };
      case ProgramType.EKBALLO:
        return {
          title: 'Ekballo Lab',
          tagline: 'The Strategic Deployment',
          objective:
            'To equip and release leaders into specific territorial or marketplace assignments.',
          whoFor:
            'Proven leaders ready for active deployment and institutional planting.',
          duration: '9 Months',
          delivery: 'Field Work + Strategic Coaching Sessions',
          outcomes: [
            'Territorial Mapping Skills',
            'Mission Strategic Plans',
            'Team Building Frameworks',
          ],
          commitment: 'Project Dependent',
        };
      case ProgramType.FELLOWSHIP:
        return {
          title: 'Fellowship',
          tagline: 'The Institutional Anchor',
          objective:
            'To provide continuous oversight, community, and resource sharing for alumni.',
          whoFor:
            'SFATH Alumni and recognized apostolic leaders seeking institutional covering.',
          duration: 'Ongoing',
          delivery: 'Quarterly Summits + Digital Resource Hub',
          outcomes: [
            'Long-term Accountability',
            'Resource Partnership',
            'Apostolic Community',
          ],
          commitment: 'Participation in Summits',
        };
    }
  };

  const data = getProgramData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-24 animate-reveal">
      <div className="mb-12 sm:mb-20">
        <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black mb-4">
          Institutional Training System
        </p>
        <h1 className="text-5xl sm:text-8xl font-black text-[#0B1C2D] mb-4 tracking-tighter">
          {data.title}
        </h1>
        <p className="text-xl sm:text-2xl font-serif text-stone-400 italic font-light">
          {data.tagline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">
        <div className="lg:col-span-8 space-y-12 sm:space-y-16">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A24D] mb-6">
              Spiritual Objective
            </h3>
            <p className="text-xl sm:text-2xl text-[#0B1C2D] font-light leading-relaxed">
              {data.objective}
            </p>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A24D] mb-8">
              Systemic Outcomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.outcomes.map((outcome, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 bg-white border border-stone-50 shadow-sm rounded-2xl"
                >
                  <div className="w-2 h-2 rounded-full bg-[#C9A24D] mt-2 shrink-0"></div>
                  <span className="text-stone-600 font-medium leading-tight">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A24D] mb-6">
              Target Demographic
            </h3>
            <p className="text-stone-500 font-light leading-relaxed max-w-2xl">
              {data.whoFor}
            </p>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#0B1C2D] p-8 sm:p-12 rounded-[2.5rem] shadow-2xl sticky top-28 border border-[#C9A24D]/20">
            <h3 className="text-[10px] uppercase tracking-widest font-black text-[#C9A24D] mb-10 text-center">
              Academic Briefing
            </h3>
            <div className="space-y-8 text-sm mb-12">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                  Duration
                </span>
                <span className="text-white font-black uppercase text-right">
                  {data.duration}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                  Delivery
                </span>
                <span className="text-white font-black uppercase text-right max-w-[150px] leading-tight">
                  {data.delivery}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                  Commitment
                </span>
                <span className="text-white font-black uppercase text-right">
                  {data.commitment}
                </span>
              </div>
            </div>
            <button
              onClick={onApply}
              className="w-full bg-[#C9A24D] text-[#0B1C2D] py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.03] transition-all shadow-xl active:scale-95"
            >
              Apply to Program
            </button>
            <p className="mt-8 text-[9px] text-[#C9A24D]/40 text-center uppercase tracking-widest italic font-bold">
              Institutional Registry SFATH-2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
