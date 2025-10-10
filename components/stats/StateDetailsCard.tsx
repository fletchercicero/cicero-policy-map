'use client';

import { useState } from 'react';
import { StateData } from '@/types';
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BillsList from './BillsList';

interface StateDetailsCardProps {
  stateData: StateData;
  onBack: () => void;
}

export default function StateDetailsCard({
  stateData,
  onBack,
}: StateDetailsCardProps) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-[#E6E2DA]">
      {/* Header */}
      <div className="bg-[#C5A46D] text-[#0B1F3B] p-4 sm:p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#0B1F3B] hover:bg-[#0B1F3B]/10 mb-3 sm:mb-4 -ml-2 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Map
        </Button>
        
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
          {stateData.name}
        </h1>
        
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">{stateData.billCount} Bills Enacted{stateData.billCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Issue Categories */}
      {stateData.issueCategories.length > 0 && (
        <div className="border-b border-[#E6E2DA] bg-white">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#0B1F3B]">Issue Categories</h3>
              <span className="text-xs text-[#0E1225] opacity-75">
                ({stateData.issueCategories.length})
              </span>
            </div>
            {showCategories ? (
              <ChevronUp className="w-4 h-4 text-[#0B1F3B]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#0B1F3B]" />
            )}
          </button>
          {showCategories && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {stateData.issueCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#C5A46D] text-[#0B1F3B] text-xs rounded-full font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bills List */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 min-h-0">
        <h3 className="text-base sm:text-lg font-serif font-semibold text-[#0B1F3B] mb-3 sm:mb-4 flex-shrink-0">
          Policy Bills
        </h3>
        <div className="flex-1 min-h-0">
          <BillsList bills={stateData.bills} />
        </div>
      </div>
    </div>
  );
}

