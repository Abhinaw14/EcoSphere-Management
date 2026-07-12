import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';
import { Badge } from '@/types';
import { Plus, Trash2, Award, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BadgesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏆', // Default emoji icon
    xpThreshold: '',
  });

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: gamificationService.getBadges,
  });

  const createMutation = useMutation({
    mutationFn: gamificationService.createBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: gamificationService.deleteBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      xpThreshold: parseInt(formData.xpThreshold),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="h-8 w-8 text-fuchsia-500" />
            Badge Collection
          </h1>
          <p className="text-muted-foreground mt-1">Unlock badges by accumulating XP.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Badge
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
          <CardHeader>
            <CardTitle>Design New Badge</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>XP Threshold</Label>
                <Input type="number" min="0" value={formData.xpThreshold} onChange={(e) => setFormData({ ...formData, xpThreshold: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Icon (Emoji or URL)</Label>
                <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Badge</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-full"></div>)
        ) : badges.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No badges configured.</p>
          </div>
        ) : (
          badges.map((badge: Badge) => (
            <div key={badge.id} className="group relative flex flex-col items-center p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-fuchsia-300 transition-all text-center">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(badge.id); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 dark:from-fuchsia-900/40 dark:to-fuchsia-800/40 border-4 border-background shadow-inner text-4xl mb-3">
                {badge.icon.startsWith('http') ? (
                  <img src={badge.icon} alt={badge.name} className="h-12 w-12 object-contain" />
                ) : (
                  badge.icon
                )}
              </div>
              <h3 className="font-bold text-foreground text-sm line-clamp-1">{badge.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-2">{badge.description}</p>
              <div className="mt-auto inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <Star className="h-3 w-3 fill-muted-foreground" />
                {badge.xpThreshold} XP
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
