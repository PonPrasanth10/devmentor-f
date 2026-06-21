import CopyButton from '../shared/CopyButton';

export default function FolderTree({ structure }) {
  if (!structure) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Folder Structure</h3>
        <CopyButton text={structure} label="Copy" />
      </div>
      <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed bg-gray-800 rounded-lg p-4 overflow-x-auto">
        {structure}
      </pre>
    </div>
  );
}
