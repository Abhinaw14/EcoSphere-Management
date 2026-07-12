import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policyService } from '@/services/policy.service';
import { Policy, PolicyStatus } from '@/types';
import { FileText, Plus, Trash2, Edit, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PoliciesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '1.0',
    status: PolicyStatus.DRAFT,
  });

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: policyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: policyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: policyService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: policyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', version: '1.0', status: PolicyStatus.DRAFT });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (policy: Policy) => {
    setFormData({
      title: policy.title,
      description: policy.description || '',
      version: policy.version,
      status: policy.status,
    });
    setEditingId(policy.id);
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

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case PolicyStatus.DRAFT: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
      case PolicyStatus.ACTIVE: return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400';
      case PolicyStatus.ARCHIVED: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-indigo-500" />
            Corporate Policies
          </h1>
          <p className="text-muted-foreground mt-1">Manage ESG regulations, data retention rules, and corporate governance policies.</p>
        </div>
        <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {isFormOpen ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> New Policy</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-indigo-500/20 shadow-lg shadow-indigo-500/5 mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Policy' : 'Draft New Policy'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Policy Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Remote Work Data Security Protocol" />
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} required placeholder="1.0" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as PolicyStatus })} required>
                  {Object.values(PolicyStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description / Abstract</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief overview of the policy..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                {editingId ? 'Save Changes' : 'Draft Policy'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)
        ) : policies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No corporate policies found.</p>
          </div>
        ) : (
          policies.map((item: Policy) => (
            <Card key={item.id} className="relative group overflow-hidden border-border hover:border-indigo-500/30 hover:shadow-md transition-all flex flex-col">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => { if (confirm('Delete this policy?')) deleteMutation.mutate(item.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-mono">
                    v{item.version}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] mt-2">{item.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <ShieldAlert className="h-4 w-4 text-indigo-400" />
                    <span className="font-medium text-foreground">{item._count?.compliances || 0}</span> compliance records
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
