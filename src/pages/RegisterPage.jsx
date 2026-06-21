import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const perks = [
  { icon: '✅', text: 'Free to use — no credit card required' },
  { icon: '🔍', text: 'Unlimited AI code reviews' },
  { icon: '🗺️', text: 'Full project architecture generation' },
  { icon: '📋', text: 'Review & plan history saved forever' }
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center px-4">

        {/* Left — Branding */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold text-violet-400">DevMentor AI</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Your AI pair programmer<br />starts here.
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Join developers using AI to write cleaner, safer, and more scalable code.
          </p>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-base w-6 shrink-0">{p.icon}</span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Form */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-sm text-gray-500 mb-7">Free forever. No credit card needed.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} required autoComplete="name"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} required autoComplete="email"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={form.password}
                  onChange={handleChange} required minLength={6} autoComplete="new-password"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="Min. 6 characters"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creating account...</>
                ) : 'Create account →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
