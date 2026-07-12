import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceService } from '@/services/governance.service';
import { departmentService } from '@/services/department.service';
import { AuditStatus, GovernanceAudit } from '@/types';
import { Plus, ShieldCheck, AlertTriangle, ShieldAlert, FileText, Trash2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function GovernancePage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: AuditStatus.PENDING,
  });

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['governance-audits'],
    queryFn: governanceService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: governanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
      setIsFormOpen(false);
      setFormData({
        title: '',
        departmentId: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        status: AuditStatus.PENDING,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GovernanceAudit> }) => 
      governanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: governanceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance-audits'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
    });
  };

  const handleStatusChange = (id: string, currentStatus: AuditStatus, newStatus: AuditStatus) => {
    if (currentStatus === newStatus) return;
    updateMutation.mutate({
      id,
      data: { status: newStatus }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case AuditStatus.PASSED: return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      case AuditStatus.FAILED: return <ShieldAlert className="h-5 w-5 text-destructive" />;
      default: return <Calendar className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case AuditStatus.PASSED: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case AuditStatus.FAILED: return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const pendingAudits = audits.filter(a => a.status === AuditStatus.PENDING).length;
  const passedAudits = audits.filter(a => a.status === AuditStatus.PASSED).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Governance & Compliance</h1>
          <p className="text-muted-foreground mt-1">Schedule audits and track organizational compliance.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
          <Plus className="mr-2 h-4 w-4" /> Schedule Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Audits</p>
                <h3 className="text-3xl font-bold mt-2">{pendingAudits}</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passed Compliance</p>
                <h3 className="text-3xl font-bold mt-2">{passedAudits}</h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <h3 className="text-3xl font-bold mt-2">{audits.length}</h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle>Schedule New Audit</CardTitle>
            <CardDescription>Assign an audit to a department.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Audit Title / Subject</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Q3 Ethics & Compliance Review"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Target Department</Label>
                <select
                  id="department"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                >
                  <option value="">Select a department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50 py-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Scheduling...' : 'Schedule Audit'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle>Compliance Records</CardTitle>
          <CardDescription>All scheduled and historical audits.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Audit Title</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Scheduled For</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Loading records...
                    </td>
                  </tr>
                ) : audits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>No audits scheduled.</p>
                    </td>
                  </tr>
                ) : (
                  audits.map((audit: GovernanceAudit) => (
                    <tr key={audit.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                        {getStatusIcon(audit.status)}
                        {audit.title}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {audit.department?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(audit.scheduledDate).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(audit.status)} outline-none cursor-pointer appearance-none text-center`}
                          value={audit.status}
                          onChange={(e) => handleStatusChange(audit.id, audit.status, e.target.value as AuditStatus)}
                          disabled={updateMutation.isPending}
                        >
                          {Object.values(AuditStatus).map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this audit record?')) {
                              deleteMutation.mutate(audit.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
