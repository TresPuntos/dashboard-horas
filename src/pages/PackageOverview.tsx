import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { motion } from 'motion/react';
import {
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Zap,
  Package,
} from 'lucide-react';
import {
  mockPackageData,
  getActivePackage,
  getGroupedTasksByPackage,
  getUserById,
} from '../lib/packageMockData';
import { cn } from '../lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Cell,
} from 'recharts';

export function PackageOverview() {
  const { taskEntries, users } = mockPackageData;
  const activePackage = getActivePackage();
  
  const [animatedHours, setAnimatedHours] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  if (!activePackage) {
    return (
      <div className="py-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">
          No hay paquetes activos
        </p>
      </div>
    );
  }

  const percentConsumed = (activePackage.consumedHours / activePackage.totalHours) * 100;
  const hoursRemaining = activePackage.totalHours - activePackage.consumedHours;

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedHours(activePackage.consumedHours * progress);
      setAnimatedPercent(percentConsumed * progress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedHours(activePackage.consumedHours);
        setAnimatedPercent(percentConsumed);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [activePackage.consumedHours, percentConsumed]);

  // Status color
  const getStatusColor = () => {
    if (percentConsumed >= 90) return { color: '#EF4444', label: 'Crítico', bg: 'bg-red-50 dark:bg-red-950/20' };
    if (percentConsumed >= 70) return { color: '#F59E0B', label: 'Atención', bg: 'bg-amber-50 dark:bg-amber-950/20' };
    return { color: '#5CFFBE', label: 'Óptimo', bg: 'bg-teal-50 dark:bg-teal-950/20' };
  };

  const status = getStatusColor();

  // Grouped tasks for the active package
  const groupedTasks = useMemo(() => {
    return getGroupedTasksByPackage(activePackage.id)
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 5);
  }, [activePackage.id]);

  // Daily consumption over time
  const dailyData = useMemo(() => {
    const entries = taskEntries.filter(e => e.packageId === activePackage.id);
    const dataMap = new Map<string, number>();

    entries.forEach(entry => {
      const dateStr = entry.completedDate.toISOString().split('T')[0];
      dataMap.set(dateStr, (dataMap.get(dateStr) || 0) + entry.hours);
    });

    // Calculate cumulative
    const sorted = Array.from(dataMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    let cumulative = 0;
    return sorted.map(([date, hours]) => {
      cumulative += hours;
      return {
        date,
        hours: parseFloat(hours.toFixed(2)),
        cumulative: parseFloat(cumulative.toFixed(2)),
      };
    });
  }, [taskEntries, activePackage.id]);

  // Burn rate (last 7 days)
  const burnRate = useMemo(() => {
    const today = new Date('2025-10-19');
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const recentEntries = taskEntries.filter(e => 
      e.packageId === activePackage.id &&
      e.completedDate >= sevenDaysAgo &&
      e.completedDate <= today
    );
    
    const totalHours = recentEntries.reduce((sum, e) => sum + e.hours, 0);
    return totalHours / 7;
  }, [taskEntries, activePackage.id]);

  // Forecast
  const forecastDays = hoursRemaining > 0 && burnRate > 0 
    ? Math.ceil(hoursRemaining / burnRate) 
    : 0;

  // Radial chart data
  const radialData = [
    {
      name: 'Consumido',
      value: percentConsumed,
      fill: status.color,
    },
  ];

  // Hours by user
  const userHoursData = useMemo(() => {
    const entries = taskEntries.filter(e => e.packageId === activePackage.id);
    const userHoursMap = new Map<string, number>();

    entries.forEach(entry => {
      userHoursMap.set(entry.responsable, (userHoursMap.get(entry.responsable) || 0) + entry.hours);
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
  }, [taskEntries, activePackage.id]);

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Package Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-teal-50/30 dark:from-[#111111] dark:to-teal-950/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-6 w-6 text-primary" />
                  <h2 className="text-gray-900 dark:text-gray-50">{activePackage.name}</h2>
                  <Badge className="bg-primary text-primary-foreground">
                    {activePackage.id}
                  </Badge>
                  <Badge variant="outline" className={cn('border-2', status.bg)}>
                    {status.label}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Iniciado: {activePackage.startDate.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total del Paquete</p>
                <p className="text-gray-900 dark:text-gray-50">
                  {formatNumber(activePackage.totalHours, 1)} horas
                </p>
                {activePackage.price && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatNumber(activePackage.price, 2)}€
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Stats - Animated Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Consumo del Paquete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ResponsiveContainer width="100%" height={280}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={24}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill={status.color}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                      {formatNumber(animatedPercent, 1)}%
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      consumido
                    </p>
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas consumidas</span>
                  <motion.span 
                    className="text-gray-900 dark:text-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {formatNumber(animatedHours, 1)}h
                  </motion.span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas disponibles</span>
                  <span className="text-primary">
                    {formatNumber(hoursRemaining, 1)}h
                  </span>
                </div>
                <Progress 
                  value={animatedPercent} 
                  className="h-2 mt-3"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400">Velocidad de Consumo</p>
                  <p className="text-2xl text-gray-900 dark:text-gray-50 mt-1">
                    {formatNumber(burnRate, 2)}h/día
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Últimos 7 días
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400">Estimación</p>
                  <p className="text-2xl text-gray-900 dark:text-gray-50 mt-1">
                    {forecastDays > 0 ? `~${forecastDays} días` : 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Para agotar paquete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400">Tareas Completadas</p>
                  <p className="text-2xl text-gray-900 dark:text-gray-50 mt-1">
                    {taskEntries.filter(e => e.packageId === activePackage.id).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Entradas de tiempo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400">Promedio por Tarea</p>
                  <p className="text-2xl text-gray-900 dark:text-gray-50 mt-1">
                    {formatNumber(
                      activePackage.consumedHours / groupedTasks.length || 0,
                      1
                    )}h
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Por tarea única
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative consumption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Evolución del Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5CFFBE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5CFFBE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(date) => formatDate(date)}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#5CFFBE"
                    strokeWidth={3}
                    fill="url(#colorCumulative)"
                    fillOpacity={1}
                    name="Horas Acumuladas"
                    dot={{ fill: '#5CFFBE', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hours by user */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userHoursData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                  <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    className="text-gray-600 dark:text-gray-400"
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="hours" fill="#5CFFBE" radius={[0, 8, 8, 0]} name="Horas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tareas con Mayor Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedTasks.map((task, index) => (
                <motion.div
                  key={task.taskName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222222] transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-gray-50 truncate">
                      {task.taskName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{task.entriesCount} {task.entriesCount === 1 ? 'entrada' : 'entradas'}</span>
                      <span>•</span>
                      <span>{task.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-900 dark:text-gray-50">
                      {formatNumber(task.totalHours, 1)}h
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatNumber((task.totalHours / activePackage.consumedHours) * 100, 0)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
