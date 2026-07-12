import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '@/services/reward.service';
import { gamificationService } from '@/services/gamification.service';
import { Reward } from '@/types';
import confetti from 'canvas-confetti';
import { Plus, Trash2, Gift, ShoppingBag, Coins } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RewardsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    xpCost: '',
    stock: '',
    imageUrl: '',
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: rewardService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: rewardService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: rewardService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });

  const redeemMutation = useMutation({
    mutationFn: rewardService.redeem,
    onSuccess: () => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#fce7f3', '#f472b6', '#fbbf24']
      });
      alert('Reward redeemed successfully!');
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      // Invalidate leaderboard or user data to refresh XP if needed
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || 'Failed to redeem reward.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      xpCost: parseInt(formData.xpCost),
      stock: parseInt(formData.stock),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Gift className="h-8 w-8 text-pink-500" />
            Rewards Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">Spend your hard-earned XP on real-world sustainability rewards.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-pink-600 hover:bg-pink-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Reward
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-pink-500/20 shadow-lg shadow-pink-500/5">
          <CardHeader>
            <CardTitle>Add New Reward</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reward Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>XP Cost</Label>
                <Input type="number" min="1" value={formData.xpCost} onChange={(e) => setFormData({ ...formData, xpCost: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Stock Remaining</Label>
                <Input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Reward</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-xl"></div>)
        ) : rewards.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No rewards available in the marketplace.</p>
          </div>
        ) : (
          rewards.map((reward: Reward) => (
            <Card key={reward.id} className="relative group overflow-hidden border-border hover:shadow-lg transition-all flex flex-col">
              <div className="absolute top-2 right-2 p-1 bg-background/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(reward.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                {reward.imageUrl ? (
                  <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover" />
                ) : (
                  <Gift className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${reward.stock > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    {reward.stock > 0 ? `${reward.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{reward.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] text-xs">{reward.description || 'No description'}</CardDescription>
              </CardHeader>
              
              <CardContent className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Coins className="h-5 w-5" />
                  {reward.xpCost} XP
                </div>
                <Button 
                  size="sm" 
                  className="bg-pink-600 hover:bg-pink-700 text-white" 
                  disabled={reward.stock <= 0 || redeemMutation.isPending}
                  onClick={() => { if (confirm(`Redeem ${reward.name} for ${reward.xpCost} XP?`)) redeemMutation.mutate(reward.id); }}
                >
                  Redeem
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
