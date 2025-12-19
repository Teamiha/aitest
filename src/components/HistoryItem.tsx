'use client';

import { HistoryEntry } from '@/lib/types';
import { useState } from 'react';
import ResponseCard from './ResponseCard';

interface HistoryItemProps {
  item: HistoryEntry;
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Prompt:</span> {item.prompt}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Temperature:</span> {item.temperature}
          </p>
          <p className="text-xs text-gray-500">
            {formatTimestamp(item.timestamp)}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 ml-4"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.responses.map((response, index) => (
              <ResponseCard key={`${response.model}-${response.seedUsed}-${index}`} response={response} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
