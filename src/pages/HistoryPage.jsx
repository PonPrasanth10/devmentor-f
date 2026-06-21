import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviewHistory, deleteReview, getReview } from '../api/reviewApi';
import { getPlanHistory, deletePlan, getPlan } from '../api/planApi';
import ReviewResult from '../components/review/ReviewResult';
import PlanOutput from '../components/planner/PlanOutput';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <h2 className="font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [tab, setTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type, data }
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [r, p] = await Promise.all([getReviewHistory(), getPlanHistory()]);
      setReviews(r.data.reviews);
      setPlans(p.data.plans);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleDeleteReview = async (id, e) => {
    e.stopPropagation();
    await deleteReview(id);
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  const handleDeletePlan = async (id, e) => {
    e.stopPropagation();
    await deletePlan(id);
    setPlans(prev => prev.filter(p => p._id !== id));
  };

  const openReview = async (id) => {
    setModalLoading(true);
    setModal({ type: 'review', data: null });
    const res = await getReview(id);
    setModal({ type: 'review', data: res.data.review });
    setModalLoading(false);
  };

  const openPlan = async (id) => {
    setModalLoading(true);
    setModal({ type: 'plan', data: null });
    const res = await getPlan(id);
    setModal({ type: 'plan', data: res.data.plan });
    setModalLoading(false);
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const scoreColor = (score) =>
    score >= 7 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-red-400';

  const scoreBg = (score) =>
    score >= 7 ? 'bg-green-400/10 border-green-400/20' : score >= 4 ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-red-400/10 border-red-400/20';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <div className="flex gap-2">
          <Link to="/review" className="text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors">
            + New Review
          </Link>
          <Link to="/planner" className="text-xs px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors">
            + New Plan
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['reviews', 'plans'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {t === 'reviews' ? '🔍' : '🗺️'} {t} {!loading && `(${t === 'reviews' ? reviews.length : plans.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-20 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tab === 'reviews' ? (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400 font-medium">No reviews yet</p>
              <p className="text-gray-600 text-sm mt-1 mb-4">Start reviewing code to see your history here.</p>
              <Link to="/review" className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors">
                Review some code →
              </Link>
            </div>
          ) : reviews.map(review => (
            <div
              key={review._id}
              onClick={() => openReview(review._id)}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-2xl shrink-0">🔍</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-gray-800 border border-gray-700 rounded font-mono text-gray-400 uppercase">
                      {review.language}
                    </span>
                    {review.result?.quality_score != null && (
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${scoreColor(review.result.quality_score)} ${scoreBg(review.result.quality_score)}`}>
                        Score: {review.result.quality_score}/10
                      </span>
                    )}
                    {review.result?.complexity && (
                      <span className="text-xs px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-400 capitalize">
                        {review.result.complexity} complexity
                      </span>
                    )}
                  </div>
                  {review.result?.summary && (
                    <p className="text-xs text-gray-500 truncate max-w-lg">{review.result.summary}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">{timeAgo(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">View →</span>
                <button
                  onClick={(e) => handleDeleteReview(review._id, e)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {plans.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-gray-400 font-medium">No plans yet</p>
              <p className="text-gray-600 text-sm mt-1 mb-4">Generate a project plan to see it here.</p>
              <Link to="/planner" className="text-sm px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors">
                Plan a project →
              </Link>
            </div>
          ) : plans.map(plan => (
            <div
              key={plan._id}
              onClick={() => openPlan(plan._id)}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-2xl shrink-0">🗺️</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white mb-0.5 truncate">
                    {plan.result?.projectName || 'Project Plan'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-lg">{plan.prompt}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {plan.result?.architecture && (
                      <span className="text-xs px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded">
                        {plan.result.architecture}
                      </span>
                    )}
                    <span className="text-xs text-gray-600">{timeAgo(plan.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">View →</span>
                <button
                  onClick={(e) => handleDeletePlan(plan._id, e)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {modal && (
        <Modal
          title={modal.type === 'review' ? '🔍 Code Review' : '🗺️ Project Plan'}
          onClose={() => setModal(null)}
        >
          {modalLoading || !modal.data ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
            </div>
          ) : modal.type === 'review' ? (
            <ReviewResult result={modal.data.result} />
          ) : (
            <PlanOutput plan={modal.data.result} />
          )}
        </Modal>
      )}
    </div>
  );
}
