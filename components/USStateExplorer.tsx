'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoCentroid } from 'd3-geo';
import { Bill, GeoFeature } from '@/types';
import { processBillsData, getStateData, searchStates } from '@/lib/data/processStateData';
import { FIPS_TO_USPS } from '@/lib/data/stateMappings';
import USMap from './map/USMap';
import MapControls from './map/MapControls';
import StateDetailsCard from './stats/StateDetailsCard';
import StatePlaceholder from './stats/StatePlaceholder';

interface USStateExplorerProps {
  bills: Bill[];
}

export default function USStateExplorer({ bills }: USStateExplorerProps) {
  const [selectedState, setSelectedState] = useState<GeoFeature | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-98, 38]);
  const [geographies, setGeographies] = useState<GeoFeature[]>([]);

  // Reset zoom when clearing selection
  useEffect(() => {
    if (!selectedState) {
      setCenter([-98, 38]);
      setZoom(1);
    }
  }, [selectedState]);

  // Process bills data into state data map
  const stateDataMap = useMemo(() => processBillsData(bills), [bills]);

  // Get set of enabled states (states with bills)
  const enabledStates = useMemo(() => {
    return new Set(Array.from(stateDataMap.keys()));
  }, [stateDataMap]);

  // Get matching states based on search query
  const matchingStates = useMemo(() => {
    return new Set(searchStates(searchQuery, stateDataMap));
  }, [searchQuery, stateDataMap]);

  // Get list of state names for dropdown
  const stateNames = useMemo(() => {
    return Array.from(stateDataMap.values()).map(state => state.name).sort();
  }, [stateDataMap]);

  // Get current state data if a state is selected
  const currentStateData = useMemo(() => {
    if (!selectedState) return null;
    const usps = FIPS_TO_USPS[selectedState.id];
    return usps ? getStateData(usps, stateDataMap) : null;
  }, [selectedState, stateDataMap]);

  // Handle state selection
  const handleStateSelect = (geo: GeoFeature) => {
    const usps = FIPS_TO_USPS[geo.id];
    if (!usps || !enabledStates.has(usps)) return;

    // Calculate the centroid of the selected state geometry
    const centroid = geoCentroid(geo as unknown as GeoJSON.Feature);
    
    setSelectedState(geo);
    setCenter([centroid[0], centroid[1]]);
    setZoom(3.2);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedState(null);
    setSearchQuery('');
    setZoom(1);
    setCenter([-98, 38]);
  };

  // Handle back from details
  const handleBack = () => {
    setSelectedState(null);
    setZoom(1);
    setCenter([-98, 38]);
  };

  // Handle search query change
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle state selection from dropdown by name
  const handleStateSelectByName = (stateName: string) => {
    // Find the state data
    const stateEntry = Array.from(stateDataMap.entries()).find(
      ([, data]) => data.name === stateName
    );
    
    if (!stateEntry) return;
    
    const [usps] = stateEntry;
    
    // Find the FIPS code for this USPS code
    const fipsCode = Object.entries(FIPS_TO_USPS).find(
      ([, code]) => code === usps
    )?.[0];
    
    if (!fipsCode) return;
    
    // Find the actual geography from the loaded geographies
    const actualGeo = geographies.find((g) => g.id === fipsCode);
    
    if (actualGeo) {
      // Use the actual geography with proper centroid calculation
      handleStateSelect(actualGeo);
    } else {
      // Fallback: Create a mock GeoFeature and set approximate zoom
      const mockGeoFeature: GeoFeature = {
        id: fipsCode,
        rsmKey: `geo-${fipsCode}`,
        properties: {
          name: stateName,
        },
        geometry: {},
      };
      
      setSelectedState(mockGeoFeature);
      setSearchQuery(stateName);
      setZoom(3.2);
    }
  };

  // Handle geographies load from map
  const handleGeographiesLoad = (loadedGeographies: GeoFeature[]) => {
    if (geographies.length === 0) {
      setGeographies(loadedGeographies);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F6F2] p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <header className="mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0B1F3B] mb-2">
            Cicero Institute Policy Map
          </h1>
          <p className="text-[#0E1225] text-sm sm:text-base md:text-lg">
            Explore policy bills enacted or sent to governors across the United States
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-auto lg:h-[calc(100vh-180px)]">
          {/* Left Panel - Map */}
          <div className="flex flex-col gap-4 h-[50vh] lg:h-full">
            <MapControls
              query={searchQuery}
              onQueryChange={handleSearchQueryChange}
              onStateSelect={handleStateSelectByName}
              stateNames={stateNames}
              onReset={handleReset}
            />
            <div className="flex-1 min-h-0">
              <USMap
                center={center}
                zoom={zoom}
                enabledStates={enabledStates}
                selectedState={selectedState}
                searchQuery={searchQuery}
                matchingStates={matchingStates}
                onStateSelect={handleStateSelect}
                onGeographiesLoad={handleGeographiesLoad}
              />
            </div>
          </div>

          {/* Right Panel - State Details or Placeholder */}
          <div className="h-[50vh] lg:h-full min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStateData && selectedState ? (
                <motion.div
                  key={selectedState.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <StateDetailsCard
                    stateData={currentStateData}
                    onBack={handleBack}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-white rounded-lg shadow-lg border border-[#E6E2DA]"
                >
                  <StatePlaceholder
                    query={searchQuery}
                    onQueryChange={handleSearchQueryChange}
                    onStateSelect={handleStateSelectByName}
                    stateNames={stateNames}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

