import { useState } from 'react';
import ScoreCard from './ScoreCard';
import CopyButton from '../shared/CopyButton';

const colorMap = {
  red:    { border: 'border-red-500/20',    bg: 'bg-red-500/5',    dot: 'bg-red-400',    tab: 'border-red-500 text-red-400'    },
  orange: { border: 'border-orange-500/20', bg: 'bg-orange-500/5', dot: 'bg-orange-400', tab: 'border-orange-500 text-orange-400' },
  blue:   { border: 'border-blue-500/20',   bg: 'bg-blue-500/5',   dot: 'bg-blue-400',   tab: 'border-blue-500 text-blue-400'   },
  green:  { border: 'border-green-500/20',  bg: 'bg-green-500/5',  dot: 'bg-green-400',  tab: 'border-green-500 text-green-400' }
};

const tabs = [
  { key: 'summary',        label: 'Summary',       icon: '📋', color: null    },
  { key: 'bugs',           label: 'Bugs',          icon: '🐛', color: 'red'   },
  { key: 'security_issues',label: 'Security',      icon: '🔒', color: 'orange'},
  { key: 'optimizations',  label: 'Performance',   icon: '⚡', color: 'blue'  },
  { key: 'best_practices', label: 'Best Practices',icon: '✅', color: 'green' }
];

function IssueItem({ text, color }) {
  const c = colorMap[color];
  return (
    <li className={`flex gap-3 items-start px-4 py-3 rounded-lg border ${c.border} ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 shrink-0`} />
      <span className="text-sm text-gray-300 leading-relaxed">{text}</span>
    </li>
  );
}

export default function ReviewResult({ result }) {
  const [activeTab, setActiveTab] = useState('summary');
  if (!result) return null;

  const counts = {
    bugs:            result.bugs?.length           || 0,
    security_issues: result.security_issues?.length || 0,
    optimizations:   result.optimizations?.length   || 0,
    best_practices:  result.best_practices?.length  || 0
  };

  const formatMarkdown = () => `# Code Review

**Quality Score:** ${result.quality_score}/10
**Complexity:** ${result.complexity}

## Summary
${result.summary}

## Bugs
${result.bugs?.map(b => `- ${b}`).join('\n') || 'None found'}

## Security Issues
${result.security_issues?.map(s => `- ${s}`).join('\n') || 'None found'}

## Optimizations
${result.optimizations?.map(o => `- ${o}`).join('\n') || 'None'}

## Best Practices
${result.best_practices?.map(b => `- ${b}`).join('\n') || 'None'}`.trim();

  const scoreColor = result.quality_score >= 7 ? 'text-green-400' : result.quality_score >= 4 ? 'text-yellow-400' : 'text-red-400';
  const complexityColor = result.complexity === 'low' ? 'text-green-400' : result.complexity === 'medium' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <h2 className="text-base font-semibold text-white">Review Results</h2>
        <CopyButton text={formatMarkdown()} label="Copy as Markdown" />
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-4">
        <ScoreCard label="Quality Score" value={`${result.quality_score}/10`} color={scoreColor} />
        <ScoreCard label="Complexity"    value={result.complexity}             color={complexityColor} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-4 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const count = counts[tab.key];
          const isActive = activeTab === tab.key;
          const c = tab.color ? colorMap[tab.color] : null;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? c ? `${c.tab} bg-gray-800 border-current` : 'text-violet-400 bg-gray-800 border-violet-500'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key !== 'summary' && count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                  isActive && c ? `${c.bg} ${c.border} border` : 'bg-gray-700 text-gray-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-5 py-4 min-h-48">
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed bg-gray-800 rounded-lg p-4">
              {result.summary || 'No summary available.'}
            </p>
            {/* Issue count overview */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { label: 'Bugs',          count: counts.bugs,            color: 'text-red-400',    bg: 'bg-red-500/5 border-red-500/20'       },
                { label: 'Security',      count: counts.security_issues, color: 'text-orange-400', bg: 'bg-orange-500/5 border-orange-500/20' },
                { label: 'Optimizations', count: counts.optimizations,   color: 'text-blue-400',   bg: 'bg-blue-500/5 border-blue-500/20'     },
                { label: 'Best Practices',count: counts.best_practices,  color: 'text-green-400',  bg: 'bg-green-500/5 border-green-500/20'   }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(
                    item.label === 'Bugs' ? 'bugs' :
                    item.label === 'Security' ? 'security_issues' :
                    item.label === 'Optimizations' ? 'optimizations' : 'best_practices'
                  )}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${item.bg} hover:opacity-80 transition-opacity text-left`}
                >
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className={`text-lg font-bold ${item.color}`}>{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bugs' && (
          <ul className="space-y-2">
            {counts.bugs === 0
              ? <p className="text-sm text-gray-500 py-4 text-center">✅ No bugs found</p>
              : result.bugs.map((item, i) => <IssueItem key={i} text={item} color="red" />)
            }
          </ul>
        )}

        {activeTab === 'security_issues' && (
          <ul className="space-y-2">
            {counts.security_issues === 0
              ? <p className="text-sm text-gray-500 py-4 text-center">✅ No security issues found</p>
              : result.security_issues.map((item, i) => <IssueItem key={i} text={item} color="orange" />)
            }
          </ul>
        )}

        {activeTab === 'optimizations' && (
          <ul className="space-y-2">
            {counts.optimizations === 0
              ? <p className="text-sm text-gray-500 py-4 text-center">✅ No optimizations suggested</p>
              : result.optimizations.map((item, i) => <IssueItem key={i} text={item} color="blue" />)
            }
          </ul>
        )}

        {activeTab === 'best_practices' && (
          <ul className="space-y-2">
            {counts.best_practices === 0
              ? <p className="text-sm text-gray-500 py-4 text-center">✅ All best practices followed</p>
              : result.best_practices.map((item, i) => <IssueItem key={i} text={item} color="green" />)
            }
          </ul>
        )}
      </div>
    </div>
  );
}
