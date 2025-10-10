'use client';

import { MapPin } from 'lucide-react';
import SearchWithDropdown from '@/components/SearchWithDropdown';

interface StatePlaceholderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onStateSelect: (stateName: string) => void;
  stateNames: string[];
}

export default function StatePlaceholder({
  query,
  onQueryChange,
  onStateSelect,
  stateNames,
}: StatePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 text-center">
      <MapPin className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#C5A46D] mb-4 sm:mb-6 opacity-40" />
      
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3B] mb-2 sm:mb-3">
        Select a State
      </h2>
      
      <p className="text-sm sm:text-base text-[#0E1225] opacity-75 mb-4 sm:mb-6 max-w-md">
        Click on a state on the map to view policy bills that have been enacted 
        or sent to the governor, or search for a state below.
      </p>
      
      <SearchWithDropdown
        query={query}
        onQueryChange={onQueryChange}
        onStateSelect={onStateSelect}
        stateNames={stateNames}
        placeholder="Search for a state..."
        className="w-full max-w-md"
      />
      
      <div className="mt-8 text-sm text-[#0E1225] opacity-75">
        <p>States with active policy bills are shown on the map.</p>
      </div>
    </div>
  );
}

