import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialInitiativeService } from '@/services/social-initiative.service';
import { departmentService } from '@/services/department.service';
import { SocialInitiative, InitiativeStatus, Department } from '@/types';
import { Plus, Trash2, Heart, Users, Clock, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CSRActivitiesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    status: InitiativeStatus.PLANNING,
  });

  const { data: initiatives = [], isLoading } = useQuery({
    queryKey: ['social-initiatives'],
    queryFn: socialInitiativeService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: socialInitiativeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: socialInitiativeService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: socialInitiativeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', departmentId: '', status: InitiativeStatus.PLANNING });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (initiative: SocialInitiative) => {
    setFormData({
      title: initiative.title,
      description: initiative.description || '',
      departmentId: initiative.departmentId,
      status: initiative.status,
    });
    setEditingId(initiative.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusColor = (status: InitiativeStatus) => {
    switch (status) {
      case InitiativeStatus.PLANNING: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case InitiativeStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      case InitiativeStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
      case InitiativeStatus.CANCELLED: return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" />
            CSR Activities
          </h1>
          <p className="text-muted-foreground mt-1">Manage Corporate Social Responsibility initiatives and events.</p>
        </div>
        <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white">
          {isFormOpen ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> New Initiative</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-rose-500/20 shadow-lg shadow-rose-500/5 mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Initiative' : 'Create New CSR Initiative'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Initiative Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Beach Cleanup 2026" />
              </div>
              <div className="space-y-2">
                <Label>Department Lead</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} required>
                  <option value="" disabled>Select Department</option>
                  {departments.map((d: Department) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as InitiativeStatus })} required>
                  {Object.values(InitiativeStatus).map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Details about this initiative..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-rose-600 hover:bg-rose-700">
                {editingId ? 'Save Changes' : 'Create Initiative'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)
        ) : initiatives.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No CSR initiatives found. Time to give back!</p>
          </div>
        ) : (
          initiatives.map((item: SocialInitiative) => (
            <Card key={item.id} className="relative group overflow-hidden border-border hover:border-rose-500/30 hover:shadow-md transition-all flex flex-col">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Delete this initiative?')) deleteMutation.mutate(item.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{item.department?.name}</span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{item.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-foreground">{item.participantsCount}</span> participants
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-rose-400" />
                    <span className="font-medium text-foreground">{item.hoursLogged.toFixed(1)}</span> hours
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
