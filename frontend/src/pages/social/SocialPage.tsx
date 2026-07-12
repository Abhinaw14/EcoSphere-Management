import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '@/services/social.service';
import { departmentService } from '@/services/department.service';
import { InitiativeStatus, SocialInitiative } from '@/types';
import { Plus, Users, Clock, Trash2, Edit2, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function SocialPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    participantsCount: 0,
    hoursLogged: 0,
    status: InitiativeStatus.PLANNING,
  });

  const { data: initiatives = [], isLoading } = useQuery({
    queryKey: ['social-initiatives'],
    queryFn: socialService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: socialService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
      setIsFormOpen(false);
      setFormData({
        title: '',
        description: '',
        departmentId: '',
        participantsCount: 0,
        hoursLogged: 0,
        status: InitiativeStatus.PLANNING,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialInitiative> }) => 
      socialService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: socialService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      participantsCount: parseInt(formData.participantsCount.toString(), 10),
      hoursLogged: parseFloat(formData.hoursLogged.toString()),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case InitiativeStatus.PLANNING: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case InitiativeStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case InitiativeStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case InitiativeStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const totalParticipants = initiatives.reduce((sum, init) => sum + init.participantsCount, 0);
  const totalHours = initiatives.reduce((sum, init) => sum + init.hoursLogged, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Social Initiatives</h1>
          <p className="text-muted-foreground mt-1">Manage CSR events, community outreach, and team well-being.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-rose-500 hover:bg-rose-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Initiative
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white/90">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold">{totalParticipants.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-400 to-orange-500 text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white/90">Community Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold">{totalHours.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <Card className="border-rose-500/20 shadow-lg shadow-rose-500/5">
          <CardHeader>
            <CardTitle>Create Initiative</CardTitle>
            <CardDescription>Start a new social impact project.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Local Beach Cleanup"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the activity"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    required
                  >
                    <option value="">Select an organizing department...</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InitiativeStatus })}
                    required
                  >
                    {Object.values(InitiativeStatus).map((status) => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="participantsCount">Participants (Optional)</Label>
                  <Input
                    id="participantsCount"
                    type="number"
                    min="0"
                    value={formData.participantsCount}
                    onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value as any })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursLogged">Hours Logged (Optional)</Label>
                  <Input
                    id="hoursLogged"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.hoursLogged}
                    onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value as any })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Initiative'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-muted/50 border-none" />
          ))}
        </div>
      ) : initiatives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Heart className="h-12 w-12 text-rose-300 mb-4 opacity-50" />
            <p className="text-lg font-medium text-foreground">No Social Initiatives</p>
            <p className="text-sm">Start by creating a new community outreach or team event.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative: SocialInitiative) => (
            <Card key={initiative.id} className="group hover:shadow-md transition-all border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 rounded-full shadow-sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this initiative?')) {
                      deleteMutation.mutate(initiative.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`font-normal shadow-sm ${getStatusColor(initiative.status)}`} variant="secondary">
                    {initiative.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-1 pr-8">{initiative.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {initiative.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span>{initiative.participantsCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-rose-500" />
                    <span>{initiative.hoursLogged}h</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between border-t p-4 bg-muted/10">
                <span>{initiative.department?.name || 'No Dept'}</span>
                <span>{new Date(initiative.createdAt).toLocaleDateString()}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
