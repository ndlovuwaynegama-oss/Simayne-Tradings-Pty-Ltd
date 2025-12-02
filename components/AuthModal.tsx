import React, { useState, useEffect } from 'react';
import { XIcon, UserIcon, LockClosedIcon, MailIcon, SparklesIcon } from './Icons';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialView?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialView = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Reset view mode when modal opens or initialView changes
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialView === 'login');
      setError(null);
      // Reset form data on open/view switch if needed, keeping simple for now
    }
  }, [isOpen, initialView]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Special char
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!isLogin) {
        if (!formData.confirmPassword) {
            setError("Please confirm your password.");
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        if (passwordStrength < 2) {
           setError("Please choose a stronger password.");
           setLoading(false);
           return;
        }
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Mock successful login/signup
      const user: User = {
        name: isLogin ? (formData.email.split('@')[0]) : formData.name,
        email: formData.email
      };
      onLogin(user);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-6 text-center border-b border-white/5">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                <XIcon className="h-6 w-6" />
            </button>
            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                <SparklesIcon className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
                {isLogin ? 'Welcome Back' : 'Join Simayne'}
            </h2>
            <p className="text-slate-400 text-sm">
                {isLogin ? 'Sign in to access your dashboard' : 'Create an account to start sourcing'}
            </p>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
                        />
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {!isLogin && formData.password && (
                        <div className="pt-2 animate-fade-in">
                            <div className="flex gap-1 h-1.5 mb-1">
                                {[1, 2, 3, 4].map((step) => (
                                    <div 
                                        key={step}
                                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                                            step <= passwordStrength 
                                                ? (passwordStrength <= 1 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500')
                                                : 'bg-slate-700'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] text-slate-500">Min 6 chars</span>
                                <span className={`text-[10px] font-medium transition-colors ${
                                    passwordStrength <= 1 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                    {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 3 ? 'Fair' : 'Strong'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password Field */}
                {!isLogin && (
                    <div className="space-y-1 animate-fade-in">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs text-center animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:transform-none mt-2"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             Processing...
                        </span>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(null); setFormData({...formData, confirmPassword: ''}); }}
                        className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;