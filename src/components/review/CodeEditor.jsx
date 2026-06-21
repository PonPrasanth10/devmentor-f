import Editor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: '400px' }}>
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 }
        }}
      />
    </div>
  );
}
