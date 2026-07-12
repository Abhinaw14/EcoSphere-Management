import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentalService } from '@/services/environmental.service';
import { departmentService } from '@/services/department.service';
import api from '@/services/api';
import { EnvironmentalType, EnvironmentalMetric } from '@/types';
import { Plus, Leaf, Droplets, Zap, Trash2, Wind, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function EnvironmentalPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: EnvironmentalType.CARBON,
    value: '',
    unit: 'kg',
    departmentId: '',
    recordedAt: new Date().toISOString().split('T')[0],
  });

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['environmental'],
    queryFn: environmentalService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: environmentalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmental'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: environmentalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmental'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      value: parseFloat(formData.value),
      recordedAt: new Date(formData.recordedAt).toISOString(),
    });
  };

  const downloadReport = async (type: 'pdf' | 'csv') => {
    try {
      const response = await api.get(`/reports/export/${type}`, {
        responseType: 'blob', // Important for file downloads
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ecosphere-report.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Failed to download ${type.toUpperCase()}:`, error);
      alert('Failed to download report.');
    }
  };

  // Prepare data for chart
  const chartData = Object.values(EnvironmentalType).map((type) => {
    const typeMetrics = metrics.filter((m) => m.type === type);
    const totalValue = typeMetrics.reduce((sum, m) => sum + m.value, 0);
    return {
      name: type,
      total: totalValue,
    };
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case EnvironmentalType.CARBON: return <Wind className="text-gray-400" />;
      case EnvironmentalType.ENERGY: return <Zap className="text-yellow-400" />;
      case EnvironmentalType.WATER: return <Droplets className="text-blue-400" />;
      case EnvironmentalType.WASTE: return <Trash2 className="text-red-400" />;
      default: return <Leaf className="text-green-400" />;
    }
  };

  const getGradientForType = (type: string) => {
    switch (type) {
      case EnvironmentalType.CARBON: return 'from-gray-500 to-gray-700';
      case EnvironmentalType.ENERGY: return 'from-yellow-400 to-orange-500';
      case EnvironmentalType.WATER: return 'from-blue-400 to-cyan-500';
      case EnvironmentalType.WASTE: return 'from-red-400 to-rose-600';
      default: return 'from-green-400 to-emerald-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Environmental Impact</h1>
          <p className="text-muted-foreground mt-1">Track and manage your organization's ecological footprint.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadReport('csv')} className="border-border">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> CSV
          </Button>
          <Button variant="outline" onClick={() => downloadReport('pdf')} className="border-border">
            <FileText className="mr-2 h-4 w-4 text-red-500" /> PDF
          </Button>
          <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Metric
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Log New Metric</CardTitle>
            <CardDescription>Record a new environmental data point for a department.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Metric Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EnvironmentalType })}
                  required
                >
                  {Object.values(EnvironmentalType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
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
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g. 150.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. kg, kWh, Liters"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordedAt">Date</Label>
                <Input
                  id="recordedAt"
                  type="date"
                  value={formData.recordedAt}
                  onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Save Metric'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((data) => (
          <Card key={data.name} className="overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getGradientForType(data.name)}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground">{data.name}</CardTitle>
                {getTypeIcon(data.name)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total recorded</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Impact Overview</CardTitle>
            <CardDescription>Aggregate metrics across all departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-xs opacity-50" />
                  <YAxis stroke="currentColor" className="text-xs opacity-50" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs List */}
        <Card className="col-span-1 shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>Latest environmental data entries.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : metrics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Leaf className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No metrics logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {metrics.slice(0, 10).map((metric: EnvironmentalMetric) => (
                  <div key={metric.id} className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-md shadow-sm">
                        {getTypeIcon(metric.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{metric.value} {metric.unit}</p>
                        <p className="text-xs text-muted-foreground">
                          {metric.department?.name || 'Unknown Dept'} • {new Date(metric.recordedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this log?')) {
                          deleteMutation.mutate(metric.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
