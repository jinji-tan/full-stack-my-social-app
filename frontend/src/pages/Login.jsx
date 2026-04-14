import { useState } from 'react';
import { api } from '../services/api';
import { LogIn, Mail, Lock, UserPlus, Sun, Moon } from 'lucide-react';

export default function Login({ onLogin, setPage, darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all duration-300">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
             <button 
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 transition-all group"
            >
              {darkMode ? (
                <Sun size={32} className="group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={32} className="group-hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Connect with your community</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm text-center font-medium">{error}</div>}

        <div className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          New here? 
          <button 
            type="button" 
            onClick={() => setPage('register')}
            className="text-primary ml-1 hover:underline font-bold"
          >
            Create account
          </button>
        </p>
      </form>
    </div>
  );
}
