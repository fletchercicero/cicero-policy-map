'use client';

import { Geography } from 'react-simple-maps';
import { GeoFeature } from '@/types';
import { CICERO_COLORS } from '@/lib/data/constants';

interface StateGeographyProps {
  geo: GeoFeature;
  isEnabled: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

export default function StateGeography({
  geo,
  isEnabled,
  isSelected,
  isDimmed,
  onClick,
}: StateGeographyProps) {
  const getFillColor = () => {
    if (isSelected) return CICERO_COLORS.stateSelected;
    if (!isEnabled) return CICERO_COLORS.stateDisabled;
    if (isDimmed) return CICERO_COLORS.stateDimmed;
    return CICERO_COLORS.stateDefault;
  };

  const getStrokeColor = () => {
    return CICERO_COLORS.white;
  };

  return (
    <Geography
      geography={geo}
      fill={getFillColor()}
      stroke={getStrokeColor()}
      strokeWidth={isSelected ? 2 : 0.5}
      style={{
        default: {
          outline: 'none',
          transition: 'all 0.3s ease',
        },
        hover: {
          fill: isEnabled ? (isSelected ? CICERO_COLORS.gold : CICERO_COLORS.stateHover) : CICERO_COLORS.stateDisabled,
          cursor: isEnabled ? 'pointer' : 'default',
          outline: 'none',
        },
        pressed: {
          fill: isEnabled ? CICERO_COLORS.gold : CICERO_COLORS.stateDisabled,
          outline: 'none',
        },
      }}
      onClick={isEnabled ? onClick : undefined}
    />
  );
}

