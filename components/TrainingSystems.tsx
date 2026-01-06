import React from 'react';
import { ProgramType } from '../types';

interface TrainingSystemsProps {
  onViewProgram: (program: ProgramType) => void;
  onApply: (program: ProgramType) => void;
}

const TrainingSystems: React.FC<TrainingSystemsProps> = ({
  onViewProgram,
  onApply,
}) => {
  const systems = [
    {
      id: ProgramType.NEXUS,
      title: 'Nexus',
      subtitle: 'Foundations',
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M3 21h18M3 7h18M6 21V7m6 14V7m6 14V7M3 7l9-4 9 4"
          />
          <circle
            cx="12"
            cy="12"
            r="1.5"
            strokeWidth="1.5"
            fill="currentColor"
          />
        </svg>
      ),
      description:
        'Establishing believers in the faith and equipping them for practical Christian living.',
      duration: '12 Weeks',
      mode: 'Online & Hybrid',
      outcomes: [
        'Biblical Worldview',
        'Strengthened Conviction',
        'Prayer/Intercession',
        'Understanding Spiritual Disciplines',
      ],
    },
    {
      id: ProgramType.PRAXIS,
      title: 'Praxis',
      subtitle: 'Formation',
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M9 12l2 2 4-4"
          />
        </svg>
      ),
      description:
        'Inner work of the leader, emotional health, and spiritual disciplines.',
      duration: '9 Months',
      mode: 'Cohort-Based',
      outcomes: [
        'Health Assessment',
        'Solitude/Fasting',
        'Servant Leadership',
        'Conflict Resolution',
      ],
    },
    {
      id: ProgramType.EKBALLO,
      title: 'Ekballo Lab',
      subtitle: 'Deployment',
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
          <circle cx="12" cy="12" r="8" strokeWidth="1" strokeDasharray="2 4" />
          <path strokeLinecap="round" strokeWidth="1.5" d="M12 7v0" />
        </svg>
      ),
      description:
        '"The sending out"—practical, hands-on labs for ministry execution.',
      duration: '6 Months',
      mode: 'Field Work',
      outcomes: [
        'Church Planting',
        'Evangelism Strategy',
        'Preaching Labs',
        'Project Management',
      ],
    },
    {
      id: ProgramType.FELLOWSHIP,
      title: 'Fellowship',
      subtitle: 'Covering',
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          />
          <circle cx="12" cy="10" r="3" strokeWidth="1.2" />
          <path
            strokeLinecap="round"
            strokeWidth="1.2"
            d="M8 15c0-2.209 1.791-4 4-4s4 1.791 4 4"
          />
        </svg>
      ),
      description:
        'Ongoing network for ordained ministers and senior leaders. Sustaining the mandate.',
      duration: 'Ongoing',
      mode: 'Retreats',
      outcomes: [
        'Peer Accountability',
        'Crisis Support',
        'Theological Refreshing',
        'Resource Sharing',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-[#F9F9F7]">
      <div className="mb-24 text-center">
        <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] mb-6 font-black">
          The Curriculum
        </p>
        <h1 className="text-5xl sm:text-7xl font-black text-[#0B1C2D] mb-8 tracking-tighter">
          Training Systems
        </h1>
        <p className="text-stone-500 font-light text-xl max-w-3xl mx-auto leading-relaxed">
          A structured progression from foundational understanding to mature
          apostolic deployment.
        </p>
      </div>

      <div className="space-y-16">
        {systems.map((system, idx) => (
          <div
            key={system.id}
            className="group flex flex-col lg:flex-row bg-white border border-stone-100 hover:border-[#C9A24D]/30 transition-all duration-700 overflow-hidden shadow-2xl hover:shadow-[#C9A24D]/5"
          >
            <div className="lg:w-1/3 bg-[#0B1C2D] p-12 flex flex-col justify-between text-white relative">
              <div className="absolute top-8 right-8 text-[#C9A24D]/20 group-hover:text-[#C9A24D]/40 transition-all duration-700 transform group-hover:rotate-12 scale-110">
                {system.icon}
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A24D] mb-4 block font-black">
                  Pathway 0{idx + 1}
                </span>
                <h2 className="text-4xl font-cinzel font-black mb-2">
                  {system.title}
                </h2>
                <p className="text-[#C9A24D] font-serif italic text-lg opacity-80">
                  {system.subtitle}
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-stone-500">Duration</span>
                  <span className="text-[#C9A24D] font-black">
                    {system.duration}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-stone-500">Mode</span>
                  <span className="text-[#C9A24D] font-black">
                    {system.mode}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 p-12 sm:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8 lg:hidden">
                <div className="text-[#C9A24D]">{system.icon}</div>
                <div className="h-[1px] flex-1 bg-stone-100"></div>
              </div>

              <p className="text-[#0B1C2D] text-xl font-light mb-12 leading-relaxed">
                {system.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[#C9A24D] mb-6">
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-3">
                    {system.outcomes.map((o, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-stone-500"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#C9A24D]"></span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={() => onViewProgram(system.id)}
                  className="px-10 py-5 bg-[#0B1C2D] text-[#C9A24D] text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all rounded-full"
                >
                  View System Details
                </button>
                <button
                  onClick={() => onApply(system.id)}
                  className="px-10 py-5 border border-[#0B1C2D]/10 text-[#0B1C2D] text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#0B1C2D] hover:text-[#C9A24D] transition-all rounded-full"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSystems;
