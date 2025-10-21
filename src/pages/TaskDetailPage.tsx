import { useMemo } from 'react';
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
import { mockTaskData, getTaskById, getUserById, getTaskEntries } from '../lib/taskMockData';
import { cn } from '../lib/utils';
import {
  ArrowLeft,
  Clock,
  Calendar,
  TrendingUp,
  User,
  AlertCircle,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import {
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
  LineChart,
  Line,
} from 'recharts';

interface TaskDetailPageProps {
  taskId: string;
  onBack: () => void;
}

export function TaskDetailPage({ taskId, onBack }: TaskDetailPageProps) {
  const task = getTaskById(taskId);
  const { users } = mockTaskData;

  if (!task) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Tareas
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">Tarea no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignee = getUserById(task.assigneeId);
  const timeEntries = getTaskEntries(taskId);

  const metrics = useMemo(() => {
    const percentConsumed = task.estimatedHours 
      ? (task.consumedHours / task.estimatedHours) * 100 
      : 0;
    
    const hoursRemaining = task.estimatedHours 
      ? Math.max(0, task.estimatedHours - task.consumedHours)
      : 0;

    const status = 
      percentConsumed > 100 ? 'over' :
      percentConsumed >= 90 ? 'critical' :
      percentConsumed >= 70 ? 'warning' : 'healthy';

    // Burn rate (last 7 days)
    const today = new Date('2025-10-19');
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const recentEntries = timeEntries.filter(e => new Date(e.date) >= sevenDaysAgo);
    const recentHours = recentEntries.reduce((sum, e) => sum + e.hours, 0);
    const burnRate = recentHours / 7;

    // Forecast
    let forecastDays = 0;
    if (burnRate > 0 && hoursRemaining > 0) {
      forecastDays = hoursRemaining / burnRate;
    }

    return {
      percentConsumed,
      hoursRemaining,
      status,
      burnRate,
      forecastDays,
    };
  }, [task, timeEntries]);

  // Daily hours chart
  const dailyData = useMemo(() => {
    const dataMap = new Map<string, number>();

    timeEntries.forEach(entry => {
      const dateStr = entry.date.toISOString().split('T')[0];
      dataMap.set(dateStr, (dataMap.get(dateStr) || 0) + entry.hours);
    });

    return Array.from(dataMap.entries())
      .map(([date, hours]) => ({
        date,
        hours: parseFloat(hours.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [timeEntries]);

  // Hours by user
  const userHoursData = useMemo(() => {
    const userHoursMap = new Map<string, number>();

    timeEntries.forEach(entry => {
      userHoursMap.set(entry.userId, (userHoursMap.get(entry.userId) || 0) + entry.hours);
    });

    return Array.from(userHoursMap.entries())
      .map(([userId, hours]) => {
        const user = getUserById(userId);
        return {
          name: user?.name || 'Desconocido',
          hours: parseFloat(hours.toFixed(2)),
        };
      })
      .sort((a, b) => b.hours - a.hours);
  }, [timeEntries]);

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
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

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      medium: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      high: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
    };

    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    };

    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        Prioridad: {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Tareas
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900 dark:text-gray-50">{task.name}</h1>
              {getStatusBadge(task.status)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-gray-600 dark:text-gray-400">ID: {task.id}</span>
              <span className="text-gray-400">•</span>
              {getPriorityBadge(task.priority)}
              {task.isBillable && (
                <>
                  <span className="text-gray-400">•</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Facturable
                  </Badge>
                </>
              )}
            </div>
            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Responsable</p>
                <p className="text-gray-900 dark:text-gray-50">{assignee?.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{assignee?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {task.startDate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Fecha de Inicio</p>
                  <p className="text-gray-900 dark:text-gray-50">{formatDate(task.startDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {task.dueDate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed'
                    ? 'bg-red-100 dark:bg-red-950'
                    : 'bg-amber-100 dark:bg-amber-950'
                )}>
                  <Calendar className={cn(
                    'h-5 w-5',
                    new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  )} />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Fecha de Vencimiento</p>
                  <p className={cn(
                    'text-gray-900 dark:text-gray-50',
                    new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed' && 'text-red-600 dark:text-red-500'
                  )}>
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Etiquetas</p>
            <div className="flex gap-2 flex-wrap">
              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Horas Consumidas"
          value={formatNumber(task.consumedHours, 1) + ' h'}
          subtitle={task.estimatedHours ? `de ${formatNumber(task.estimatedHours, 0)}h estimadas` : 'Sin estimación'}
          icon={Clock}
          status={metrics.status}
        />
        <KPICard
          title="Progreso"
          value={task.estimatedHours ? `${formatNumber(metrics.percentConsumed, 0)}%` : 'N/A'}
          subtitle={task.estimatedHours ? `${formatNumber(metrics.hoursRemaining, 1)}h restantes` : 'Sin estimación'}
          icon={TrendingUp}
          status={metrics.status}
        />
        <KPICard
          title="Tasa de Consumo"
          value={formatNumber(metrics.burnRate, 1) + ' h/día'}
          subtitle="Últimos 7 días"
          icon={TrendingUp}
          status="neutral"
        />
        <KPICard
          title="Estado"
          value={task.status === 'completed' ? 'Completada' : 'En Curso'}
          subtitle={task.completedDate ? formatDateShort(task.completedDate) : metrics.forecastDays > 0 ? `~${Math.ceil(metrics.forecastDays)} días restantes` : '-'}
          icon={task.status === 'completed' ? CheckCircle2 : Clock}
          status={task.status === 'completed' ? 'healthy' : 'neutral'}
        />
      </div>

      {/* Progress Bar */}
      {task.estimatedHours && (
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
                  {formatNumber(metrics.percentConsumed, 1)}%
                </span>
              </div>
              <Progress value={Math.min(metrics.percentConsumed, 100)} className="h-3" />
              <div className="flex justify-between pt-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatNumber(task.consumedHours, 1)}h consumidas
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatNumber(metrics.hoursRemaining, 1)}h restantes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert if over budget or overdue */}
      {(metrics.percentConsumed > 80 || (task.dueDate && new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed')) && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-900 dark:text-amber-400 mb-1">Alerta de Tarea</h3>
                <div className="text-amber-700 dark:text-amber-500 space-y-1">
                  {metrics.percentConsumed > 100 && <p>• Esta tarea ha excedido su presupuesto estimado</p>}
                  {metrics.percentConsumed >= 80 && metrics.percentConsumed <= 100 && <p>• Esta tarea está cerca de alcanzar su presupuesto estimado</p>}
                  {task.dueDate && new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed' && <p>• Esta tarea ha pasado su fecha de vencimiento</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily hours */}
        <Card>
          <CardHeader>
            <CardTitle>Horas Diarias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => formatDateShort(new Date(date))}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(date) => formatDate(new Date(date))}
                />
                <Bar dataKey="hours" fill="#3B82F6" name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hours by user */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userHoursData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {userHoursData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Tiempo</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Horas</TableHead>
                  <TableHead>Facturable</TableHead>
                  {timeEntries.some(e => e.description) && <TableHead>Descripción</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map(entry => {
                  const user = getUserById(entry.userId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="text-gray-900 dark:text-gray-50">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-50">
                        {user?.name}
                      </TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-gray-50">
                        {formatNumber(entry.hours, 2)}h
                      </TableCell>
                      <TableCell>
                        {entry.isBillable ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            Sí
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      {timeEntries.some(e => e.description) && (
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {entry.description || '-'}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
