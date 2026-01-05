import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  onLoginSuccess: () => void; // Called when login works
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Login successful!
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1C2D] px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-4xl font-black text-[#0B1C2D] mb-8 text-center">
          Chancery Access
        </h2>

        {error && (
          <p className="text-rose-600 mb-6 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24D] text-sm"
              placeholder="admin@sfath.org"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24D] text-sm"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all ${
              loading
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-[#C9A24D] text-[#0B1C2D] hover:bg-[#b58f3e] shadow-lg'
            }`}
          >
            {loading ? 'Authenticating...' : 'Enter Chancery'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          Contact the Chancery for credentials.
        </p>
      </div>
    </div>
  );
};

export default Login;