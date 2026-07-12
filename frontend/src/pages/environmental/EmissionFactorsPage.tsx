import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emissionFactorService } from '@/services/emission-factor.service';
import { EmissionFactor } from '@/types';
import { Plus, Trash2, Factory, Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EmissionFactorsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    factor: '',
    unit: '',
    gasType: 'CO2e',
    region: 'Global',
  });

  const { data: factors = [], isLoading } = useQuery({
    queryKey: ['emissionFactors'],
    queryFn: emissionFactorService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: emissionFactorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
      setIsFormOpen(false);
      setFormData({ source: '', factor: '', unit: '', gasType: 'CO2e', region: 'Global' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emissionFactorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emissionFactors'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      factor: parseFloat(formData.factor),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Wind className="h-8 w-8 text-indigo-500" />
            Emission Factors
          </h1>
          <p className="text-muted-foreground mt-1">Manage static emission conversion factors for calculations.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Factor
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <CardHeader>
            <CardTitle>Add New Emission Factor</CardTitle>
            <CardDescription>Create a reference data point for calculating carbon footprints.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source (e.g. Electricity Grid)</Label>
                <Input id="source" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="factor">Factor Value</Label>
                <Input id="factor" type="number" step="0.0001" min="0" value={formData.factor} onChange={(e) => setFormData({ ...formData, factor: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit (e.g. kgCO2e/kWh)</Label>
                <Input id="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gasType">Gas Type</Label>
                <select id="gasType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.gasType} onChange={(e) => setFormData({ ...formData, gasType: e.target.value })} required>
                  <option value="CO2e">CO2e</option>
                  <option value="CO2">CO2</option>
                  <option value="CH4">CH4</option>
                  <option value="N2O">N2O</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="region">Region / Scope</Label>
                <Input id="region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Factor</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Factor</th>
                  <th className="px-6 py-4 font-medium">Unit</th>
                  <th className="px-6 py-4 font-medium">Gas Type</th>
                  <th className="px-6 py-4 font-medium">Region</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                ) : factors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Factory className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      No emission factors found.
                    </td>
                  </tr>
                ) : (
                  factors.map((factor: EmissionFactor) => (
                    <tr key={factor.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{factor.source}</td>
                      <td className="px-6 py-4">{factor.factor}</td>
                      <td className="px-6 py-4">{factor.unit}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md text-xs">{factor.gasType}</span></td>
                      <td className="px-6 py-4 text-muted-foreground">{factor.region || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => { if (confirm('Delete this factor?')) deleteMutation.mutate(factor.id); }}>
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
