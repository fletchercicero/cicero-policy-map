// Cicero Institute Color Scheme
export const CICERO_COLORS = {
  // Primary brand colors
  navy: '#172c49',         // Page text, headings, borders, stroke
  gold: '#b09c71',         // Selected state, hover, primary buttons
  light: '#FFFFFF',        // App background
  gray: '#E6E2DA',         // Card borders, dimmed states
  slate: '#0E1225',        // Secondary/base text color
  white: '#FFFFFF',        // Card backgrounds
  
  // State fill colors
  stateDefault: '#2e5d8c', // Default enabled state fill at rest
  stateHover: '#E9D9B8',   // Hover fill for enabled states
  stateDisabled: '#d8d8d6', // Disabled/non-clickable state fill
  stateSelected: '#b09c71', // Selected state (gold)
  stateDimmed: '#E6E2DA',  // Dimmed state when filtered
  
  // Legacy aliases for compatibility
  primary: '#172c49',
  accent: '#b09c71',
  background: '#FFFFFF',
  text: '#172c49',
  
  // State colors (mapped to new scheme)
  enabled: '#2e5d8c',
  disabled: '#d8d8d6',
  hover: '#E9D9B8',
  selected: '#b09c71',
};

// TopoJSON URL for US states
export const GEO_URL = 
  'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Base state information (capitals and populations)
export const BASE_STATE_INFO: Record<string, { name: string; capital: string; population: string }> = {
  AL: { name: 'Alabama', capital: 'Montgomery', population: '5.1M' },
  AK: { name: 'Alaska', capital: 'Juneau', population: '733K' },
  AZ: { name: 'Arizona', capital: 'Phoenix', population: '7.4M' },
  AR: { name: 'Arkansas', capital: 'Little Rock', population: '3.1M' },
  CA: { name: 'California', capital: 'Sacramento', population: '39.5M' },
  CO: { name: 'Colorado', capital: 'Denver', population: '5.8M' },
  CT: { name: 'Connecticut', capital: 'Hartford', population: '3.6M' },
  DE: { name: 'Delaware', capital: 'Dover', population: '1.0M' },
  FL: { name: 'Florida', capital: 'Tallahassee', population: '22.2M' },
  GA: { name: 'Georgia', capital: 'Atlanta', population: '10.9M' },
  HI: { name: 'Hawaii', capital: 'Honolulu', population: '1.4M' },
  ID: { name: 'Idaho', capital: 'Boise', population: '1.9M' },
  IL: { name: 'Illinois', capital: 'Springfield', population: '12.6M' },
  IN: { name: 'Indiana', capital: 'Indianapolis', population: '6.8M' },
  IA: { name: 'Iowa', capital: 'Des Moines', population: '3.2M' },
  KS: { name: 'Kansas', capital: 'Topeka', population: '2.9M' },
  KY: { name: 'Kentucky', capital: 'Frankfort', population: '4.5M' },
  LA: { name: 'Louisiana', capital: 'Baton Rouge', population: '4.6M' },
  ME: { name: 'Maine', capital: 'Augusta', population: '1.4M' },
  MD: { name: 'Maryland', capital: 'Annapolis', population: '6.2M' },
  MA: { name: 'Massachusetts', capital: 'Boston', population: '7.0M' },
  MI: { name: 'Michigan', capital: 'Lansing', population: '10.1M' },
  MN: { name: 'Minnesota', capital: 'Saint Paul', population: '5.7M' },
  MS: { name: 'Mississippi', capital: 'Jackson', population: '2.9M' },
  MO: { name: 'Missouri', capital: 'Jefferson City', population: '6.2M' },
  MT: { name: 'Montana', capital: 'Helena', population: '1.1M' },
  NE: { name: 'Nebraska', capital: 'Lincoln', population: '2.0M' },
  NV: { name: 'Nevada', capital: 'Carson City', population: '3.2M' },
  NH: { name: 'New Hampshire', capital: 'Concord', population: '1.4M' },
  NJ: { name: 'New Jersey', capital: 'Trenton', population: '9.3M' },
  NM: { name: 'New Mexico', capital: 'Santa Fe', population: '2.1M' },
  NY: { name: 'New York', capital: 'Albany', population: '19.8M' },
  NC: { name: 'North Carolina', capital: 'Raleigh', population: '10.7M' },
  ND: { name: 'North Dakota', capital: 'Bismarck', population: '779K' },
  OH: { name: 'Ohio', capital: 'Columbus', population: '11.8M' },
  OK: { name: 'Oklahoma', capital: 'Oklahoma City', population: '4.0M' },
  OR: { name: 'Oregon', capital: 'Salem', population: '4.2M' },
  PA: { name: 'Pennsylvania', capital: 'Harrisburg', population: '13.0M' },
  RI: { name: 'Rhode Island', capital: 'Providence', population: '1.1M' },
  SC: { name: 'South Carolina', capital: 'Columbia', population: '5.3M' },
  SD: { name: 'South Dakota', capital: 'Pierre', population: '909K' },
  TN: { name: 'Tennessee', capital: 'Nashville', population: '7.1M' },
  TX: { name: 'Texas', capital: 'Austin', population: '30.5M' },
  UT: { name: 'Utah', capital: 'Salt Lake City', population: '3.4M' },
  VT: { name: 'Vermont', capital: 'Montpelier', population: '647K' },
  VA: { name: 'Virginia', capital: 'Richmond', population: '8.7M' },
  WA: { name: 'Washington', capital: 'Olympia', population: '7.8M' },
  WV: { name: 'West Virginia', capital: 'Charleston', population: '1.8M' },
  WI: { name: 'Wisconsin', capital: 'Madison', population: '5.9M' },
  WY: { name: 'Wyoming', capital: 'Cheyenne', population: '581K' },
};

