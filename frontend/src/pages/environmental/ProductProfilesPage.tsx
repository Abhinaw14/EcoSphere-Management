import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productProfileService } from '@/services/product-profile.service';
import { ProductProfile } from '@/types';
import { Plus, Trash2, Box, Droplets, Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProductProfilesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    carbonFootprint: '',
    waterUsage: '',
  });

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['productProfiles'],
    queryFn: productProfileService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: productProfileService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productProfiles'] });
      setIsFormOpen(false);
      setFormData({ name: '', description: '', category: '', carbonFootprint: '', waterUsage: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productProfileService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productProfiles'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      carbonFootprint: parseFloat(formData.carbonFootprint),
      waterUsage: parseFloat(formData.waterUsage),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Box className="h-8 w-8 text-emerald-500" />
            Product Profiles
          </h1>
          <p className="text-muted-foreground mt-1">Lifecycle analysis and environmental footprint by product.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Profile
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <CardHeader>
            <CardTitle>Create Product Profile</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Carbon Footprint (kg CO2e)</Label>
                <Input type="number" step="0.01" min="0" value={formData.carbonFootprint} onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Water Usage (Liters)</Label>
                <Input type="number" step="0.1" min="0" value={formData.waterUsage} onChange={(e) => setFormData({ ...formData, waterUsage: e.target.value })} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Profile</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)
        ) : profiles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <Box className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No product profiles created yet.</p>
          </div>
        ) : (
          profiles.map((profile: ProductProfile) => (
            <Card key={profile.id} className="relative group overflow-hidden border-border hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(profile.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded w-fit mb-2">{profile.category}</div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{profile.description || 'No description.'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Wind className="h-3.5 w-3.5 text-gray-400" /> Carbon</div>
                    <div className="font-semibold text-lg">{profile.carbonFootprint} <span className="text-xs font-normal text-muted-foreground">kg</span></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Droplets className="h-3.5 w-3.5 text-blue-400" /> Water</div>
                    <div className="font-semibold text-lg">{profile.waterUsage} <span className="text-xs font-normal text-muted-foreground">L</span></div>
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
