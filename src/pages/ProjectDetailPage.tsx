import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { KPICard } from '../components/KPICard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowLeft, Clock, DollarSign, TrendingUp, Calendar, Activity, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TimeEntry, Project, getClientById } from '../lib/mockData';
import { calculateProjectMetrics, formatCurrency, formatNumber, formatDate, groupEntriesByWeek } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProjectDetailPageProps {
  projectId: string;
  project: Project;
  entries: TimeEntry[];
  onBack: () => void;
}

export function ProjectDetailPage({ projectId, project, entries, onBack }: ProjectDetailPageProps) {
  const [groupBy, setGroupBy] = useState<'week' | 'task' | 'person'>('week');

  const projectEntries = useMemo(() => {
    return entries.filter(e => e.projectId === projectId);
  }, [entries, projectId]);

  const metrics = useMemo(() => {
    return calculateProjectMetrics(project, projectEntries);
  }, [project, projectEntries]);

  const client = getClientById(project.clientId);

  // Weekly data
  const weeklyData = useMemo(() => {
    const grouped = groupEntriesByWeek(projectEntries);
    return Array.from(grouped.entries())
      .map(([week, entries]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: entries.reduce((sum, e) => sum + e.hours, 0),
        billable: entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0),
        nonBillable: entries.filter(e => !e.billable).reduce((sum, e) => sum + e.hours, 0),
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }, [projectEntries]);

  // Task distribution
  const taskData = useMemo(() => {
    const tasks = new Map<string, number>();
    projectEntries.forEach(entry => {
      const current = tasks.get(entry.taskName) || 0;
      tasks.set(entry.taskName, current + entry.hours);
    });
    return Array.from(tasks.entries())
      .map(([task, hours]) => ({ task, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);
  }, [projectEntries]);

  // Person distribution
  const personData = useMemo(() => {
    const people = new Map<string, number>();
    projectEntries.forEach(entry => {
      const current = people.get(entry.userName) || 0;
      people.set(entry.userName, current + entry.hours);
    });
    return Array.from(people.entries())
      .map(([name, hours]) => ({ name, hours }))
      .sort((a, b) => b.hours - a.hours);
  }, [projectEntries]);

  // Cumulative hours
  const cumulativeData = useMemo(() => {
    const sorted = [...projectEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
    let cumulative = 0;
    const budgetLine = project.budgetHours || 0;
    
    return sorted.reduce((acc, entry, idx) => {
      cumulative += entry.hours;
      if (idx % 5 === 0 || idx === sorted.length - 1) {
        acc.push({
          date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          actual: cumulative,
          budget: budgetLine,
        });
      }
      return acc;
    }, [] as Array<{ date: string; actual: number; budget: number }>);
  }, [projectEntries, project.budgetHours]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#6366F1'];

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
      over: 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    const labels = {
      healthy: 'En Marcha',
      warning: 'Alerta',
      critical: 'Crítico',
      over: 'Sobre Presupuesto',
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Proyectos
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-gray-50 mb-2">{project.name}</h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-600 dark:text-gray-400">{client?.name}</p>
              {getStatusBadge(metrics.status)}
              <Badge variant="outline">{project.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Horas Consumidas"
          value={formatNumber(metrics.hoursConsumed, 'es-ES', 0) + ' h'}
          subtitle={`${formatNumber(metrics.percentConsumed, 'es-ES', 1)}% de ${formatNumber(project.budgetHours || 0, 'es-ES', 0)}h`}
          icon={Clock}
          status={metrics.status}
        />
        <KPICard
          title="Presupuesto Consumido"
          value={formatCurrency(metrics.budgetConsumed)}
          subtitle={`de ${formatCurrency(project.budgetAmount || 0)}`}
          icon={DollarSign}
          status={metrics.status}
        />
        <KPICard
          title="Horas Restantes"
          value={formatNumber(metrics.hoursRemaining, 'es-ES', 0) + ' h'}
          subtitle={formatCurrency(metrics.budgetRemaining) + ' restante'}
          icon={Activity}
          status="neutral"
        />
        <KPICard
          title="Tasa de Consumo"
          value={formatNumber(metrics.burnRate, 'es-ES', 1) + ' h/día'}
          subtitle="Promedio últimos 14 días"
          icon={TrendingUp}
          status="neutral"
        />
        <KPICard
          title="Fecha de Agotamiento"
          value={metrics.forecastDate ? formatDate(metrics.forecastDate, 'es-ES').split(',')[0] : 'N/A'}
          subtitle={metrics.forecastDate ? `${Math.ceil(metrics.forecastDays)} días` : 'Calculando...'}
          icon={Calendar}
          status={
            !metrics.forecastDate ? 'neutral' :
            metrics.forecastDays < 30 ? 'critical' :
            metrics.forecastDays < 60 ? 'warning' : 'healthy'
          }
        />
        <KPICard
          title="Ratio Facturable"
          value={formatNumber(metrics.percentBillable, 'es-ES', 0) + '%'}
          subtitle={`${formatNumber(metrics.billableHours, 'es-ES', 0)}h facturables`}
          icon={Activity}
          status={metrics.percentBillable >= 80 ? 'healthy' : metrics.percentBillable >= 60 ? 'warning' : 'critical'}
        />
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-900 dark:text-gray-50">Progreso del Presupuesto</span>
              <span className={cn(
                metrics.percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                metrics.percentConsumed >= 90 ? 'text-red-600 dark:text-red-500' :
                metrics.percentConsumed >= 70 ? 'text-amber-600 dark:text-amber-500' :
                'text-green-600 dark:text-green-500'
              )}>
                {formatNumber(metrics.percentConsumed, 'es-ES', 1)}%
              </span>
            </div>
            <Progress value={Math.min(metrics.percentConsumed, 100)} className="h-3" />
            <div className="flex justify-between pt-1">
              <span className="text-gray-600 dark:text-gray-400">
                {formatNumber(metrics.hoursConsumed, 'es-ES', 0)}h consumidas
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {formatNumber(metrics.hoursRemaining, 'es-ES', 0)}h restantes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative hours vs budget */}
        <Card>
          <CardHeader>
            <CardTitle>Horas Reales vs Presupuestadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Real" />
                <Line type="monotone" dataKey="budget" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" name="Presupuesto" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Horas Semanales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis dataKey="week" className="text-gray-600 dark:text-gray-400" />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="billable" stackId="a" fill="#3B82F6" name="Facturable" />
                <Bar dataKey="nonBillable" stackId="a" fill="#94A3B8" name="No facturable" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task and Person Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Horas por Tarea</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ task, percent }) => `${task}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team contribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contribución del Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personData.slice(0, 8).map((person, idx) => (
                <div key={person.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-900 dark:text-gray-50">{person.name}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatNumber(person.hours, 'en-US', 0)}h ({formatNumber((person.hours / metrics.hoursConsumed) * 100, 'en-US', 0)}%)
                    </span>
                  </div>
                  <Progress value={(person.hours / metrics.hoursConsumed) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectEntries.slice(0, 15).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-nowrap">{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.taskName}</TableCell>
                    <TableCell>{entry.userName}</TableCell>
                    <TableCell>{formatNumber(entry.hours, 'en-US', 1)}h</TableCell>
                    <TableCell>
                      <Badge variant={entry.billable ? 'default' : 'secondary'}>
                        {entry.billable ? 'Billable' : 'Non-billable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {projectEntries.length > 15 && (
            <div className="mt-4 text-center">
              <Button variant="outline">Load more</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
