
import React from 'react';

const Mandate: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="mb-20 text-center">
        <p className="text-amber-700 uppercase tracking-[0.4em] text-[10px] mb-4">Vision & Strategy</p>
        <h1 className="text-5xl font-bold text-stone-900 mb-8">The Mandate</h1>
        <div className="w-24 h-[2px] bg-amber-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-2xl font-serif text-stone-800">The Call to Order</h2>
          <p className="text-stone-600 font-light leading-relaxed">
            SFATH (Successive Formation for Apostolic Transformation of Hearts) was birthed from a realization that the modern church often prioritizes enthusiasm over execution, and inspiration over infrastructure.
          </p>
          <p className="text-stone-600 font-light leading-relaxed">
            Our mandate is to restore the "Code of Order" – a biblical framework where leadership is not defined by popularity, but by weight, alignment, and faithfulness to the apostolic pattern.
          </p>
        </div>
        <div className="bg-stone-50 p-12 border-l-4 border-amber-600">
          <blockquote className="text-xl font-serif italic text-stone-700">
            "For though you have ten thousand instructors in Christ, yet have you not many fathers."
          </blockquote>
          <p className="mt-4 text-xs uppercase tracking-widest text-stone-400">— 1 Corinthians 4:15</p>
        </div>
      </div>

      <div className="mt-32">
        <h3 className="text-center text-xs uppercase tracking-[0.3em] text-stone-400 mb-16">Institutional Distinctives</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="border-t border-stone-100 pt-8">
            <h4 className="text-amber-800 uppercase text-[10px] tracking-widest mb-4">01. Spirit-Led Governance</h4>
            <p className="text-sm text-stone-500 font-light">Movement that is strictly structured yet completely yielding to the promptings of the Spirit.</p>
          </div>
          <div className="border-t border-stone-100 pt-8">
            <h4 className="text-amber-800 uppercase text-[10px] tracking-widest mb-4">02. Apostolic Doctrine</h4>
            <p className="text-sm text-stone-500 font-light">Commitment to the foundational teachings of the apostles, stripped of modern cultural dilution.</p>
          </div>
          <div className="border-t border-stone-100 pt-8">
            <h4 className="text-amber-800 uppercase text-[10px] tracking-widest mb-4">03. Structured Accountability</h4>
            <p className="text-sm text-stone-500 font-light">Leaders who are mentored, evaluated, and held to the highest standard of spiritual integrity.</p>
          </div>
          <div className="border-t border-stone-100 pt-8">
            <h4 className="text-amber-800 uppercase text-[10px] tracking-widest mb-4">04. Practical Deployment</h4>
            <p className="text-sm text-stone-500 font-light">Theory combined with active assignment. We don't just teach leaders; we send them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mandate;
