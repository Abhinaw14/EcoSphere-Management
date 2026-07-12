import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { gamificationService } from '@/services/gamification.service';
import { User } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LeaderboardPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => gamificationService.getLeaderboard(25),
  });

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50';
      case 1: return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 2: return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      default: return 'bg-muted/50 text-muted-foreground border-transparent';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-amber-500" />;
      case 1: return <Medal className="h-5 w-5 text-slate-400" />;
      case 2: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <span className="font-bold">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-amber-500" />
          EcoSphere Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">Top sustainability champions across the organization.</p>
      </div>

      <Card className="border-border shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border pb-4">
          <div className="flex justify-between items-center px-4">
            <CardTitle className="text-lg font-medium text-muted-foreground">Rank & Player</CardTitle>
            <CardTitle className="text-lg font-medium text-muted-foreground">Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Loading ranks...</div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No XP earned yet.</p>
              </div>
            ) : (
              users.map((user: User, index: number) => (
                <div key={user.id} className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 ${index < 3 ? 'bg-muted/10' : ''}`}>
                  <div className="flex items-center gap-5">
                    {/* Rank Badge */}
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${getRankStyle(index)}`}>
                      {getRankIcon(index)}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 border border-border shadow-sm rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" />
                        ) : (
                          <span>{user.firstName[0]}{user.lastName[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.department?.name || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 font-black text-xl text-amber-500">
                    {user.xpPoints.toLocaleString()} <span className="text-xs text-muted-foreground font-medium uppercase mt-1">XP</span>
                    {index === 0 && <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
