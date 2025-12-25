
import React, { useState } from 'react';
import { Resource } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

const Resources: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState<string | null>(null);

  const resources: Resource[] = [
    { 
      id: '1', 
      title: 'Understanding Apostolic Mandate', 
      category: 'Teaching', 
      author: 'Dr. Johnathan Cross',
      date: '2024-05-15', 
      summary: 'A deep dive into the primary functions of the modern apostle and the weights of governance.',
      fullText: 'Apostolic mandate is defined not by title but by territory. In this teaching, we explore the four weights of governance: Spiritual Authority, Jurisdictional Oversight, Doctrinal Integrity, and Ministerial Succession. To carry an apostolic mandate is to become a master builder, aligning people with the divine pattern shown on the mount.'
    },
    { 
      id: '2', 
      title: 'The Cost of Discipleship', 
      category: 'Article', 
      author: 'Elder Marcus Vane',
      date: '2024-06-01', 
      summary: 'Exploring the sacrificial nature of apostolic formation and institutional alignment.',
      fullText: 'Discipleship in an apostolic environment is inherently costly. It requires the stripping away of individualism for the sake of institutional weight. We do not form individual stars; we form a collective company. This alignment requires a submission of vision to the corporate mandate, ensuring that the legacy outlives the builder.'
    },
    { 
      id: '3', 
      title: '2025 Academic Calendar', 
      category: 'Download', 
      author: 'Campus Administration',
      date: '2024-11-20', 
      summary: 'Comprehensive overview of cohort start dates, intensives, and synod gatherings for 2025.',
      fullText: 'The 2025 Academic Cycle begins with the Nexus Induction in February. Following this, the Praxis Cohort will engage in the souls-formation intensive during the second quarter. The year concludes with the Ekballo Deployment Lab, where students are assigned to territorial projects globally.'
    },
    { 
      id: '4', 
      title: 'Leading in Volatile Times', 
      category: 'Article', 
      author: 'Leadership Council',
      date: '2024-04-10', 
      summary: 'Strategic guidance on maintaining apostolic order in a rapidly shifting global landscape.',
      fullText: 'Volatility is the native environment of the apostle. To lead in such times requires an unshakeable inner governance. When systems fail, the apostolic structure must remain. This briefing covers the strategic implementation of internal peace, territorial mapping under pressure, and the maintenance of doctrinal clarity when the world is in chaos.'
    },
  ];

  const playAudioBriefing = async (res: Resource) => {
    if (isBriefingLoading) return;
    setIsBriefingLoading(res.id);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with institutional authority and spiritual weight: This is an SFATH Apostolic Briefing of "${res.title}" by ${res.author}. ${res.fullText || res.summary}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        setIsPlaying(res.id);
        source.onended = () => setIsPlaying(null);
        source.start();
      }
    } catch (error) {
      console.error("Audio Briefing Failed:", error);
    } finally {
      setIsBriefingLoading(null);
    }
  };

  // Helper functions for Audio
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-[#F9F9F7]">
      <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="max-w-2xl">
          <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] mb-6 font-black">Knowledge Base</p>
          <h1 className="text-5xl sm:text-7xl font-black text-[#0B1C2D] mb-8">The <span className="italic font-serif text-[#C9A24D]">Vault</span></h1>
          <p className="text-stone-500 font-light text-xl leading-relaxed">
            Curated teachings, articles, and institutional downloads for apostolic maturation.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {['All', 'Teachings', 'Articles', 'Downloads'].map(cat => (
            <button key={cat} className="px-8 py-3 text-[10px] uppercase tracking-widest border border-stone-200 hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all rounded-full bg-white font-black">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {resources.map((res) => (
          <div key={res.id} className="group p-12 bg-white border border-stone-100 hover:border-[#C9A24D]/30 transition-all duration-500 shadow-xl hover:shadow-[#C9A24D]/5 rounded-3xl cursor-pointer flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <span className={`text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full font-black ${
                res.category === 'Download' ? 'bg-blue-50 text-blue-700' :
                res.category === 'Teaching' ? 'bg-[#C9A24D]/10 text-[#C9A24D]' :
                'bg-stone-50 text-stone-500'
              }`}>
                {res.category}
              </span>
              <div className="flex items-center gap-4">
                 {res.category !== 'Download' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); playAudioBriefing(res); }}
                      className={`flex items-center gap-2 text-[8px] uppercase tracking-widest font-black transition-all ${isPlaying === res.id ? 'text-emerald-500' : 'text-[#C9A24D] hover:text-[#0B1C2D]'}`}
                    >
                       {isBriefingLoading === res.id ? (
                         <span className="animate-pulse">Loading Briefing...</span>
                       ) : isPlaying === res.id ? (
                         <span className="flex items-center gap-2">
                           <span className="flex gap-0.5 h-2 items-end">
                              <span className="w-0.5 h-full bg-emerald-500 animate-bounce"></span>
                              <span className="w-0.5 h-1/2 bg-emerald-500 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                              <span className="w-0.5 h-3/4 bg-emerald-500 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                           </span>
                           Broadcasting...
                         </span>
                       ) : (
                         <>
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zm6.364-1.636a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM15 11a1 1 0 100-2 1 1 0 000 2z"/></svg>
                           Listen to Briefing
                         </>
                       )}
                    </button>
                 )}
                 <span className="text-[10px] text-stone-300 font-black tracking-widest">{res.date}</span>
              </div>
            </div>
            <h3 className="text-3xl font-cinzel font-black text-[#0B1C2D] mb-6 group-hover:text-[#C9A24D] transition-colors">{res.title}</h3>
            <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-black mb-4">By {res.author}</p>
            <p className="text-stone-500 font-light leading-relaxed mb-12">
              {res.summary}
            </p>
            <button className="mt-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#0B1C2D] font-black group-hover:text-[#C9A24D] transition-all">
              {res.category === 'Download' ? 'Download Assets' : 'Access Content'}
              <span className="text-xl">→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-32 p-16 bg-[#0B1C2D] rounded-3xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A24D]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-cinzel font-black text-white mb-6">Join the Mandate Briefing</h3>
          <p className="text-stone-400 text-lg mb-12 font-light max-w-xl mx-auto">Receive quarterly apostolic teachings and strategic campus alerts directly in your inbox.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              className="flex-1 bg-white/5 border border-white/10 px-8 py-5 text-white placeholder-stone-600 rounded-full focus:ring-1 focus:ring-[#C9A24D] outline-none"
            />
            <button className="bg-[#C9A24D] text-[#0B1C2D] px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all rounded-full">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
