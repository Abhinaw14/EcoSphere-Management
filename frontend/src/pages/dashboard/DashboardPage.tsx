// ============================================================
// EcoSphere — Dashboard Page
// Admin dashboard with ESG score cards, charts, and statistics
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Users,
  Shield,
  TrendingUp,
  Award,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

// Placeholder data for dashboard
const esgTrendData = [
  { month: 'Jan', environmental: 72, social: 65, governance: 80 },
  { month: 'Feb', environmental: 74, social: 68, governance: 78 },
  { month: 'Mar', environmental: 76, social: 70, governance: 82 },
  { month: 'Apr', environmental: 78, social: 72, governance: 85 },
  { month: 'May', environmental: 80, social: 75, governance: 83 },
  { month: 'Jun', environmental: 82, social: 78, governance: 86 },
];

const esgBreakdown = [
  { name: 'Environmental', value: 40, color: '#10B981' },
  { name: 'Social', value: 30, color: '#6366F1' },
  { name: 'Governance', value: 30, color: '#F59E0B' },
];

const departmentRankings = [
  { department: 'Engineering', score: 87 },
  { department: 'Sustainability', score: 92 },
  { department: 'HR', score: 78 },
  { department: 'Finance', score: 75 },
  { department: 'Marketing', score: 82 },
  { department: 'Operations', score: 70 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  trend?: 'up' | 'down';
}

function StatCard({ title, value, change, icon: Icon, gradient, trend }: StatCardProps) {
  return (
    <motion.div variants={item}>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {change && (
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={`h-3 w-3 ${trend === 'up' ? 'text-success' : 'text-destructive rotate-180'}`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
        {/* Subtle gradient accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} opacity-60`} />
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your ESG performance
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="ESG Score"
          value="82"
          change="+4.2% from last month"
          icon={Globe}
          gradient="gradient-primary"
          trend="up"
        />
        <StatCard
          title="Environmental"
          value="80"
          change="+2.5%"
          icon={Leaf}
          gradient="gradient-success"
          trend="up"
        />
        <StatCard
          title="Social"
          value="78"
          change="+5.1%"
          icon={Users}
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
          trend="up"
        />
        <StatCard
          title="Governance"
          value="86"
          change="+1.8%"
          icon={Shield}
          gradient="gradient-warning"
          trend="up"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* ESG Trend Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  ESG Score Trend
                </CardTitle>
                <Badge variant="secondary">Last 6 months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={esgTrendData}>
                  <defs>
                    <linearGradient id="envGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="socialGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="govGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(215 20.2% 65.1%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20.2% 65.1%)" fontSize={12} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="environmental"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#envGradient)"
                    name="Environmental"
                  />
                  <Area
                    type="monotone"
                    dataKey="social"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#socialGradient)"
                    name="Social"
                  />
                  <Area
                    type="monotone"
                    dataKey="governance"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#govGradient)"
                    name="Governance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* ESG Breakdown Pie Chart */}
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                ESG Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={esgBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {esgBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {esgBreakdown.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Department Rankings & Quick Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Department Rankings */}
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Department Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={departmentRankings} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis dataKey="department" type="category" fontSize={12} width={100} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: 'Active Challenges',
                  value: '12',
                  icon: Target,
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                },
                {
                  label: 'CSR Participation',
                  value: '78%',
                  icon: Users,
                  color: 'text-success',
                  bg: 'bg-success/10',
                },
                {
                  label: 'Compliance Issues',
                  value: '3',
                  icon: AlertTriangle,
                  color: 'text-warning',
                  bg: 'bg-warning/10',
                },
                {
                  label: 'Carbon Reduced',
                  value: '24.5t',
                  icon: Leaf,
                  color: 'text-success',
                  bg: 'bg-success/10',
                },
                {
                  label: 'XP Earned',
                  value: '2,450',
                  icon: Zap,
                  color: 'text-primary',
                  bg: 'bg-primary/10',
                },
                {
                  label: 'Badges Earned',
                  value: '8',
                  icon: Award,
                  color: 'text-warning',
                  bg: 'bg-warning/10',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
