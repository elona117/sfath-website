import React from 'react';

const About: React.FC = () => {
  const values = [
    {
      title: 'Word & Spirit',
      desc: 'Refusing to divorce the written Word from the active Spirit.',
    },
    {
      title: 'Character First',
      desc: 'Believing anointing without character is a tragedy waiting to happen.',
    },
    {
      title: 'Covenant',
      desc: 'Building families, not just organizations. Loyalty is our currency.',
    },
    {
      title: 'Excellence',
      desc: 'Representing the King; mediocrity is not an option.',
    },
  ];

  return (
    <div className="bg-[#F9F9F7]">
      <section className="pt-32 pb-24 px-6 border-b border-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black mb-8">
            Vision & Ethos
          </p>
          <h1 className="text-5xl sm:text-7xl font-black text-[#0B1C2D] mb-12 leading-none">
            Restoring the{' '}
            <span className="italic font-serif text-[#C9A24D]">
              Ancient Foundations
            </span>
          </h1>
          <p className="text-stone-500 text-xl sm:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
            We are building a habitation for the Spirit and a launchpad for
            apostolic reformation.
          </p>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-square bg-stone-100 rounded-3xl overflow-hidden border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1511140595130-9c3917818973?q=80&w=2000"
                alt="Habitation"
                className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-[4/3] bg-[#0B1C2D] p-12 text-white shadow-2xl rounded-2xl hidden md:block">
              <p className="font-serif italic text-2xl text-[#C9A24D] mb-4">
                "The faith once for all delivered..."
              </p>
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Jude 1:3
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-cinzel font-black text-[#0B1C2D]">
                The Vision
              </h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed">
                To see a global company of Spirit-filled apostles raised to
                advance the Kingdom with power, purity, and proper alignment.
                SFATH is a formation center dedicated to the "faith once for all
                delivered to the saints."
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-stone-100">
              <h3 className="text-xs uppercase tracking-[0.4em] font-black text-[#C9A24D]">
                Our DNA (Core Values)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {values.map((v, i) => (
                  <div key={i}>
                    <h4 className="font-cinzel font-black text-[#0B1C2D] mb-2">
                      {v.title}
                    </h4>
                    <p className="text-sm text-stone-500 font-light leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
