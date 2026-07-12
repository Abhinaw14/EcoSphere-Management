import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';
import { Challenge, ChallengeStatus } from '@/types';
import { Plus, Trash2, Zap, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChallengesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xpReward: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ChallengeStatus.ACTIVE,
  });

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: gamificationService.getChallenges,
  });

  const createMutation = useMutation({
    mutationFn: gamificationService.createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: gamificationService.deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      xpReward: parseInt(formData.xpReward),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    });
  };

  const getStatusIcon = (status: ChallengeStatus) => {
    switch (status) {
      case ChallengeStatus.ACTIVE: return <Zap className="h-5 w-5 text-amber-500" />;
      case ChallengeStatus.COMPLETED: return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case ChallengeStatus.UPCOMING: return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Zap className="h-8 w-8 text-amber-500" />
            Active Challenges
          </h1>
          <p className="text-muted-foreground mt-1">Complete tasks to earn XP and climb the leaderboard.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Challenge
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-amber-500/20 shadow-lg shadow-amber-500/5">
          <CardHeader>
            <CardTitle>New Challenge</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Challenge Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>XP Reward</Label>
                <Input type="number" min="1" value={formData.xpReward} onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ChallengeStatus })} required>
                  <option value={ChallengeStatus.ACTIVE}>Active</option>
                  <option value={ChallengeStatus.UPCOMING}>Upcoming</option>
                  <option value={ChallengeStatus.COMPLETED}>Completed</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What do users need to do to complete this?" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Challenge</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)
        ) : challenges.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No active challenges. Time to create some!</p>
          </div>
        ) : (
          challenges.map((challenge: Challenge) => (
            <Card key={challenge.id} className="relative group overflow-hidden border-border hover:border-amber-500/30 hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(challenge.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(challenge.status)}
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{challenge.status}</span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{challenge.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{challenge.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Ends: {new Date(challenge.endDate).toLocaleDateString()}
                  </div>
                  <div className="font-bold text-lg text-amber-500 flex items-center gap-1">
                    +{challenge.xpReward} <span className="text-xs text-muted-foreground">XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
