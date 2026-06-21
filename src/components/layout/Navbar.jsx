import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/review', label: 'Code Review' },
  { to: '/planner', label: 'Planner' },
  { to: '/history', label: 'History' }
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-violet-400 shrink-0">
            <span>🤖</span>
            <span>DevMentor AI</span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm rounded-md bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 space-y-1">
          {user && navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-800 mt-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-violet-400">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
