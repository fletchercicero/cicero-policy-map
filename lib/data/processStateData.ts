import { Bill, StateData } from '@/types';
import { BASE_STATE_INFO } from './constants';
import { STATE_NAME_TO_USPS } from './stateMappings';

/**
 * Process raw CSV data into StateData objects
 */
export function processBillsData(bills: Bill[]): Map<string, StateData> {
  const stateDataMap = new Map<string, StateData>();

  // Group bills by state
  bills.forEach((bill) => {
    const stateName = bill.state.trim();
    const usps = STATE_NAME_TO_USPS[stateName];

    if (!usps) {
      console.warn(`Unknown state: ${stateName}`);
      return;
    }

    if (!stateDataMap.has(usps)) {
      const baseInfo = BASE_STATE_INFO[usps];
      stateDataMap.set(usps, {
        name: stateName,
        usps,
        capital: baseInfo?.capital || 'Unknown',
        population: baseInfo?.population || 'Unknown',
        bills: [],
        billCount: 0,
        issueCategories: [],
      });
    }

    const stateData = stateDataMap.get(usps)!;
    stateData.bills.push(bill);
  });

  // Calculate statistics for each state
  stateDataMap.forEach((stateData) => {
    stateData.billCount = stateData.bills.length;

    // Extract unique issue categories
    const issuesSet = new Set<string>();
    stateData.bills.forEach((bill) => {
      const issues = bill.issues.split(';').map(i => i.trim()).filter(i => i);
      issues.forEach(issue => issuesSet.add(issue));
    });
    stateData.issueCategories = Array.from(issuesSet).sort();
  });

  return stateDataMap;
}

/**
 * Get state data by USPS code
 */
export function getStateData(
  usps: string,
  stateDataMap: Map<string, StateData>
): StateData | null {
  return stateDataMap.get(usps) || null;
}

/**
 * Get list of all states that have bills
 */
export function getAllStatesWithBills(
  stateDataMap: Map<string, StateData>
): string[] {
  return Array.from(stateDataMap.keys());
}

/**
 * Search for states by name (case-insensitive partial match)
 */
export function searchStates(
  query: string,
  stateDataMap: Map<string, StateData>
): string[] {
  if (!query.trim()) {
    return getAllStatesWithBills(stateDataMap);
  }

  const lowerQuery = query.toLowerCase();
  return Array.from(stateDataMap.entries())
    .filter(([, stateData]) => 
      stateData.name.toLowerCase().includes(lowerQuery)
    )
    .map(([usps]) => usps);
}

