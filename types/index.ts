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

