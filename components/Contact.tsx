
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API dispatch
    console.log('Dispatching Inquiry:', formData);
    
    // Clear the form
    setFormData({
      name: '',
      email: '',
      type: 'General Inquiry',
      message: ''
    });
    
    // Show success
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F9F9F7] py-24 px-6 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center w-full">
        <div className="space-y-16 animate-reveal">
          <div className="space-y-6">
            <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black">Connect</p>
            <h1 className="text-6xl sm:text-8xl font-black text-[#0B1C2D] leading-none">Apostolic <span className="italic font-serif text-[#C9A24D]">Inquiry</span></h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#C9A24D]">Physical Location</h4>
              <p className="text-stone-500 font-light leading-relaxed">
                123 Kingdom Way, City of Faith.<br />
                Global Administration Hub.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#C9A24D]">Direct Channels</h4>
              <p className="text-stone-500 font-light leading-relaxed">
                info@sfath.org<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          <div className="space-y-12 pt-12 border-t border-stone-100">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#0B1C2D] mb-6">Digital Footprint</h4>
              <div className="flex flex-wrap gap-8">
                {[
                  { name: 'Facebook', icon: 'FB' },
                  { name: 'Instagram', icon: 'IG' },
                  { name: 'YouTube', icon: 'YT' },
                  { name: 'X (Twitter)', icon: 'X' }
                ].map((social) => (
                  <a key={social.name} href="#" className="group flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[10px] font-black text-stone-400 group-hover:bg-[#0B1C2D] group-hover:text-[#C9A24D] group-hover:border-[#0B1C2D] transition-all duration-500">
                      {social.icon}
                    </div>
                    <span className="text-[7px] uppercase tracking-[0.3em] font-black text-stone-300 group-hover:text-[#0B1C2D] transition-colors">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#0B1C2D]">Institutional Partnerships</h4>
              <p className="text-stone-400 text-sm font-light leading-relaxed max-w-sm">
                We are open to dialogue with like-minded networks seeking doctrinal alignment or curriculum licensing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 sm:p-16 shadow-2xl rounded-3xl border border-stone-100 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8 animate-reveal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-black mb-3">Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-stone-50 border-none p-5 rounded-2xl text-sm focus:ring-1 focus:ring-[#C9A24D] outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-black mb-3">Inquiry Type</label>
                  <select 
                    className="w-full bg-stone-50 border-none p-5 rounded-2xl text-sm focus:ring-1 focus:ring-[#C9A24D] outline-none transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Admissions Question</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-black mb-3">Email Address</label>
                <input 
                  type="email" required
                  className="w-full bg-stone-50 border-none p-5 rounded-2xl text-sm focus:ring-1 focus:ring-[#C9A24D] outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-black mb-3">Message</label>
                <textarea 
                  rows={6} required
                  className="w-full bg-stone-50 border-none p-5 rounded-2xl text-sm focus:ring-1 focus:ring-[#C9A24D] outline-none resize-none transition-all"
                  placeholder="Detail your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-6 bg-[#0B1C2D] text-[#C9A24D] text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-[#C9A24D] hover:text-[#0B1C2D] transition-all shadow-xl"
              >
                Dispatch Inquiry
              </button>
            </form>
          ) : (
            <div className="text-center space-y-8 animate-reveal">
              <div className="w-20 h-20 bg-[#C9A24D]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8 text-[#0B1C2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-3xl font-cinzel font-black text-[#0B1C2D]">Dispatch Successful</h2>
              <p className="text-stone-500 font-light leading-relaxed">
                Your inquiry has been relayed to the Administrative Chancery. A representative will provide a response within the appropriate governance timeframe.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C9A24D] border-b border-[#C9A24D] pb-1 hover:text-[#0B1C2D] hover:border-[#0B1C2D] transition-all"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
