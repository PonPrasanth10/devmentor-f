export default function ScoreCard({ label, value, color }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold capitalize ${color}`}>{value}</p>
    </div>
  );
}
