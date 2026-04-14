import { useState } from 'react';
import { api } from '../services/api';
import { UserPlus, Mail, Lock, User, Camera, Image as ImageIcon, Sun, Moon, ShieldCheck } from 'lucide-react';

export default function Register({ onLogin, setPage, darkMode, setDarkMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const bundle = new FormData();
    bundle.append('Email', formData.email);
    bundle.append('Password', formData.password);
    bundle.append('FirstName', formData.firstName);
    bundle.append('LastName', formData.lastName);
    if (file) bundle.append('ProfileImage', file);

    try {
      const data = await api.register(bundle);
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
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Join Us</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Create your social profile</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm text-center font-medium">{error}</div>}

        <div className="flex justify-center pb-2">
          <label className="group relative cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-primary overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 transition-all">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                <Camera className="text-slate-400 dark:text-slate-600 group-hover:text-primary" size={32} />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-primary/80 p-2 rounded-full text-white"><ImageIcon size={16} /></div>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              placeholder="First Name"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="relative group">
            <input 
              placeholder="Last Name"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Confirm Password"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Create Account'}
        </button>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          Already have an account? 
          <button 
            type="button" 
            onClick={() => setPage('login')}
            className="text-primary ml-1 hover:underline font-bold"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
