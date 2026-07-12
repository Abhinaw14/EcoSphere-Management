import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TreePine, Sprout, Leaf } from 'lucide-react';
import api from '@/services/api';

interface ForestStatus {
  totalXP: number;
  totalTrees: number;
  nextTreeAt: number;
}

export default function VirtualForestPage() {
  const { data: status, isLoading } = useQuery<ForestStatus>({
    queryKey: ['forestStatus'],
    queryFn: async () => {
      const response = await api.get('/leaderboard/forest');
      return response.data.data;
    },
    // Refresh every 30 seconds
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <TreePine className="h-12 w-12 text-emerald-500/50 mb-4" />
          <p className="text-muted-foreground">Growing forest...</p>
        </div>
      </div>
    );
  }

  const treesToRender = Math.min(status?.totalTrees || 0, 100); // Cap at 100 for performance
  
  // Deterministic random positioning based on index
  const getTreeStyles = (index: number) => {
    // Basic pseudo-random numbers
    const xPos = ((Math.sin(index * 13.5) + 1) / 2) * 90; // 0 to 90%
    const yPos = ((Math.cos(index * 17.2) + 1) / 2) * 80; // 0 to 80%
    
    // Mix tree sizes
    const sizeMap = [64, 80, 96, 112, 128]; // 4rem to 8rem
    const size = sizeMap[index % sizeMap.length];
    
    // Mix shades of green
    const colorMap = [
      'text-emerald-500', 
      'text-emerald-600', 
      'text-emerald-700', 
      'text-green-500', 
      'text-green-600', 
      'text-teal-600'
    ];
    const color = colorMap[index % colorMap.length];

    // Mix tree types (Pine vs Sprout)
    const type = index % 5 === 0 ? 'sprout' : 'pine';

    return {
      left: `${xPos}%`,
      bottom: `${yPos}%`,
      size,
      color,
      type,
      zIndex: Math.floor(100 - yPos), // Trees lower down (higher yPos means closer to bottom if we position absolute bottom) appear in front
    };
  };

  const progressPercentage = status 
    ? ((status.totalXP % 500) / 500) * 100 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <TreePine className="h-8 w-8 text-emerald-500" />
            Virtual Forest
          </h1>
          <p className="text-muted-foreground mt-1">
            Every 500 XP earned by the company plants a new tree.
          </p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm w-full sm:w-auto min-w-[300px]">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company Impact</p>
              <p className="text-2xl font-bold text-emerald-600">
                {status?.totalTrees.toLocaleString()} Trees
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total XP</p>
              <p className="font-semibold">{status?.totalXP.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-muted-foreground">
            {500 - (status?.totalXP || 0) % 500} XP to next tree
          </p>
        </div>
      </div>

      {/* Forest Canvas */}
      <div className="flex-1 rounded-2xl border border-border bg-gradient-to-b from-sky-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20 relative overflow-hidden shadow-inner">
        
        {/* Background elements (mountains/hills) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-100/50 to-transparent dark:from-emerald-900/10 pointer-events-none" />
        
        {/* Render Trees */}
        {status?.totalTrees === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Sprout className="h-16 w-16 mb-4 opacity-50" />
            <p>The land is empty. Start earning XP to grow the forest!</p>
          </div>
        ) : (
          Array.from({ length: treesToRender }).map((_, i) => {
            const { left, bottom, size, color, type, zIndex } = getTreeStyles(i);
            return (
              <motion.div
                key={i}
                className={`absolute drop-shadow-md ${color}`}
                style={{ 
                  left, 
                  bottom, 
                  zIndex,
                  transformOrigin: 'bottom center'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: (i * 0.05) % 2 // Stagger entrance, but cap delay at 2s
                }}
              >
                {type === 'pine' ? (
                  <TreePine size={size} strokeWidth={1.5} className="fill-current/20" />
                ) : (
                  <Leaf size={size * 0.8} strokeWidth={1.5} className="fill-current/20" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
