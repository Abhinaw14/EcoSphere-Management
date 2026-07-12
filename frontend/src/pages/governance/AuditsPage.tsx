import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceAuditService } from '@/services/governance-audit.service';
import { userService } from '@/services/user.service';
import { departmentService } from '@/services/department.service';
import { GovernanceAudit, AuditStatus, User, Department } from '@/types';
import { ClipboardCheck, Plus, Trash2, Calendar, Edit, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuditsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    auditorId: '',
    departmentId: '',
    scheduledDate: '',
    status: AuditStatus.PENDING,
  });

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['governance-audits'],
    queryFn: governanceAuditService.getAll,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: governanceAuditService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: governanceAuditService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: governanceAuditService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', auditorId: '', departmentId: '', scheduledDate: '', status: AuditStatus.PENDING });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (audit: GovernanceAudit) => {
    setFormData({
      title: audit.title,
      auditorId: audit.auditorId,
      departmentId: audit.departmentId,
      scheduledDate: new Date(audit.scheduledDate).toISOString().slice(0, 16),
      status: audit.status,
    });
    setEditingId(audit.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.PENDING: return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">PENDING</span>;
      case AuditStatus.PASSED: return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">PASSED</span>;
      case AuditStatus.FAILED: return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">FAILED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-teal-500" />
            Internal Audits
          </h1>
          <p className="text-muted-foreground mt-1">Schedule and manage internal ESG compliance audits.</p>
        </div>
        <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          {isFormOpen ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Schedule Audit</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-teal-500/20 shadow-lg shadow-teal-500/5 mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Audit' : 'Schedule New Audit'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Audit Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Q3 Energy Compliance Audit" />
              </div>
              <div className="space-y-2">
                <Label>Target Department</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} required>
                  <option value="" disabled>Select Department</option>
                  {departments.map((d: Department) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Auditor</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.auditorId} onChange={(e) => setFormData({ ...formData, auditorId: e.target.value })} required>
                  <option value="" disabled>Select Auditor</option>
                  {users.map((u: User) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date & Time</Label>
                <Input type="datetime-local" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} required />
              </div>
              {editingId && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as AuditStatus })} required>
                    {Object.values(AuditStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-teal-600 hover:bg-teal-700">
                {editingId ? 'Save Changes' : 'Schedule Audit'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />)}
            </div>
          ) : audits.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No audits scheduled.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Audit Title</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Auditor</th>
                    <th className="px-6 py-4 font-medium">Schedule</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 w-[100px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {audits.map((audit: GovernanceAudit) => (
                    <tr key={audit.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground">{audit.title}</td>
                      <td className="px-6 py-4">{audit.department?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                            {audit.auditor?.firstName?.[0]}{audit.auditor?.lastName?.[0]}
                          </div>
                          {audit.auditor?.firstName} {audit.auditor?.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(audit.scheduledDate).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(audit.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500" onClick={() => handleEdit(audit)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => { if (confirm('Delete this audit?')) deleteMutation.mutate(audit.id); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
