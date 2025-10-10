# Next.js Migration Plan: Cicero Institute Policy Map

## Overview
Convert the existing React component into a Next.js application hosted on Vercel, using real policy data from `allBills.csv` instead of hardcoded state statistics.

---

## Phase 1: Project Setup

### 1.1 Initialize Next.js Project
- [ ] Create Next.js app with TypeScript: `npx create-next-app@latest cicero-policy-map --typescript --tailwind --app`
- [ ] Choose options: Yes to TypeScript, Yes to Tailwind CSS, Yes to App Router
- [ ] Install dependencies:
  ```bash
  npm install react-simple-maps d3-geo framer-motion lucide-react
  npm install papaparse
  npm install @types/d3-geo @types/papaparse --save-dev
  ```

### 1.2 Install shadcn/ui Components
- [ ] Initialize shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Add required components:
  ```bash
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add input
  ```

### 1.3 Project Structure
```
cicero-policy-map/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── map/
│   │   ├── USMap.tsx
│   │   ├── StateGeography.tsx
│   │   └── MapControls.tsx
│   ├── stats/
│   │   ├── StateDetailsCard.tsx
│   │   ├── StatePlaceholder.tsx
│   │   └── BillsList.tsx
│   ├── ui/
│   │   └── (shadcn components)
│   └── USStateExplorer.tsx
├── lib/
│   ├── data/
│   │   ├── processStateData.ts
│   │   ├── stateMappings.ts
│   │   └── constants.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
│   └── allBills.csv
└── package.json
```

---

## Phase 2: Data Layer

### 2.1 Define TypeScript Types
**File: `types/index.ts`**
```typescript
export interface Bill {
  state: string;
  stateLeg: string;
  number: string;
  status: string;
  issues: string;
  notes: string;
  sourceLink: string;
  year: string;
}

export interface StateData {
  name: string;
  usps: string;
  capital: string;
  population: string;
  bills: Bill[];
  billCount: number;
  issueCategories: string[];
}

export interface GeoFeature {
  id: string;
  rsmKey: string;
  properties: {
    name: string;
  };
  geometry: any;
}
```

### 2.2 CSV Data Processing
**File: `lib/data/processStateData.ts`**
- [ ] Parse CSV using PapaParse
- [ ] Group bills by state
- [ ] Calculate statistics per state (bill counts, issue categories)
- [ ] Merge with base state info (capitals, populations)
- [ ] Export function: `getStateData(usps: string): StateData | null`
- [ ] Export function: `getAllStatesWithBills(): string[]`

### 2.3 Constants and Mappings
**File: `lib/data/constants.ts`**
- [ ] Move CICERO color scheme
- [ ] Move GEO_URL constant
- [ ] Define base state information (capitals, populations)

**File: `lib/data/stateMappings.ts`**
- [ ] Move FIPS_TO_USPS mapping
- [ ] Create function to get enabled states from CSV data

---

## Phase 3: Component Architecture

### 3.1 Main Container Component
**File: `components/USStateExplorer.tsx`**
- State management (selected state, zoom, center, search query)
- Data fetching and processing
- Layout orchestration
- Props: `bills: Bill[]`

### 3.2 Map Components

#### **File: `components/map/USMap.tsx`**
- ComposableMap wrapper with ZoomableGroup
- Geographies rendering
- Props:
  - `center: [number, number]`
  - `zoom: number`
  - `enabledStates: Set<string>`
  - `selectedState: GeoFeature | null`
  - `searchQuery: string`
  - `onStateSelect: (geo: GeoFeature) => void`

#### **File: `components/map/StateGeography.tsx`**
- Individual state rendering
- Hover/click interactions
- Visual styling based on state
- Props:
  - `geo: GeoFeature`
  - `isEnabled: boolean`
  - `isSelected: boolean`
  - `isDimmed: boolean`
  - `onClick: () => void`

#### **File: `components/map/MapControls.tsx`**
- Search input
- Reset button
- Props:
  - `query: string`
  - `onQueryChange: (query: string) => void`
  - `onReset: () => void`

### 3.3 Stats/Details Components

#### **File: `components/stats/StateDetailsCard.tsx`**
- Display state details when selected
- Show bills passed in that state
- Group bills by issue category
- Props:
  - `stateData: StateData`
  - `usps: string`
  - `onBack: () => void`

#### **File: `components/stats/BillsList.tsx`**
- Scrollable list of bills
- Expandable bill details
- Links to source
- Props:
  - `bills: Bill[]`
  - `maxHeight?: string`

#### **File: `components/stats/StatePlaceholder.tsx`**
- Empty state when no state selected
- Search input
- Instructions
- Props:
  - `query: string`
  - `onQueryChange: (query: string) => void`

---

## Phase 4: Next.js Integration

### 4.1 App Router Setup
**File: `app/layout.tsx`**
- [ ] Set up HTML structure
- [ ] Import global styles
- [ ] Add metadata (title, description)
- [ ] Configure font (serif for headers)

**File: `app/page.tsx`**
- [ ] Server component that reads CSV file
- [ ] Pass data to client component
```typescript
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import USStateExplorer from '@/components/USStateExplorer';

export default async function Home() {
  const csvPath = path.join(process.cwd(), 'public', 'allBills.csv');
  const fileContent = await fs.readFile(csvPath, 'utf-8');
  const { data } = Papa.parse(fileContent, { header: true });
  
  return <USStateExplorer bills={data} />;
}
```

### 4.2 Styling
**File: `app/globals.css`**
- [ ] Import Tailwind directives
- [ ] Add custom CSS for Cicero branding
- [ ] Configure font families (serif for headers)

---

## Phase 5: Enhanced Features

### 5.1 State Details Enhancements
- [ ] Display bill count prominently
- [ ] Group bills by issue category with badges
- [ ] Show year distribution of bills
- [ ] Add status indicators (Enacted vs Sent to Governor)
- [ ] Make bill numbers clickable to source links

### 5.2 Search Improvements
- [ ] Search by state name
- [ ] Filter by issue category
- [ ] Highlight matching states on map

### 5.3 Responsive Design
- [ ] Mobile-optimized layout
- [ ] Stack map and details vertically on small screens
- [ ] Touch-friendly interactions
- [ ] Adjust zoom behavior for mobile

### 5.4 Performance Optimizations
- [ ] Memoize expensive computations
- [ ] Optimize CSV parsing (only once on server)
- [ ] Lazy load map geometry
- [ ] Use React.memo for stable components

---

## Phase 6: Deployment

### 6.1 Vercel Configuration
**File: `vercel.json`**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 6.2 Environment Setup
- [ ] Ensure Node.js version compatibility (18.x or higher)
- [ ] Test build locally: `npm run build`
- [ ] Test production mode: `npm start`

### 6.3 Vercel Deployment Steps
- [ ] Push code to GitHub repository
- [ ] Connect repository to Vercel
- [ ] Configure project settings
- [ ] Deploy and test
- [ ] Set up custom domain (if needed)

---

## Phase 7: Testing & Polish

### 7.1 Functionality Testing
- [ ] Test all state selections
- [ ] Verify CSV data accuracy
- [ ] Test search functionality
- [ ] Test zoom/pan interactions
- [ ] Test responsive layouts

### 7.2 Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 7.3 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast ratios
- [ ] Focus indicators

### 7.4 Performance
- [ ] Lighthouse audit
- [ ] Core Web Vitals
- [ ] Bundle size optimization

---

## Key Data Transformations

### From CSV to State Data
1. **Parse CSV**: Convert `allBills.csv` to array of Bill objects
2. **Group by State**: Create map of USPS code → Bills[]
3. **Calculate Stats**:
   - Total bills per state
   - Unique issue categories
   - Year distribution
   - Status breakdown (Enacted vs Sent to Governor)
4. **Merge with Base Data**: Add capital, population from constants
5. **Determine Enabled States**: Only states with bills in CSV

### Display Logic
- **Enabled States** (colored): States that appear in CSV with bills
- **Disabled States** (grayed): States with no bill data
- **Selected State**: Shows detailed view with all bills
- **Search Filter**: Dims states that don't match query

---

## Data Mapping Example

```typescript
// Current hardcoded data
STATE_STATS["TX"] = {
  name: "Texas",
  capital: "Austin", 
  population: "30.5M",
  fun: "Bigger than France (by area)!"
}

// New data from CSV
StateData["TX"] = {
  name: "Texas",
  usps: "TX",
  capital: "Austin",
  population: "30.5M",
  billCount: 8,
  bills: [
    {
      state: "Texas",
      number: "S.B. 1038",
      status: "Enacted",
      issues: "Healthcare",
      notes: "Provides rewards...",
      year: "2025"
    },
    // ... 7 more bills
  ],
  issueCategories: [
    "Healthcare", 
    "Regulatory Reform",
    "Public Safety",
    "Homelessness"
  ]
}
```

---

## Migration Checklist

- [ ] Phase 1: Project Setup Complete
- [ ] Phase 2: Data Layer Complete
- [ ] Phase 3: Components Complete
- [ ] Phase 4: Next.js Integration Complete
- [ ] Phase 5: Enhanced Features Complete
- [ ] Phase 6: Deployed to Vercel
- [ ] Phase 7: Testing & Polish Complete

---

## Notes

- Use **App Router** (not Pages Router) for Next.js 13+ features
- All components with interactivity must be **Client Components** (`'use client'`)
- CSV parsing happens on the **server** for better performance
- Keep original Cicero color scheme and animations
- Maintain the elegant sliding animations from Framer Motion
- Preserve the zoom-on-select functionality

