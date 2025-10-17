'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchWithDropdownProps {
  query: string;
  onQueryChange: (query: string) => void;
  onStateSelect: (stateName: string) => void;
  stateNames: string[];
  placeholder?: string;
  className?: string;
}

export default function SearchWithDropdown({
  query,
  onQueryChange,
  onStateSelect,
  stateNames,
  placeholder = "Search for a state...",
  className = "",
}: SearchWithDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter states based on query
  const filteredStates = query.trim()
    ? stateNames.filter(name => 
        name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Limit to 8 results
    : [];

  // Show dropdown when there are filtered results and input is focused
  useEffect(() => {
    setShowDropdown(filteredStates.length > 0 && query.trim() !== '');
    setHighlightedIndex(-1);
  }, [query, filteredStates.length]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredStates.length === 0) {
      if (e.key === 'Enter' && filteredStates.length > 0) {
        // Enter with results - select first match
        handleSelectState(filteredStates[0]);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredStates.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredStates.length) {
          handleSelectState(filteredStates[highlightedIndex]);
        } else if (filteredStates.length > 0) {
          handleSelectState(filteredStates[0]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectState = (stateName: string) => {
    onStateSelect(stateName);
    onQueryChange(stateName);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#172c49] opacity-50 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredStates.length > 0) {
            setShowDropdown(true);
          }
        }}
        className="pl-9 sm:pl-10 pr-4 py-2 w-full border-[#E6E2DA]"
      />
      
      {showDropdown && filteredStates.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E2DA] rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
        >
          {filteredStates.map((stateName, index) => (
            <button
              key={stateName}
              onClick={() => handleSelectState(stateName)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#E6E2DA]/30 transition-colors ${
                index === highlightedIndex ? 'bg-[#E6E2DA]/30' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredStates.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="text-[#172c49] font-medium">{stateName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

