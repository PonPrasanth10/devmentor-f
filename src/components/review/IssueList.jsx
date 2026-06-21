const colorMap = {
  red: 'border-red-500/20 bg-red-500/5',
  orange: 'border-orange-500/20 bg-orange-500/5',
  blue: 'border-blue-500/20 bg-blue-500/5',
  green: 'border-green-500/20 bg-green-500/5'
};

export default function IssueList({ title, items, color }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={`text-sm text-gray-300 px-3 py-2 rounded-lg border ${colorMap[color]}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
