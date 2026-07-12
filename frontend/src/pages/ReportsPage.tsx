import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, Users, ShieldCheck, Trophy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: reportService.getAnalytics,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
        <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  const { environmental, social, governance, engagement } = data;

  const envChartData = [
    { name: 'Emissions', value: environmental.totalEmissions },
    { name: 'Offsets', value: environmental.totalOffsets },
    { name: 'Credits', value: environmental.totalCredits },
  ];
  const COLORS = ['#ef4444', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            📊 ESG Analytics Hub
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive overview of corporate sustainability, social, and governance metrics.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-emerald-500/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Carbon</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">{environmental.netCarbon} tCO2e</h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 dark:bg-emerald-900/30">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volunteer Hours</p>
                <h3 className="text-2xl font-bold mt-1 text-purple-600">{social.totalVolunteerHours}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600 dark:bg-purple-900/30">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <h3 className="text-2xl font-bold mt-1 text-cyan-600">{governance.complianceRate.toFixed(1)}%</h3>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg text-cyan-600 dark:bg-cyan-900/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Initiatives</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-600">{social.activeInitiativesCount}</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg text-amber-600 dark:bg-amber-900/30">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Environmental Breakdown</CardTitle>
            <CardDescription>Emissions vs Offsets vs Credits (tCO2e)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={envChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {envChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Sustainability Contributors</CardTitle>
            <CardDescription>Employees with the highest XP from Gamification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagement.topUsers.map((user, idx) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-primary'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  <div className="font-bold text-primary">{user.xpPoints} XP</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
