'use client';

import { useState, useEffect } from 'react';
import { ResponseItem, HistoryEntry } from '@/lib/types';
import ResponseCard from '@/components/ResponseCard';
import HistoryItem from '@/components/HistoryItem';

export default function Home() {
  const [prompt, setPrompt] = useState('Tell an interesting fact');
  const [temperature, setTemperature] = useState(1.0);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-response-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (err) {
        console.error('Failed to parse history from localStorage:', err);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-response-history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponses([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate responses');
      }

      const data = await response.json();
      setResponses(data.responses);

      // Add to history
      const newHistoryItem: HistoryEntry = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        temperature,
        responses: data.responses,
        timestamp: Date.now(),
      };

      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error('Error generating responses:', err);
      setError('Failed to generate responses. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-response-history');
  };

  const exportHistory = async () => {
    if (history.length === 0) {
      alert('No history to export');
      return;
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create blob from response and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-response-history-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export history. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Response Repeatability Tester
          </h1>
          <p className="text-gray-600">
            Test the consistency of OpenAI models by generating responses with and without random seeds
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter your prompt here..."
              />
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature.toFixed(1)}
              </label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0 (Deterministic)</span>
                <span>2.0 (Very Random)</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Generating...' : 'Generate Responses'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Responses Section */}
        {responses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Responses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {responses.map((response, index) => (
                <ResponseCard key={`${response.model}-${response.seedUsed}-${index}`} response={response} />
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">History</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportHistory}
                  disabled={history.length === 0}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export to Excel
                </button>
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  Clear History
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {history.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
