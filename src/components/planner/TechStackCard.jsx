const categories = ['frontend', 'backend', 'database', 'devops'];
const colors = {
  frontend: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  backend: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  database: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  devops: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
};

export default function TechStackCard({ techStack }) {
  if (!techStack) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Tech Stack</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-xs text-gray-500 uppercase mb-2">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {techStack[cat]?.map((tech, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${colors[cat]}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
