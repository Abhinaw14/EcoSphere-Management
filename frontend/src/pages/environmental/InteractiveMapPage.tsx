import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Wind, Droplets } from 'lucide-react';
import api from '@/services/api';
import { EnvironmentalType, EnvironmentalMetric } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

const geoUrl = "/features.json";

interface Location {
  name: string;
  coordinates: [number, number];
  departmentIds: string[]; // which departments run here
}

const LOCATIONS: Location[] = [
  { name: 'New York (HQ)', coordinates: [-74.006, 40.7128], departmentIds: [] },
  { name: 'London', coordinates: [-0.1276, 51.5074], departmentIds: [] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], departmentIds: [] },
  { name: 'Singapore', coordinates: [103.8198, 1.3521], departmentIds: [] },
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749], departmentIds: [] },
];

export default function InteractiveMapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['environmentalMap'],
    queryFn: async () => {
      const res = await api.get('/environmental');
      return res.data.data;
    },
  });

  // Calculate random stats for demo purposes since we don't have location data per metric.
  // In a real app, `metrics` would be filtered by the `Location`'s department ID.
  const getLocationStats = (locName: string) => {
    // Generate deterministic values based on location name length for the demo
    const seed = locName.length * 13;
    return {
      carbon: (1500 + seed * 12).toLocaleString(),
      water: (5000 + seed * 45).toLocaleString(),
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-500" />
            Global Footprint
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive map of EcoSphere's global environmental impact.
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-border bg-slate-900 relative overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Render Map */}
        <div className="w-full h-full max-w-6xl max-h-[800px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140 }}
            width={800}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b" // slate-800
                    stroke="#334155" // slate-700
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#334155", outline: "none" },
                      pressed: { fill: "#475569", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {LOCATIONS.map((loc, i) => (
              <Marker 
                key={loc.name} 
                coordinates={loc.coordinates}
                onClick={() => setSelectedLocation(loc)}
                onMouseEnter={() => setSelectedLocation(loc)}
              >
                <circle 
                  r={5} 
                  fill="#3b82f6" // blue-500
                  className="cursor-pointer hover:fill-blue-400 transition-colors" 
                  style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))" }}
                />
                
                {/* Glowing ring animation */}
                <circle 
                  r={12} 
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  opacity={0.5}
                  className="animate-ping"
                  style={{ transformOrigin: "center" }}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Data Drawer/Tooltip */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-8 right-8 w-80"
            >
              <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 text-slate-100 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{selectedLocation.name}</h3>
                    <button 
                      onClick={() => setSelectedLocation(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Wind className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm">Carbon Emissions</span>
                      </div>
                      <span className="font-semibold text-emerald-400">
                        {getLocationStats(selectedLocation.name).carbon} kg
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Water Usage</span>
                      </div>
                      <span className="font-semibold text-blue-400">
                        {getLocationStats(selectedLocation.name).water} L
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
