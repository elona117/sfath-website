import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
  error?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin,
  onCancel,
  error,
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white border border-stone-100 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Decorative gold stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C9A24D]"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#0B1C2D] text-[#C9A24D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-cinzel font-black text-[#0B1C2D] mb-2">
              Governance Login
            </h2>
            <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-bold">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-stone-500 font-black mb-3 text-center">
                Enter Institutional Credential
              </label>
              <input
                type="password"
                autoFocus
                className="w-full bg-stone-50 border border-stone-100 p-5 rounded-2xl text-center text-lg tracking-[0.5em] focus:ring-2 focus:ring-[#C9A24D] outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {error && (
                <p className="text-rose-600 text-[10px] uppercase tracking-widest font-black text-center mt-4">
                  {error}
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-5 bg-[#0B1C2D] text-[#C9A24D] text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.02] transition-all shadow-xl"
              >
                Access Command Center
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-4 text-stone-400 text-[9px] font-black uppercase tracking-widest hover:text-stone-600 transition-colors"
              >
                Cancel Access
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-stone-50 text-center">
            <p className="text-[9px] text-stone-300 uppercase tracking-widest italic">
              "Order is the First Law of the Kingdom"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
