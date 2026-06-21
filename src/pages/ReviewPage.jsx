import { useState } from 'react';
import CodeEditor from '../components/review/CodeEditor';
import LanguageSelector from '../components/review/LanguageSelector';
import ReviewResult from '../components/review/ReviewResult';
import { createReview } from '../api/reviewApi';

const tips = [
  'Paste real code for better results — the more context, the more accurate the review.',
  'Include the full function or class, not just a snippet.',
  'Works best with 20–200 lines of code.',
  'Try reviewing authentication, API handlers, or database queries for security insights.'
];

export default function ReviewPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = async () => {
    if (!code.trim()) { setError('Please paste some code to review'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await createReview(code, language);
      setResult(res.data.review);
    } catch (err) {
      setError(err.response?.data?.message || 'Review failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const charCount = code.length;
  const charLimit = 8000;
  const charPct = Math.min((charCount / charLimit) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Code Reviewer</h1>
        <p className="text-gray-400 text-sm mt-1">
          Paste your code and get AI-powered feedback on bugs, security, performance, and best practices.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <LanguageSelector value={language} onChange={setLanguage} />
          <CodeEditor value={code} onChange={setCode} language={language} />

          {/* Char counter */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className={charCount > charLimit * 0.9 ? 'text-yellow-400' : ''}>
              {charCount.toLocaleString()} / {charLimit.toLocaleString()} characters
            </span>
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${charPct > 90 ? 'bg-yellow-400' : 'bg-violet-500'}`}
                style={{ width: `${charPct}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            onClick={handleReview}
            disabled={loading || charCount === 0}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Analyzing...</>
            ) : '🔍 Review Code'}
          </button>

          {/* Tips */}
          {!result && !loading && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">💡 Tips for best results</p>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-500 flex gap-2">
                    <span className="text-violet-500 shrink-0">→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Output Panel — sticky so it stays in view while editor scrolls */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center min-h-64 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500" />
              <div>
                <p className="text-white font-medium">Analyzing your code...</p>
                <p className="text-gray-500 text-sm mt-1">This takes 5–15 seconds</p>
              </div>
            </div>
          ) : result ? (
            <ReviewResult result={result.result} />
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center min-h-64 space-y-3">
              <div className="text-5xl">🤖</div>
              <p className="text-white font-medium">Ready to review</p>
              <p className="text-gray-500 text-sm max-w-xs">
                Paste your code on the left and click <span className="text-violet-400">Review Code</span> to get detailed AI feedback.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Bugs', 'Security', 'Performance', 'Best Practices'].map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
