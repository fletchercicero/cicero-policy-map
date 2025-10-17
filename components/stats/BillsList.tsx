'use client';

import { useState, useRef, useEffect } from 'react';
import { Bill } from '@/types';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BillsListProps {
  bills: Bill[];
  maxHeight?: string;
}

export default function BillsList({ bills, maxHeight }: BillsListProps) {
  const [expandedBills, setExpandedBills] = useState<Set<number>>(new Set());
  const [lastExpandedIndex, setLastExpandedIndex] = useState<number | null>(null);
  const billRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleBill = (index: number) => {
    const newExpanded = new Set(expandedBills);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
      setLastExpandedIndex(null);
    } else {
      newExpanded.add(index);
      setLastExpandedIndex(index);
    }
    setExpandedBills(newExpanded);
  };

  // Check if any bills are expanded
  const hasExpandedBills = expandedBills.size > 0;

  // Auto-scroll to the last expanded bill
  useEffect(() => {
    if (lastExpandedIndex !== null && billRefs.current.has(lastExpandedIndex)) {
      // Small delay to ensure layout has switched to single column
      setTimeout(() => {
        const billElement = billRefs.current.get(lastExpandedIndex);
        if (billElement && containerRef.current) {
          billElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, [lastExpandedIndex, hasExpandedBills]);

  return (
    <div 
      ref={containerRef}
      className={`${
        hasExpandedBills 
          ? 'space-y-2 sm:space-y-3' 
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3'
      } overflow-y-auto pr-1 sm:pr-2 h-full`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {bills.map((bill, index) => {
        const isExpanded = expandedBills.has(index);
        
        return (
          <Card 
            key={index}
            ref={(el) => {
              if (el) {
                billRefs.current.set(index, el);
              } else {
                billRefs.current.delete(index);
              }
            }}
            className={`transition-all hover:shadow-md active:shadow-lg cursor-pointer border-[#E6E2DA] ${
              !isExpanded && !hasExpandedBills ? 'h-[160px] sm:h-[180px]' : ''
            }`}
            onClick={() => toggleBill(index)}
          >
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between gap-1 sm:gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <CardTitle className="text-sm sm:text-base font-semibold text-[#172c49]">
                      {bill.number}
                    </CardTitle>
                    <span className={`text-xs sm:text-sm text-[#0E1225] opacity-75 ${
                      !isExpanded && !hasExpandedBills ? 'line-clamp-2' : ''
                    }`}>
                      {bill.issues}
                    </span>
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    <span className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                      bill.status === 'Enacted' 
                        ? 'bg-[#b09c71] text-[#172c49]' 
                        : 'bg-[#E6E2DA] text-[#172c49]'
                    }`}>
                      {bill.status}
                    </span>
                    <span className="ml-2 text-[#0E1225]">{bill.year}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#172c49]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#172c49]" />
                  )}
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-[#172c49]">Notes: </span>
                    <p className="text-[#0E1225] mt-1 opacity-90">{bill.notes}</p>
                  </div>
                  {bill.stateLeg && (
                    <div>
                      <span className="font-semibold text-[#172c49]">Legislature: </span>
                      <span className="text-[#0E1225]">{bill.stateLeg}</span>
                    </div>
                  )}
                  {bill.sourceLink && (
                    <div>
                      <a
                        href={bill.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 text-[#b09c71] hover:text-[#172c49] active:text-[#172c49] transition-colors font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">View Bill Source</span>
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

