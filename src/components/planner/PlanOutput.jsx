import TechStackCard from './TechStackCard';
import ApiPlanTable from './ApiPlanTable';
import FolderTree from './FolderTree';

export default function PlanOutput({ plan }) {
  if (!plan) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-teal-500/30 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{plan.projectName}</h2>
            <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
          </div>
          <span className="text-xs px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full">
            {plan.architecture}
          </span>
        </div>
      </div>

      <TechStackCard techStack={plan.techStack} />
      <FolderTree structure={plan.folderStructure} />

      {plan.dbSchema && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Database Schema</h3>
          <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">{plan.dbSchema}</pre>
        </div>
      )}

      <ApiPlanTable apiPlan={plan.apiPlan} />

      {plan.frontendPages?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Frontend Pages</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {plan.frontendPages.map((page, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <p className="text-sm font-medium text-white">{page.name}</p>
                <p className="text-xs text-gray-500 mt-1">{page.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.timeline?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Timeline</h3>
          <div className="space-y-4">
            {plan.timeline.map((week, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 text-xs font-medium text-teal-400 w-20 pt-0.5">{week.week}</div>
                <ul className="space-y-1">
                  {week.tasks?.map((task, j) => (
                    <li key={j} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-gray-600 shrink-0">—</span>{task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.deploymentSteps?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Deployment Steps</h3>
          <ol className="space-y-2">
            {plan.deploymentSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-400">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
