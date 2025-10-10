import React, { useMemo, useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Cicero Institute Policy Map
 * - Left: interactive US map. Click a state to zoom/focus.
 * - Right: animated stat card that pops in with info.
 *
 * Notes:
 * - Uses react-simple-maps with the official us-atlas TopoJSON.
 * - Stats are demo placeholders — replace `STATE_STATS` with your real data source.
 */

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"; // TopoJSON

// Minimal demo stats (replace with real data). Key by USPS code.
const STATE_STATS: Record<string, { name: string; capital: string; population: string; gdp?: string; fun?: string; region?: string }> = {
  AL: { name: "Alabama", capital: "Montgomery", population: "5.1M", fun: "Home of the U.S. Space & Rocket Center." },
  AK: { name: "Alaska", capital: "Juneau", population: "0.7M", fun: "Largest state by area." },
  AZ: { name: "Arizona", capital: "Phoenix", population: "7.5M", fun: "Grand Canyon state." },
  AR: { name: "Arkansas", capital: "Little Rock", population: "3.0M" },
  CA: { name: "California", capital: "Sacramento", population: "39.0M", gdp: "$3.8T", fun: "If it were a country, it'd be a top-5 economy." },
  CO: { name: "Colorado", capital: "Denver", population: "5.9M" },
  CT: { name: "Connecticut", capital: "Hartford", population: "3.6M" },
  DE: { name: "Delaware", capital: "Dover", population: "1.0M" },
  FL: { name: "Florida", capital: "Tallahassee", population: "22.6M" },
  GA: { name: "Georgia", capital: "Atlanta", population: "11.0M" },
  HI: { name: "Hawaii", capital: "Honolulu", population: "1.4M" },
  ID: { name: "Idaho", capital: "Boise", population: "2.0M" },
  IL: { name: "Illinois", capital: "Springfield", population: "12.5M" },
  IN: { name: "Indiana", capital: "Indianapolis", population: "6.9M" },
  IA: { name: "Iowa", capital: "Des Moines", population: "3.2M" },
  KS: { name: "Kansas", capital: "Topeka", population: "2.9M" },
  KY: { name: "Kentucky", capital: "Frankfort", population: "4.5M" },
  LA: { name: "Louisiana", capital: "Baton Rouge", population: "4.6M" },
  ME: { name: "Maine", capital: "Augusta", population: "1.4M" },
  MD: { name: "Maryland", capital: "Annapolis", population: "6.2M" },
  MA: { name: "Massachusetts", capital: "Boston", population: "7.0M" },
  MI: { name: "Michigan", capital: "Lansing", population: "10.0M" },
  MN: { name: "Minnesota", capital: "St. Paul", population: "5.8M" },
  MS: { name: "Mississippi", capital: "Jackson", population: "3.0M" },
  MO: { name: "Missouri", capital: "Jefferson City", population: "6.2M" },
  MT: { name: "Montana", capital: "Helena", population: "1.1M" },
  NE: { name: "Nebraska", capital: "Lincoln", population: "2.0M" },
  NV: { name: "Nevada", capital: "Carson City", population: "3.2M" },
  NH: { name: "New Hampshire", capital: "Concord", population: "1.4M" },
  NJ: { name: "New Jersey", capital: "Trenton", population: "9.3M" },
  NM: { name: "New Mexico", capital: "Santa Fe", population: "2.1M" },
  NY: { name: "New York", capital: "Albany", population: "19.6M" },
  NC: { name: "North Carolina", capital: "Raleigh", population: "10.9M" },
  ND: { name: "North Dakota", capital: "Bismarck", population: "0.8M" },
  OH: { name: "Ohio", capital: "Columbus", population: "11.8M" },
  OK: { name: "Oklahoma", capital: "Oklahoma City", population: "4.1M" },
  OR: { name: "Oregon", capital: "Salem", population: "4.3M" },
  PA: { name: "Pennsylvania", capital: "Harrisburg", population: "12.9M" },
  RI: { name: "Rhode Island", capital: "Providence", population: "1.1M" },
  SC: { name: "South Carolina", capital: "Columbia", population: "5.4M" },
  SD: { name: "South Dakota", capital: "Pierre", population: "0.9M" },
  TN: { name: "Tennessee", capital: "Nashville", population: "7.2M" },
  TX: { name: "Texas", capital: "Austin", population: "30.5M", fun: "Bigger than France (by area)!" },
  UT: { name: "Utah", capital: "Salt Lake City", population: "3.4M" },
  VT: { name: "Vermont", capital: "Montpelier", population: "0.65M" },
  VA: { name: "Virginia", capital: "Richmond", population: "8.8M" },
  WA: { name: "Washington", capital: "Olympia", population: "7.9M" },
  WV: { name: "West Virginia", capital: "Charleston", population: "1.8M" },
  WI: { name: "Wisconsin", capital: "Madison", population: "5.9M" },
  WY: { name: "Wyoming", capital: "Cheyenne", population: "0.58M" },
  DC: { name: "District of Columbia", capital: "Washington", population: "0.68M" },
};

// Basic USPS FIPS mapping for react-simple-maps features (id -> USPS)
const FIPS_TO_USPS: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
  "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
  "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
  "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

const CICERO = {
  navy: "#0B1F3B",
  gold: "#C5A46D",
  light: "#F8F6F2",
  slate: "#0E1225",
  gray:  "#E6E2DA",
};

const ENABLED_STATES = new Set([
  "AK","AZ","AR","CO","CT","FL","GA","ID","IN","IA","KS","KY","LA","MD","MA","MI","MN","MS","MO","MT","NE","NV","NM","NC","ND","OH","OK","OR","SC","TN","TX","UT","VA","WV","WI","WY",
]);

export default function USStateExplorer() {
  const [selected, setSelected] = useState<any | null>(null);
  const [center, setCenter] = useState<[number, number]>([-98, 38]);
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");

  // Reset zoom when clearing selection
  useEffect(() => {
    if (!selected) {
      setCenter([-98, 38]);
      setZoom(1);
    }
  }, [selected]);

  const filteredQuery = query.trim().toLowerCase();
  const matchesQuery = (name?: string) =>
    !filteredQuery || (name ?? "").toLowerCase().includes(filteredQuery);

  const handleSelect = (geo: any) => {
    const centroid = geoCentroid(geo);
    setSelected(geo);
    setCenter([centroid[0], centroid[1]]);
    setZoom(3.2);
  };

  const selectedUsps = useMemo(() => {
    if (!selected) return null;
    const fips = selected.id?.toString().padStart(2, "0");
    return fips ? FIPS_TO_USPS[fips] : null;
  }, [selected]);

  const stat = selectedUsps ? STATE_STATS[selectedUsps] : null;

  return (
    <div className="min-h-screen w-full p-4 md:p-6" style={{ backgroundColor: CICERO.light, color: CICERO.slate }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-serif" style={{ color: CICERO.navy }}>Cicero Institute Policy Map</h1>
          <div className="flex items-center gap-2 w-full max-w-sm ml-auto">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
              <Input
                placeholder="Search state by name…"
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border" style={{ borderColor: CICERO.navy, color: CICERO.navy }} onClick={() => { setSelected(null); setQuery(""); }}>Reset</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* Left: Map */}
          <Card className="overflow-hidden shadow-sm border" style={{ borderColor: CICERO.gray }}>
            <CardContent className="p-2 md:p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="w-full h-[60vh]">
                <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%", backgroundColor: CICERO.light }}>
                  <ZoomableGroup center={center} zoom={zoom} transitionDuration={1200}>
                    <Geographies geography={GEO_URL}>
                      {({ geographies }) => (
                        <>
                          {geographies.map((geo) => {
                            const fips = geo.id?.toString().padStart(2, "0");
                            const usps = fips ? FIPS_TO_USPS[fips] : undefined;
                            const allowed = usps ? ENABLED_STATES.has(usps) : false;
                            const isSelected = selected && selected.id === geo.id;
                            const name = geo.properties?.name as string | undefined;
                            const dimmed = filteredQuery && !matchesQuery(name);

                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onClick={allowed ? () => handleSelect(geo) : undefined}
                                style={{
                                  default: {
                                    outline: "none",
                                    fill: allowed ? (isSelected ? CICERO.gold : (dimmed ? CICERO.gray : "#D7E0EA")) : "#EDEBE7",
                                    stroke: CICERO.navy,
                                    strokeWidth: isSelected ? 1.6 : 0.8,
                                    cursor: allowed ? "pointer" : "default",
                                  },
                                  hover: {
                                    outline: "none",
                                    fill: allowed ? (isSelected ? CICERO.gold : "#E9D9B8") : "#EDEBE7",
                                  },
                                  pressed: {
                                    outline: "none",
                                    fill: allowed ? CICERO.gold : "#EDEBE7",
                                  },
                                }}
                              />
                            );
                          })}
                        </>
                      )}
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </CardContent>
          </Card>

          {/* Right: Stats */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {stat ? (
                <motion.div
                  key={selectedUsps}
                  initial={{ x: 24, opacity: 0, scale: 0.985 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 24, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 26, delay: 0.15 }}
                  className="h-full"
                >
                  <Card className="h-full shadow-sm border" style={{ borderColor: CICERO.gray }}>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl md:text-2xl font-semibold font-serif" style={{ color: CICERO.navy }}>{stat.name} ({selectedUsps})</h2>
                          <p className="text-sm text-muted-foreground">Capital: {stat.capital}</p>
                        </div>
                        <Button className="font-medium" style={{ backgroundColor: CICERO.gold, color: CICERO.navy }} onClick={() => setSelected(null)}>Back to US</Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border p-4">
                          <div className="text-sm" style={{ color: CICERO.navy }}>Population (demo)</div>
                          <div className="text-2xl font-bold">{stat.population}</div>
                        </div>
                        <div className="rounded-2xl border p-4">
                          <div className="text-sm" style={{ color: CICERO.navy }}>GDP (demo)</div>
                          <div className="text-2xl font-bold">{stat.gdp ?? "—"}</div>
                        </div>
                        <div className="rounded-2xl border p-4 sm:col-span-2">
                          <div className="text-sm" style={{ color: CICERO.navy }}>Fun fact</div>
                          <div className="text-base">{stat.fun ?? "Add your own dataset to show interesting facts here."}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm" style={{ color: CICERO.navy }}>
                        <Info className="h-4 w-4 mt-0.5" />
                        <span>
                          Data shown is placeholder/demo. Wire your API or CSV by replacing <code>STATE_STATS</code>.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full"
                >
                  <Card className="h-full shadow-sm border" style={{ borderColor: CICERO.gray }}>
                    <CardContent className="p-6 flex flex-col gap-4 items-start justify-center h-full" style={{ backgroundColor: '#FFFFFF' }}>
                      <h2 className="text-xl md:text-2xl font-semibold font-serif" style={{ color: CICERO.navy }}>Click on our states to view the policies we enacted in them.</h2>
                      <p style={{ color: CICERO.navy, opacity: 0.75 }}>The map will zoom on the left, and details will pop in here.</p>
                      <div className="mt-2 w-full max-w-sm">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
                          <Input
                            placeholder="Search enabled states…"
                            className="pl-8"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional: quick list of search results */}
            <div className="mt-4 hidden">
              <Card className="border" style={{ borderColor: CICERO.gray }}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">Quick jump</div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-2">
                    {Object.values(STATE_STATS)
                      .filter((s) => matchesQuery(s.name))
                      .slice(0, 24)
                      .map((s) => (
                        <Button
                          key={s.name}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Simulate clicking by finding the geography later
                            // (We rely on the user to click the map to truly focus.)
                            setQuery(s.name);
                          }}
                        >
                          {s.name}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
