'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchWithDropdown from '@/components/SearchWithDropdown';

interface MapControlsProps {
  query: string;
  onQueryChange: (query: string) => void;
  onStateSelect: (stateName: string) => void;
  stateNames: string[];
  onReset: () => void;
}

export default function MapControls({
  query,
  onQueryChange,
  onStateSelect,
  stateNames,
  onReset,
}: MapControlsProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md border border-[#E6E2DA]">
      <SearchWithDropdown
        query={query}
        onQueryChange={onQueryChange}
        onStateSelect={onStateSelect}
        stateNames={stateNames}
        placeholder="Search for a state..."
        className="flex-1"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="flex-shrink-0 border-[#0B1F3B] text-[#0B1F3B] hover:bg-[#C5A46D] hover:text-[#0B1F3B]"
        title="Reset view"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}

