'use client';

import { ResponseItem } from '@/lib/types';
import { useState } from 'react';

interface ResponseCardProps {
  response: ResponseItem;
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getModelLabel = () => {
    const baseName = response.model;
    return response.seedUsed ? `${baseName} with random seed` : baseName;
  };

  const isLongResponse = response.response.length > 100;
  const displayText = expanded || !isLongResponse
    ? response.response
    : response.response.substring(0, 100) + '...';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight">
          {getModelLabel()}
        </h3>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-2 flex-shrink-0"
          title="Copy response"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <div className="bg-gray-50 rounded p-3 min-h-[60px]">
        <p className="text-gray-700 text-sm leading-relaxed">
          {displayText}
        </p>
        {isLongResponse && (
          <button
            onClick={toggleExpanded}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}
