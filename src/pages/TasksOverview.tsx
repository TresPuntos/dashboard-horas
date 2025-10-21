import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { KPICard } from '../components/KPICard';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { mockTaskData, Task, TimeEntry } from '../lib/taskMockData';
import { cn } from '../lib/utils';
import {
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

interface TasksOverviewProps {
  filters: any;
}

export function TasksOverview({ filters }: TasksOverviewProps) {
  const { tasks, users, timeEntries } = mockTaskData;

  const metrics = useMemo(() => {
    let filteredTasks = tasks;
    let filteredEntries = timeEntries;

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }

    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(t => t.assigneeId === filters.assignee);
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(t => 
        filters.tags.some((tag: string) => t.tags.includes(tag))
      );
    }

    if (filters.billable) {
      filteredTasks = filteredTasks.filter(t => 
        filters.billable === 'billable' ? t.isBillable : !t.isBillable
      );
    }

    if (!filters.showInternal) {
      filteredTasks = filteredTasks.filter(t => t.isClientVisible);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      filteredEntries = filteredEntries.filter(e => {
        const date = new Date(e.date);
        return date >= filters.dateRange.from && date <= filters.dateRange.to;
      });
      
      const taskIdsInRange = new Set(filteredEntries.map(e => e.taskId));
      filteredTasks = filteredTasks.filter(t => taskIdsInRange.has(t.id));
    }

    // Calculate metrics
    const totalHours = filteredTasks.reduce((sum, t) => sum + t.consumedHours, 0);
    const billableHours = filteredTasks
      .filter(t => t.isBillable)
      .reduce((sum, t) => sum + t.consumedHours, 0);
    const nonBillableHours = totalHours - billableHours;
    
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');
    const percentCompleted = filteredTasks.length > 0 
      ? (completedTasks.length / filteredTasks.length) * 100 
      : 0;
    
    const openTasks = filteredTasks.filter(t => t.status === 'open' || t.status === 'in-progress');
    const pendingHours = openTasks.reduce((sum, t) => {
      const estimated = t.estimatedHours || 0;
      const consumed = t.consumedHours;
      return sum + Math.max(0, estimated - consumed);
    }, 0);

    // Tasks at risk (consumed > 80% of estimated or overdue)
    const today = new Date('2025-10-19');
    const tasksAtRisk = filteredTasks.filter(t => {
      if (t.status === 'completed') return false;
      
      const overBudget = t.estimatedHours && (t.consumedHours / t.estimatedHours) >= 0.8;
      const overdue = t.dueDate && new Date(t.dueDate) < today;
      
      return overBudget || overdue;
    });

    // Average burn rate (last 14 days)
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);
    
    const recentEntries = filteredEntries.filter(e => new Date(e.date) >= fourteenDaysAgo);
    const recentHours = recentEntries.reduce((sum, e) => sum + e.hours, 0);
    const burnRate = recentHours / 14;

    return {
      totalHours,
      billableHours,
      nonBillableHours,
      percentCompleted,
      completedCount: completedTasks.length,
      totalCount: filteredTasks.length,
      pendingHours,
      tasksAtRisk: tasksAtRisk.length,
      burnRate,
    };
  }, [tasks, timeEntries, filters]);

  // Chart data: tasks completed and hours per day
  const dailyData = useMemo(() => {
    const last30Days = new Date('2025-10-19');
    const startDate = new Date(last30Days);
    startDate.setDate(startDate.getDate() - 30);

    const dataMap = new Map<string, { date: string; tasks: number; hours: number }>();

    // Initialize all dates
    for (let d = new Date(startDate); d <= last30Days; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dataMap.set(dateStr, { date: dateStr, tasks: 0, hours: 0 });
    }

    // Add completed tasks
    tasks.forEach(task => {
      if (task.completedDate) {
        const dateStr = task.completedDate.toISOString().split('T')[0];
        const entry = dataMap.get(dateStr);
        if (entry) {
          entry.tasks += 1;
        }
      }
    });

    // Add time entries
    timeEntries.forEach(entry => {
      const dateStr = entry.date.toISOString().split('T')[0];
      const dataEntry = dataMap.get(dateStr);
      if (dataEntry) {
        dataEntry.hours += entry.hours;
      }
    });

    return Array.from(dataMap.values()).map(item => ({
      ...item,
      hours: parseFloat(item.hours.toFixed(1)),
    }));
  }, [tasks, timeEntries]);

  // Top 5 most time-consuming tasks
  const topTasks = useMemo(() => {
    return [...tasks]
      .filter(t => t.consumedHours > 0)
      .sort((a, b) => b.consumedHours - a.consumedHours)
      .slice(0, 5);
  }, [tasks]);

  // Tasks at risk
  const riskTasks = useMemo(() => {
    const today = new Date('2025-10-19');
    
    return tasks.filter(t => {
      if (t.status === 'completed') return false;
      
      const overBudget = t.estimatedHours && (t.consumedHours / t.estimatedHours) >= 0.8;
      const overdue = t.dueDate && new Date(t.dueDate) < today;
      
      return overBudget || overdue;
    }).slice(0, 5);
  }, [tasks]);

  // Status distribution
  const statusData = useMemo(() => {
    const counts = {
      open: tasks.filter(t => t.status === 'open').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };

    return [
      { name: 'Abiertas', value: counts.open, color: '#94A3B8' },
      { name: 'En Progreso', value: counts['in-progress'], color: '#3B82F6' },
      { name: 'Completadas', value: counts.completed, color: '#10B981' },
      { name: 'Bloqueadas', value: counts.blocked, color: '#EF4444' },
    ].filter(item => item.value > 0);
  }, [tasks]);

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const getTaskStatusBadge = (status: string) => {
    const variants = {
      open: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
      blocked: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    };

    const labels = {
      open: 'Abierta',
      'in-progress': 'En Progreso',
      completed: 'Completada',
      blocked: 'Bloqueada',
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRiskReason = (task: Task) => {
    const today = new Date('2025-10-19');
    const reasons = [];

    if (task.estimatedHours && (task.consumedHours / task.estimatedHours) >= 1) {
      reasons.push('Presupuesto excedido');
    } else if (task.estimatedHours && (task.consumedHours / task.estimatedHours) >= 0.8) {
      reasons.push('Cerca del límite');
    }

    if (task.dueDate && new Date(task.dueDate) < today) {
      reasons.push('Fecha vencida');
    }

    return reasons.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Horas Totales"
          value={formatNumber(metrics.totalHours, 1) + ' h'}
          subtitle="Todas las tareas"
          icon={Clock}
          status="neutral"
          tooltip="Total de horas registradas en todas las tareas"
        />
        <KPICard
          title="Horas Facturables"
          value={formatNumber(metrics.billableHours, 1) + ' h'}
          subtitle={`${formatNumber((metrics.billableHours / metrics.totalHours) * 100, 0)}% del total`}
          icon={DollarSign}
          status="healthy"
          tooltip="Horas marcadas como facturables al cliente"
        />
        <KPICard
          title="Horas No Facturables"
          value={formatNumber(metrics.nonBillableHours, 1) + ' h'}
          subtitle="Internas y reuniones"
          icon={Clock}
          status="neutral"
          tooltip="Horas internas no facturables"
        />
        <KPICard
          title="Tareas Completadas"
          value={`${metrics.completedCount}/${metrics.totalCount}`}
          subtitle={`${formatNumber(metrics.percentCompleted, 0)}% completado`}
          icon={CheckCircle2}
          status={metrics.percentCompleted >= 70 ? 'healthy' : metrics.percentCompleted >= 40 ? 'warning' : 'critical'}
          tooltip="Porcentaje de tareas finalizadas"
        />
        <KPICard
          title="Horas Pendientes"
          value={formatNumber(metrics.pendingHours, 0) + ' h'}
          subtitle="Estimadas restantes"
          icon={TrendingUp}
          status="neutral"
          tooltip="Horas estimadas que faltan en tareas abiertas"
        />
        <KPICard
          title="Tareas en Riesgo"
          value={metrics.tasksAtRisk.toString()}
          subtitle={`Tasa: ${formatNumber(metrics.burnRate, 1)}h/día`}
          icon={AlertCircle}
          status={metrics.tasksAtRisk > 0 ? 'warning' : 'healthy'}
          tooltip="Tareas que exceden presupuesto o están vencidas"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main timeline chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad Diaria - Últimos 30 Días</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis yAxisId="left" className="text-gray-600 dark:text-gray-400" />
                <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES')}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="hours"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  name="Horas"
                />
                <Bar
                  yAxisId="right"
                  dataKey="tasks"
                  fill="#10B981"
                  name="Tareas Completadas"
                  opacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Featured Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top consuming tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas con Mayor Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTasks.map(task => {
                const user = users.find(u => u.id === task.assigneeId);
                const percentConsumed = task.estimatedHours 
                  ? (task.consumedHours / task.estimatedHours) * 100 
                  : 0;

                return (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-gray-50 truncate">{task.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {user?.name} • {task.tags.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-gray-900 dark:text-gray-50">
                          {formatNumber(task.consumedHours, 1)}h
                        </p>
                        {task.estimatedHours && (
                          <p className={cn(
                            'text-sm',
                            percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                            percentConsumed >= 80 ? 'text-amber-600 dark:text-amber-500' :
                            'text-gray-600 dark:text-gray-400'
                          )}>
                            de {formatNumber(task.estimatedHours, 0)}h
                          </p>
                        )}
                      </div>
                    </div>
                    {task.estimatedHours && (
                      <Progress value={Math.min(percentConsumed, 100)} className="h-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks at risk */}
        <Card className={riskTasks.length > 0 ? 'border-amber-200 dark:border-amber-900' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {riskTasks.length > 0 && <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />}
              Tareas en Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay tareas en riesgo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {riskTasks.map(task => {
                  const user = users.find(u => u.id === task.assigneeId);
                  const percentConsumed = task.estimatedHours 
                    ? (task.consumedHours / task.estimatedHours) * 100 
                    : 0;

                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-gray-50 truncate">{task.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {user?.name}
                          </p>
                        </div>
                        {getTaskStatusBadge(task.status)}
                      </div>
                      <p className="text-amber-700 dark:text-amber-500 mb-2">
                        {getRiskReason(task)}
                      </p>
                      {task.estimatedHours && (
                        <div className="space-y-1">
                          <Progress 
                            value={Math.min(percentConsumed, 100)} 
                            className="h-1.5"
                          />
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatNumber(task.consumedHours, 1)}h / {formatNumber(task.estimatedHours, 0)}h
                            <span className="ml-2 text-amber-600 dark:text-amber-500">
                              ({formatNumber(percentConsumed, 0)}%)
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
