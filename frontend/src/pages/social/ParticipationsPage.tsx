import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialParticipationService } from '@/services/social-participation.service';
import { socialInitiativeService } from '@/services/social-initiative.service';
import { SocialParticipation, SocialInitiative, Status } from '@/types';
import { Plus, Trash2, UserPlus, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function ParticipationsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    initiativeId: '',
    hoursLogged: '',
  });

  const { data: participations = [], isLoading } = useQuery({
    queryKey: ['social-participations'],
    queryFn: socialParticipationService.getAll,
  });

  const { data: initiatives = [] } = useQuery({
    queryKey: ['social-initiatives'],
    queryFn: socialInitiativeService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: socialParticipationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-participations'] });
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
      setIsFormOpen(false);
      setFormData({ initiativeId: '', hoursLogged: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: socialParticipationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-participations'] });
      queryClient.invalidateQueries({ queryKey: ['social-initiatives'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      initiativeId: formData.initiativeId,
      hoursLogged: parseFloat(formData.hoursLogged),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-purple-500" />
            Volunteer Participations
          </h1>
          <p className="text-muted-foreground mt-1">Log and track employee volunteer hours across initiatives.</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-purple-600 hover:bg-purple-700 text-white">
          {isFormOpen ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Log Hours</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-purple-500/20 shadow-lg shadow-purple-500/5 mb-8">
          <CardHeader>
            <CardTitle>Log Volunteer Hours</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Initiative</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.initiativeId} onChange={(e) => setFormData({ ...formData, initiativeId: e.target.value })} required>
                  <option value="" disabled>Select Initiative</option>
                  {initiatives.map((init: SocialInitiative) => (
                    <option key={init.id} value={init.id}>{init.title} ({init.department?.name})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Hours Logged</Label>
                <Input type="number" step="0.5" min="0.5" value={formData.hoursLogged} onChange={(e) => setFormData({ ...formData, hoursLogged: e.target.value })} required placeholder="e.g. 4.5" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
                Submit Hours
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Volunteer Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />)}
            </div>
          ) : participations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No volunteer hours have been logged yet.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Employee</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Initiative</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Department</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Date Logged</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Hours</th>
                    <th className="px-4 py-3 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {participations.map((log: SocialParticipation) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                            {log.user?.firstName?.[0]}{log.user?.lastName?.[0]}
                          </div>
                          {log.user?.firstName} {log.user?.lastName}
                        </div>
                      </td>
                      <td className="px-4 py-3">{log.initiative?.title}</td>
                      <td className="px-4 py-3">{log.initiative?.department?.name || 'N/A'}</td>
                      <td className="px-4 py-3">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-purple-600">{log.hoursLogged}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm('Delete this log?')) deleteMutation.mutate(log.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
