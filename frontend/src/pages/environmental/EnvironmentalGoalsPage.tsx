import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentalGoalService } from '@/services/environmental-goal.service';
import { departmentService } from '@/services/department.service';
import { EnvironmentalGoal, GoalStatus } from '@/types';
import { Plus, Trash2, Target, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EnvironmentalGoalsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    unit: '',
    deadline: new Date().toISOString().split('T')[0],
    departmentId: '',
    status: GoalStatus.IN_PROGRESS,
  });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['environmentalGoals'],
    queryFn: environmentalGoalService.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: environmentalGoalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: environmentalGoalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      deadline: new Date(formData.deadline).toISOString(),
    });
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.ACHIEVED: return 'bg-emerald-500 text-white';
      case GoalStatus.MISSED: return 'bg-rose-500 text-white';
      default: return 'bg-amber-500 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="h-8 w-8 text-amber-500" />
            Environmental Goals
          </h1>
          <p className="text-muted-foreground mt-1">Set, track, and achieve sustainability targets.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-amber-500/20 shadow-lg shadow-amber-500/5">
          <CardHeader>
            <CardTitle>Create Goal</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} required>
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Value</Label>
                <Input type="number" step="0.1" min="0" value={formData.targetValue} onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Unit (e.g. Tons CO2, kWh)</Label>
                <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>Save Goal</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {isLoading ? (
          [1, 2].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)
        ) : goals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No goals defined yet.</p>
          </div>
        ) : (
          goals.map((goal: EnvironmentalGoal) => {
            const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
            return (
              <Card key={goal.id} className="relative group border-border">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(goal.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>{goal.status.replace('_', ' ')}</span>
                  </div>
                  <CardTitle className="text-xl pr-6">{goal.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">{goal.currentValue} {goal.unit}</span>
                      <span className="text-muted-foreground">Target: {goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t py-3 text-xs text-muted-foreground flex justify-between">
                  <span>{goal.department?.name || 'Organization-wide'}</span>
                  <span>{progress.toFixed(1)}% Complete</span>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
