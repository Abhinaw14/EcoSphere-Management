import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carbonTransactionService } from '@/services/carbon-transaction.service';
import { departmentService } from '@/services/department.service';
import { CarbonTransaction, TransactionType } from '@/types';
import { Plus, Trash2, ArrowRightLeft, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CarbonTransactionsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: TransactionType.OFFSET,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    departmentId: '',
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['carbonTransactions'],
    queryFn: carbonTransactionService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: carbonTransactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonTransactions'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: carbonTransactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carbonTransactions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    });
  };

  const getTypeStyles = (type: TransactionType) => {
    switch (type) {
      case TransactionType.OFFSET: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <ArrowDownRight className="h-5 w-5 text-emerald-500" /> };
      case TransactionType.CREDIT: return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <FileText className="h-5 w-5 text-blue-500" /> };
      case TransactionType.EMISSION: return { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: <ArrowUpRight className="h-5 w-5 text-rose-500" /> };
    }
  };

  // Compute balance
  const totalOffset = transactions.filter(t => t.type === TransactionType.OFFSET).reduce((sum, t) => sum + t.amount, 0);
  const totalEmission = transactions.filter(t => t.type === TransactionType.EMISSION).reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalEmission - totalOffset;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-8 w-8 text-cyan-500" />
            Carbon Ledger
          </h1>
          <p className="text-muted-foreground mt-1">Track carbon emissions, credits, and offsets.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Record Transaction
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-cyan-500/20 shadow-lg shadow-cyan-500/5">
          <CardHeader>
            <CardTitle>Record Carbon Transaction</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })} required>
                  <option value={TransactionType.OFFSET}>Offset (Reduction)</option>
                  <option value={TransactionType.CREDIT}>Credit (Purchased)</option>
                  <option value={TransactionType.EMISSION}>Emission (Increase)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount (Tons CO2e)</Label>
                <Input type="number" step="0.1" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Department (Optional)</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}>
                  <option value="">Organization-wide</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Purchased from VERRA..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total Emissions Logged</div>
            <div className="text-2xl font-bold text-rose-500">{totalEmission.toLocaleString()} tCO2e</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total Offsets & Credits</div>
            <div className="text-2xl font-bold text-emerald-500">{totalOffset.toLocaleString()} tCO2e</div>
          </CardContent>
        </Card>
        <Card className={netBalance <= 0 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-rose-500/50 bg-rose-500/5'}>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm font-medium mb-2">Net Carbon Balance</div>
            <div className={`text-2xl font-bold ${netBalance <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {netBalance.toLocaleString()} tCO2e
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {netBalance <= 0 ? 'Net Zero or Carbon Negative 🌍' : 'Carbon Positive ⚠️'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>Chronological list of all carbon movements.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading ledger...</div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                No transactions recorded.
              </div>
            ) : (
              transactions.map((tx: CarbonTransaction) => {
                const styles = getTypeStyles(tx.type);
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${styles.bg}`}>
                        {styles.icon}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>{tx.amount} tCO2e</span>
                          <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-sm bg-background border ${styles.color}`}>
                            {tx.type}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {new Date(tx.date).toLocaleDateString()} • {tx.department?.name || 'Org-wide'} 
                          {tx.description && ` • ${tx.description}`}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => { if (confirm('Delete transaction?')) deleteMutation.mutate(tx.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
