const methodColors = {
  GET: 'text-green-400 bg-green-400/10',
  POST: 'text-blue-400 bg-blue-400/10',
  PUT: 'text-yellow-400 bg-yellow-400/10',
  PATCH: 'text-orange-400 bg-orange-400/10',
  DELETE: 'text-red-400 bg-red-400/10'
};

export default function ApiPlanTable({ apiPlan }) {
  if (!apiPlan?.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">API Plan</h3>
      <div className="space-y-2">
        {apiPlan.map((route, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 ${methodColors[route.method?.toUpperCase()] || 'text-gray-400 bg-gray-800'}`}>
              {route.method?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-300 font-mono shrink-0">{route.endpoint}</span>
            <span className="text-sm text-gray-500 text-right ml-auto">{route.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
