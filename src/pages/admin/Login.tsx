import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiShield, FiLock } from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-2xl shadow-lg shadow-teal-900/40 mb-4">
            R
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Resulta Admin</h1>
          <p className="text-sm text-slate-400 mt-2">Sign in to the control center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email
            </label>
            <div className="relative flex items-center rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <FiShield className="absolute left-3.5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@resulta.com.gh"
                className="w-full bg-transparent px-3.5 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <FiLock className="absolute left-3.5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent px-3.5 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-teal-900/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-teal-400 transition-colors">
            &larr; Back to Resulta Homepage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;