import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService } from '@/services/compliance.service';
import { policyService } from '@/services/policy.service';
import { departmentService } from '@/services/department.service';
import { ComplianceRecord, ComplianceStatus, Policy, Department } from '@/types';
import { ShieldCheck, Plus, Trash2, Edit, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CompliancePage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    policyId: '',
    departmentId: '',
    status: ComplianceStatus.PENDING,
    notes: '',
  });

  const { data: compliances = [], isLoading } = useQuery({
    queryKey: ['compliances'],
    queryFn: complianceService.getAll,
  });

  const { data: policies = [] } = useQuery({
    queryKey: ['policies'],
    queryFn: policyService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: complianceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: complianceService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: complianceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
    },
  });

  const resetForm = () => {
    setFormData({ policyId: '', departmentId: '', status: ComplianceStatus.PENDING, notes: '' });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (record: ComplianceRecord) => {
    setFormData({
      policyId: record.policyId,
      departmentId: record.departmentId,
      status: record.status,
      notes: record.notes || '',
    });
    setEditingId(record.id);
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

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT: return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case ComplianceStatus.NON_COMPLIANT: return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      case ComplianceStatus.PENDING: return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-cyan-500" />
            Compliance Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track department adherence to corporate policies and ESG standards.</p>
        </div>
        <Button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          {isFormOpen ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Log Compliance</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-cyan-500/20 shadow-lg shadow-cyan-500/5 mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Update Compliance Status' : 'Log Department Compliance'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Policy</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.policyId} onChange={(e) => setFormData({ ...formData, policyId: e.target.value })} required disabled={!!editingId}>
                  <option value="" disabled>Select Policy</option>
                  {policies.map((p: Policy) => <option key={p.id} value={p.id}>{p.title} (v{p.version})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Department</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} required disabled={!!editingId}>
                  <option value="" disabled>Select Department</option>
                  {departments.map((d: Department) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Compliance Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ComplianceStatus })} required>
                  {Object.values(ComplianceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Auditor Notes</Label>
                <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Findings or reasons for non-compliance..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {editingId ? 'Save Changes' : 'Log Record'}
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
          ) : compliances.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No compliance records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Policy</th>
                    <th className="px-6 py-4 font-medium">Last Assessed</th>
                    <th className="px-6 py-4 font-medium w-1/3">Notes</th>
                    <th className="px-6 py-4 w-[100px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {compliances.map((record: ComplianceRecord) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-medium flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span>{record.status}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">{record.department?.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{record.policy?.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(record.assessedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]" title={record.notes || ''}>
                        {record.notes || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-cyan-500" onClick={() => handleEdit(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => { if (confirm('Delete this record?')) deleteMutation.mutate(record.id); }}>
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
