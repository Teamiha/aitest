'use client';

import { useState } from 'react';

interface QuestionResponseProps {
  response: string;
}

export default function QuestionResponse({ response }: QuestionResponseProps) {
  const [expanded, setExpanded] = useState(false);

  const isLongResponse = response.length > 100;
  const displayText = expanded || !isLongResponse
    ? response
    : response.substring(0, 100) + '...';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded p-3 min-h-[40px]">
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
  );
}
