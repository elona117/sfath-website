
import React from 'react';

const Leadership: React.FC = () => {
  const council = [
    { name: 'Dr. Johnathan Cross', role: 'Lead Apostle', specialism: 'Ecclesial Governance & Strategy', bio: 'Carrying a mandate to build people and plant churches with 25+ years of experience in 40+ nations.' },
    { name: 'Apostle Sarah Jenkins', role: 'Doctrinal Integrity', specialism: 'Systematic Formation', bio: 'Safeguarding the ancient foundations through rigorous theological oversight.' },
    { name: 'Elder Marcus Vane', role: 'Strategic Planning', specialism: 'Territorial Mission', bio: 'Architect of campus deployment labs and marketplace alignment.' },
    { name: 'Rev. Helena Thorne', role: 'Pastoral Care', specialism: 'Apostolic Ethics', bio: 'Providing covering and soul-care for the SFATH student body and alumni.' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <section className="pt-40 pb-24 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black mb-8">Governance</p>
          <h1 className="text-6xl md:text-8xl font-black text-[#0B1C2D] mb-12 leading-none">Healthy <span className="italic font-serif text-[#C9A24D]">Authority</span></h1>
          <p className="text-stone-500 font-light text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed">
            Healthy authority flows from submission, integrity, and covenant relationship. Meet the council providing the covering for SFATH.
          </p>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          {council.map((leader, i) => (
            <div key={i} className="group flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shrink-0 shadow-xl grayscale group-hover:grayscale-0 transition-all duration-1000 relative">
                 <img src={`https://picsum.photos/seed/${leader.name}/800/1000`} alt={leader.name} className="w-full h-full object-cover" />
                 <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a href="#" className="w-8 h-8 bg-[#0B1C2D] text-[#C9A24D] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 bg-[#0B1C2D] text-[#C9A24D] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                 </div>
              </div>
              <div className="flex flex-col justify-center h-full">
                <p className="text-[#C9A24D] text-[10px] uppercase tracking-[0.4em] font-black mb-2">{leader.role}</p>
                <h3 className="text-3xl font-cinzel font-black text-[#0B1C2D] mb-4">{leader.name}</h3>
                <p className="text-stone-400 text-[9px] uppercase tracking-widest font-bold mb-6">{leader.specialism}</p>
                <p className="text-stone-500 font-light text-sm leading-relaxed mb-8">
                  {leader.bio}
                </p>
                <button className="text-[10px] uppercase tracking-[0.3em] font-black text-[#0B1C2D] border-b border-[#C9A24D] pb-1 w-fit group-hover:text-[#C9A24D] transition-all">
                  Full Biography
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-40 bg-[#0B1C2D] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-12 text-[#C9A24D] leading-relaxed italic">
            " Healthy authority is not a title; it is a weight earned through years of alignment and faithful deployment."
          </h2>
          <div className="flex flex-wrap justify-center gap-16 opacity-30">
             <div className="text-[10px] uppercase tracking-[0.6em] font-black">Apostolic Global Network</div>
             <div className="text-[10px] uppercase tracking-[0.6em] font-black">Council of Plurality</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
