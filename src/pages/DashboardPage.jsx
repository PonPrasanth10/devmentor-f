import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getReviewHistory } from '../api/reviewApi';
import { getPlanHistory } from '../api/planApi';

const features = [
  {
    icon: '🔍',
    title: 'AI Code Reviewer',
    description: 'Detect bugs, security vulnerabilities, and performance issues instantly.',
    to: '/review',
    color: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5',
    badge: 'Popular',
    badgeColor: 'bg-violet-500/20 text-violet-300'
  },
  {
    icon: '🗺️',
    title: 'AI Project Planner',
    description: 'Generate full architecture, DB schema, API plan, and timeline from a description.',
    to: '/planner',
    color: 'border-teal-500/30 hover:border-teal-500/60 hover:bg-teal-500/5',
    badge: 'New',
    badgeColor: 'bg-teal-500/20 text-teal-300'
  },
  {
    icon: '📋',
    title: 'History',
    description: 'Browse and revisit all your past code reviews and project plans.',
    to: '/history',
    color: 'border-gray-600/30 hover:border-gray-500/60 hover:bg-gray-800/50',
    badge: null
  }
];

const highlights = [
  { icon: '⚡', label: 'Instant Analysis', sub: 'Results in seconds' },
  { icon: '🔒', label: 'Security Scanning', sub: 'OWASP-aware checks' },
  { icon: '📐', label: 'Architecture Plans', sub: 'Full project blueprints' },
  { icon: '🌐', label: 'Multi-language', sub: '20+ languages supported' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ reviews: 0, plans: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.all([getReviewHistory(1), getPlanHistory(1)])
      .then(([r, p]) => {
        setStats({ reviews: r.data.pagination.total, plans: p.data.pagination.total });
        setRecentReviews(r.data.reviews.slice(0, 3));
        setRecentPlans(p.data.plans.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Hero */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
              AI-Powered
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mt-3">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Your AI-powered developer toolkit. Review code, plan projects, and ship better software faster.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              to="/review"
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              🔍 Review Code
            </Link>
            <Link
              to="/planner"
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700"
            >
              🗺️ Plan a Project
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Code Reviews', value: loadingStats ? '—' : stats.reviews, icon: '🔍', color: 'text-violet-400' },
          { label: 'Project Plans', value: loadingStats ? '—' : stats.plans, icon: '🗺️', color: 'text-teal-400' },
          { label: 'Languages', value: '20+', icon: '🌐', color: 'text-blue-400' },
          { label: 'AI Models', value: '3', icon: '🤖', color: 'text-amber-400' }
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className={`bg-gray-900 border ${card.color} rounded-xl p-6 transition-all group`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                {card.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-violet-300 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity + Highlights */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recent Activity</h2>
            <Link to="/history" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
          </div>

          {loadingStats ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentReviews.length === 0 && recentPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">No activity yet.</p>
              <p className="text-gray-600 text-xs mt-1">Start by reviewing some code or planning a project.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentReviews.map(r => (
                <div key={r._id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <span className="text-base">🔍</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">Code Review</p>
                    <p className="text-xs text-gray-500 flex gap-2">
                      <span className="uppercase">{r.language}</span>
                      <span>·</span>
                      <span className={r.result?.quality_score >= 7 ? 'text-green-400' : r.result?.quality_score >= 4 ? 'text-yellow-400' : 'text-red-400'}>
                        Score: {r.result?.quality_score ?? 'N/A'}/10
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">{timeAgo(r.createdAt)}</span>
                </div>
              ))}
              {recentPlans.map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <span className="text-base">🗺️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{p.result?.projectName || 'Project Plan'}</p>
                    <p className="text-xs text-gray-500 truncate">{p.prompt}</p>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">{timeAgo(p.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlights */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">What You Get</h2>
          <div className="grid grid-cols-2 gap-3">
            {highlights.map(h => (
              <div key={h.label} className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-2">{h.icon}</div>
                <p className="text-sm font-medium text-white">{h.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{h.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-violet-500/10 to-teal-500/10 border border-violet-500/20 rounded-lg">
            <p className="text-sm text-gray-300 font-medium">Powered by Groq LPU™</p>
            <p className="text-xs text-gray-500 mt-1">Ultra-fast inference with Llama 3.3, Qwen 2.5, and Mixtral models.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
