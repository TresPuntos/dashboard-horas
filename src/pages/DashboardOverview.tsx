import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { TimeEntry, Project, mockProjects, mockClients, getClientById } from '../lib/mockData';
import { calculateProjectMetrics, formatCurrency, formatNumber, formatDateShort } from '../lib/utils';
import { FilterState } from '../components/FilterBar';
import { cn } from '../lib/utils';

interface DashboardOverviewProps {
  entries: TimeEntry[];
  projects: Project[];
  filters: FilterState;
  onProjectClick?: (projectId: string) => void;
}

export function DashboardOverview({ entries, projects, filters, onProjectClick }: DashboardOverviewProps) {
  const metrics = useMemo(() => {
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const billableHours = entries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
    const nonBillableHours = totalHours - billableHours;
    const percentBillable = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

    const totalBudgetHours = projects.reduce((sum, p) => {
      return sum + (p.budgetHours || (p.budgetAmount ? p.budgetAmount / p.averageRate : 0));
    }, 0);

    const totalBudgetAmount = projects.reduce((sum, p) => {
      return sum + (p.budgetAmount || (p.budgetHours ? p.budgetHours * p.averageRate : 0));
    }, 0);

    const consumedAmount = entries
      .filter(e => e.billable && e.rate)
      .reduce((sum, e) => sum + e.hours * (e.rate || 0), 0);

    const percentConsumed = totalBudgetHours > 0 ? (totalHours / totalBudgetHours) * 100 : 0;
    const remainingHours = Math.max(0, totalBudgetHours - totalHours);
    const remainingBudget = Math.max(0, totalBudgetAmount - consumedAmount);

    // Burn rate (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const recentEntries = entries.filter(e => e.date >= fourteenDaysAgo);
    const recentHours = recentEntries.reduce((sum, e) => sum + e.hours, 0);
    const burnRate = recentHours / 10; // ~10 business days

    // Forecast
    const forecastDays = burnRate > 0 ? remainingHours / burnRate : 0;
    const forecastDate = forecastDays > 0 && isFinite(forecastDays)
      ? new Date(Date.now() + forecastDays * 24 * 60 * 60 * 1000)
      : null;

    return {
      totalHours,
      billableHours,
      nonBillableHours,
      percentBillable,
      totalBudgetHours,
      totalBudgetAmount,
      consumedAmount,
      percentConsumed,
      remainingHours,
      remainingBudget,
      burnRate,
      forecastDate,
    };
  }, [entries, projects]);

  // Time series data for chart
  const timeSeriesData = useMemo(() => {
    const dailyData = new Map<string, { hours: number; budget: number }>();
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());

    let cumulativeHours = 0;
    let cumulativeBudget = 0;

    sortedEntries.forEach((entry) => {
      const dateKey = entry.date.toISOString().split('T')[0];
      cumulativeHours += entry.hours;
      if (entry.billable && entry.rate) {
        cumulativeBudget += entry.hours * entry.rate;
      }

      dailyData.set(dateKey, {
        hours: cumulativeHours,
        budget: cumulativeBudget,
      });
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      hours: data.hours,
      budget: data.budget,
    }));
  }, [entries]);

  // Sample every 7th data point if too many
  const chartData = timeSeriesData.length > 30
    ? timeSeriesData.filter((_, i) => i % 7 === 0 || i === timeSeriesData.length - 1)
    : timeSeriesData;

  // Project status data
  const projectStatusData = useMemo(() => {
    return projects.map((project) => {
      const projectEntries = entries.filter(e => e.projectId === project.id);
      const projectMetrics = calculateProjectMetrics(project, projectEntries);
      return {
        ...project,
        ...projectMetrics,
        client: getClientById(project.clientId),
      };
    }).sort((a, b) => b.percentConsumed - a.percentConsumed);
  }, [projects, entries]);

  // Billable vs Non-billable pie chart data
  const billableData = [
    { name: 'Facturable', value: metrics.billableHours, color: '#3B82F6' },
    { name: 'No facturable', value: metrics.nonBillableHours, color: '#94A3B8' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      case 'over': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy': return 'En Marcha';
      case 'warning': return 'Alerta';
      case 'critical': return 'Crítico';
      case 'over': return 'Sobre Presupuesto';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Horas Consumidas"
          value={formatNumber(metrics.totalHours, 'es-ES', 0) + ' h'}
          subtitle={`${formatNumber(metrics.percentConsumed, 'es-ES', 1)}% del presupuesto`}
          icon={Clock}
          status={
            metrics.percentConsumed > 100 ? 'over' :
            metrics.percentConsumed >= 90 ? 'critical' :
            metrics.percentConsumed >= 70 ? 'warning' : 'healthy'
          }
          tooltip="Total de horas registradas en todos los proyectos durante el rango de fechas seleccionado"
        />
        <KPICard
          title="Presupuesto Consumido"
          value={formatCurrency(metrics.consumedAmount)}
          subtitle={`de ${formatCurrency(metrics.totalBudgetAmount)}`}
          icon={DollarSign}
          status={
            (metrics.consumedAmount / metrics.totalBudgetAmount * 100) > 100 ? 'over' :
            (metrics.consumedAmount / metrics.totalBudgetAmount * 100) >= 90 ? 'critical' :
            (metrics.consumedAmount / metrics.totalBudgetAmount * 100) >= 70 ? 'warning' : 'healthy'
          }
          tooltip="Presupuesto total consumido basado en horas facturables y tarifas"
        />
        <KPICard
          title="Horas Restantes"
          value={formatNumber(metrics.remainingHours, 'es-ES', 0) + ' h'}
          subtitle={formatCurrency(metrics.remainingBudget) + ' restante'}
          icon={Activity}
          status="neutral"
          tooltip="Horas y presupuesto restantes según la asignación total"
        />
        <KPICard
          title="Tasa de Consumo"
          value={formatNumber(metrics.burnRate, 'es-ES', 1) + ' h/día'}
          subtitle="Promedio últimos 14 días"
          icon={TrendingUp}
          status="neutral"
          tooltip="Promedio de horas consumidas por día laborable durante los últimos 14 días"
        />
        <KPICard
          title="Fecha de Agotamiento"
          value={metrics.forecastDate ? formatDateShort(metrics.forecastDate) : 'N/A'}
          subtitle={metrics.forecastDate ? `${Math.ceil(metrics.remainingHours / metrics.burnRate)} días` : 'Calculando...'}
          icon={Calendar}
          status={
            !metrics.forecastDate ? 'neutral' :
            (metrics.remainingHours / metrics.burnRate) < 30 ? 'critical' :
            (metrics.remainingHours / metrics.burnRate) < 60 ? 'warning' : 'healthy'
          }
          tooltip="Fecha estimada de agotamiento del presupuesto según la tasa actual de consumo"
        />
        <KPICard
          title="Ratio Facturable"
          value={formatNumber(metrics.percentBillable, 'es-ES', 0) + '%'}
          subtitle={`${formatNumber(metrics.billableHours, 'es-ES', 0)}h / ${formatNumber(metrics.totalHours, 'es-ES', 0)}h`}
          icon={Activity}
          status={metrics.percentBillable >= 80 ? 'healthy' : metrics.percentBillable >= 60 ? 'warning' : 'critical'}
          tooltip="Porcentaje de horas facturables vs horas totales registradas"
        />
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Horas Acumuladas vs Presupuesto a lo Largo del Tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHours)"
                name="Horas"
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBudget)"
                name="Presupuesto ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-gray-900 dark:text-gray-50">Estado de Proyectos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectStatusData.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onProjectClick?.(project.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-gray-50 mb-1">{project.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {project.client?.name}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'ml-2',
                        project.status === 'healthy' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
                        project.status === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                        (project.status === 'critical' || project.status === 'over') && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                      )}
                    >
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatNumber(project.hoursConsumed, 'en-US', 0)}h / {formatNumber(project.budgetHours || 0, 'en-US', 0)}h
                      </span>
                      <span className={cn(
                        project.percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                        project.percentConsumed >= 90 ? 'text-red-600 dark:text-red-500' :
                        project.percentConsumed >= 70 ? 'text-amber-600 dark:text-amber-500' :
                        'text-green-600 dark:text-green-500'
                      )}>
                        {formatNumber(project.percentConsumed, 'en-US', 0)}%
                      </span>
                    </div>
                    <Progress value={Math.min(project.percentConsumed, 100)} className="h-2" />
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Consumo: {formatNumber(project.burnRate, 'es-ES', 1)}h/día
                      </span>
                      {project.forecastDate && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDateShort(project.forecastDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billable vs Non-billable */}
        <div>
          <h2 className="text-gray-900 dark:text-gray-50 mb-4">Distribución Facturable</h2>
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={billableData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {billableData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas Facturables</span>
                  <span className="text-gray-900 dark:text-gray-50">
                    {formatNumber(metrics.billableHours, 'es-ES', 0)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas No Facturables</span>
                  <span className="text-gray-900 dark:text-gray-50">
                    {formatNumber(metrics.nonBillableHours, 'es-ES', 0)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {projectStatusData.some(p => p.status === 'critical' || p.status === 'over') && (
            <Card className="mt-4 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-amber-900 dark:text-amber-400 mb-1">Alerta de Presupuesto</h3>
                    <p className="text-amber-700 dark:text-amber-500">
                      {projectStatusData.filter(p => p.status === 'critical' || p.status === 'over').length} proyecto(s) requieren atención
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
