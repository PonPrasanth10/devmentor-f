import { useState } from 'react';
import PlanOutput from '../components/planner/PlanOutput';
import { createPlan } from '../api/planApi';

const EXAMPLES = [
  'Build a MERN e-commerce app with Stripe payments and an admin dashboard',
  'Create a real-time chat application with React and Socket.IO',
  'Build a SaaS todo app with team workspaces, JWT auth, and Stripe subscriptions',
  'Create a job board platform with employer and candidate roles',
  'Build a personal finance tracker with charts and recurring transactions'
];

const loadingSteps = [
  'Understanding your project requirements...',
  'Designing system architecture...',
  'Planning database schema...',
  'Generating API endpoints...',
  'Building project timeline...'
];

export default function PlannerPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const handlePlan = async () => {
    if (!prompt.trim()) { setError('Please describe your project'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 3000);

    try {
      const res = await createPlan(prompt);
      setResult(res.data.plan);
    } catch (err) {
      setError(err.response?.data?.message || 'Planning failed. Try again.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Project Planner</h1>
        <p className="text-gray-400 text-sm mt-1">
          Describe your app idea and get a complete architecture, schema, API plan, and timeline.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What are you building?
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="e.g. Build a MERN e-commerce app with Stripe payments, product listings, and an admin dashboard..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center">Try:</span>
            {EXAMPLES.slice(0, 3).map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="text-xs px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-teal-300 hover:border-teal-500/50 transition-colors"
              >
                {ex.slice(0, 38)}…
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-600 shrink-0 ml-2">{prompt.length} chars</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
            <span>⚠️</span> {error}
          </div>
        )}

        <button
          onClick={handlePlan}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating plan...</>
          ) : '🗺️ Generate Project Plan'}
        </button>
      </div>

      {/* Loading steps */}
      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4 mb-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto" />
          <div>
            <p className="text-white font-medium">{loadingSteps[loadingStep]}</p>
            <p className="text-gray-500 text-sm mt-1">This usually takes 10–25 seconds</p>
          </div>
          <div className="flex justify-center gap-1.5">
            {loadingSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= loadingStep ? 'w-6 bg-teal-500' : 'w-1.5 bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-3">
          <div className="text-5xl">🗺️</div>
          <p className="text-white font-medium">Your project plan will appear here</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Describe your project above and click <span className="text-teal-400">Generate Project Plan</span>.
            You'll get a full architecture, DB schema, API routes, and a week-by-week timeline.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {['Tech Stack', 'Folder Structure', 'DB Schema', 'API Plan', 'Timeline', 'Deployment'].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {result && <PlanOutput plan={result.result} />}
    </div>
  );
}
