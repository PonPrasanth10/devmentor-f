import { useState } from 'react';

export default function useStreamReview() {
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const startStream = async (code, language) => {
    setStreaming(true);
    setStreamText('');
    setResult(null);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE_URL}/review/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code, language })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.replace('data:', '').trim());
              if (data.token) setStreamText(prev => prev + data.token);
              else if (data.result) setResult(data.result);
            } catch { /* skip */ }
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStreaming(false);
    }
  };

  return { streaming, streamText, result, error, startStream };
}
