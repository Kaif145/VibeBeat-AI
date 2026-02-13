
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onAuth: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    const role = email.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      role,
      savedSongs: [],
      likedSongs: []
    };

    onAuth(mockUser);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-neutral-900/50 border border-neutral-800 p-8 rounded-[40px] shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-2xl tracking-tighter">V</span>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            {isLogin ? 'Welcome Back' : 'Join VibeBeat'}
          </h2>
          <p className="text-gray-400 text-sm">Discover music through your emotions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-neutral-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-neutral-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-full hover:bg-gray-200 transition mt-4 uppercase tracking-widest text-sm"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest leading-relaxed">
            Hint: Use 'admin@vibebeat.com' to login as Admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
