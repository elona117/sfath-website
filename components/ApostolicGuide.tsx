import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';

interface ApostolicGuideProps {
  onNavigate: (view: ViewState) => void;
}

const ApostolicGuide: React.FC<ApostolicGuideProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'bot'; text: string; timestamp: string }[]
  >([
    {
      role: 'bot',
      text: 'Welcome, seeker of order. I am the Apostolic Guide. How can I assist you in your journey toward Kingdom formation today?',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simple parser to handle **bold** text
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-black text-[#C9A24D]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: userTimestamp }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.text || 'I am the Apostolic Guide. How may I serve you in the way of order?';

      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: botReply, timestamp: botTimestamp }
      ]);
    } catch (error) {
      console.error('Apostolic Guide Error:', error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'The Guide is temporarily unavailable. Please try again shortly.', timestamp: errorTimestamp }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[100] font-inter">
      {isOpen ? (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] h-[80vh] sm:h-[650px] flex flex-col overflow-hidden animate-reveal shadow-[0_40px_120px_rgba(0,0,0,0.4)] glass-dark border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] origin-bottom-right">
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A24D]/30 flex items-center justify-center font-cinzel text-xs sm:text-sm font-black text-[#C9A24D] bg-[#0B1C2D] shadow-xl">
                  AG
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1C2D]"></span>
              </div>
              <div>
                <h4 className="text-white text-xs sm:text-sm font-cinzel font-black tracking-widest leading-none mb-1">
                  Apostolic Guide
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] sm:text-[8px] text-[#C9A24D] uppercase tracking-[0.3em] font-black">
                    Authorized Scribe
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar scroll-smooth bg-gradient-to-b from-transparent to-black/20"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-reveal`}
                style={{ animationDelay: '0.1s' }}
              >
                <div
                  className={`flex flex-col gap-2 max-w-[90%] sm:max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[7px] uppercase tracking-widest text-white/20 font-black px-1">
                    {m.role === 'bot' ? 'Chancery Uplink' : 'Seeker'} • {m.timestamp}
                  </span>
                  <div
                    className={`px-5 py-4 sm:px-6 sm:py-4 text-[12px] sm:text-[13.5px] leading-[1.6] tracking-wide shadow-2xl ${
                      m.role === 'user'
                        ? 'bg-[#C9A24D] text-[#0B1C2D] font-bold rounded-t-[1.5rem] rounded-bl-[1.5rem]'
                        : 'bg-white/5 border border-white/10 text-stone-200 font-light rounded-t-[1.5rem] rounded-br-[1.5rem] backdrop-blur-sm'
                    }`}
                  >
                    {formatText(m.text)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start gap-2">
                <span className="text-[7px] uppercase tracking-widest text-white/30 font-black px-1">
                  Discernment in progress...
                </span>
                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-t-[1.5rem] rounded-br-[1.5rem] flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24D] animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24D] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24D] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 sm:p-8 pt-2 bg-gradient-to-t from-black/40 to-transparent">
            <div className="relative flex items-center group">
              <input
                type="text"
                placeholder="Inquire of the Chancery..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 sm:py-5 px-6 sm:px-8 text-[14px] sm:text-[16px] text-white placeholder-white/20 focus:ring-1 focus:ring-[#C9A24D] focus:bg-white/10 outline-none pr-16 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="absolute right-2.5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C9A24D] text-[#0B1C2D] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(201,162,77,0.4)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>

            <div className="mt-5 flex gap-6 justify-center items-center">
              <button
                onClick={() => {
                  onNavigate('ADMISSIONS');
                  setIsOpen(false);
                }}
                className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-[#C9A24D]/40 hover:text-[#C9A24D] transition-all hover:tracking-[0.5em] active:scale-90"
              >
                Registry
              </button>
              <span className="text-white/10 font-thin">|</span>
              <button
                onClick={() => {
                  onNavigate('TRAINING');
                  setIsOpen(false);
                }}
                className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-[#C9A24D]/40 hover:text-[#C9A24D] transition-all hover:tracking-[0.5em] active:scale-90"
              >
                Systems
              </button>
              <span className="text-white/10 font-thin">|</span>
              <button
                onClick={() => {
                  onNavigate('RESOURCES');
                  setIsOpen(false);
                }}
                className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-[#C9A24D]/40 hover:text-[#C9A24D] transition-all hover:tracking-[0.5em] active:scale-90"
              >
                Vault
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#0B1C2D] text-[#C9A24D] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-[#C9A24D]/30 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#C9A24D]/5 animate-pulse group-hover:bg-[#C9A24D]/15 transition-all"></div>

          <div className="absolute -top-12 right-0 glass-dark border border-white/10 px-5 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-[#C9A24D] shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 hidden sm:block">
            Consult the Guide
          </div>

          <div className="relative flex flex-col items-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[5px] sm:text-[6px] uppercase tracking-widest font-black mt-1 opacity-60">
              Uplink
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ApostolicGuide;