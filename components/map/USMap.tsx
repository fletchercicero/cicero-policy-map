'use client';

import { ComposableMap, Geographies, ZoomableGroup } from 'react-simple-maps';
import { GeoFeature } from '@/types';
import { GEO_URL } from '@/lib/data/constants';
import { FIPS_TO_USPS } from '@/lib/data/stateMappings';
import StateGeography from './StateGeography';

interface USMapProps {
  center: [number, number];
  zoom: number;
  enabledStates: Set<string>;
  selectedState: GeoFeature | null;
  searchQuery: string;
  matchingStates: Set<string>;
  onStateSelect: (geo: GeoFeature) => void;
  onGeographiesLoad?: (geographies: GeoFeature[]) => void;
}

export default function USMap({
  center,
  zoom,
  enabledStates,
  selectedState,
  searchQuery,
  matchingStates,
  onStateSelect,
  onGeographiesLoad,
}: USMapProps) {
  return (
    <div className="w-full h-full bg-[#F8F6F2] rounded-lg shadow-lg overflow-hidden border border-[#E6E2DA]">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
        width={800}
        height={500}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ZoomableGroup center={center} zoom={zoom}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) => {
              // Pass geographies to parent on first load
              if (onGeographiesLoad && geographies.length > 0) {
                onGeographiesLoad(geographies);
              }
              
              return geographies.map((geo) => {
                const usps = FIPS_TO_USPS[geo.id];
                const isEnabled = usps && enabledStates.has(usps);
                const isSelected = selectedState?.id === geo.id;
                const isDimmed = searchQuery && usps && !matchingStates.has(usps);

                return (
                  <StateGeography
                    key={geo.rsmKey}
                    geo={geo}
                    isEnabled={!!isEnabled}
                    isSelected={isSelected}
                    isDimmed={!!isDimmed}
                    onClick={() => onStateSelect(geo)}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

