import { useMemo, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { mockTaskData, Task } from '../lib/taskMockData';
import { cn } from '../lib/utils';
import { ArrowUpDown, Grid3x3, List } from 'lucide-react';

interface TasksListPageProps {
  filters: any;
  onTaskClick: (taskId: string) => void;
}

type SortField = 'name' | 'status' | 'assignee' | 'hours' | 'estimated' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export function TasksListPage({ filters, onTaskClick }: TasksListPageProps) {
  const { tasks, users } = mockTaskData;
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search)
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.assignee) {
      result = result.filter(t => t.assigneeId === filters.assignee);
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(t => 
        filters.tags.some((tag: string) => t.tags.includes(tag))
      );
    }

    if (filters.billable) {
      result = result.filter(t => 
        filters.billable === 'billable' ? t.isBillable : !t.isBillable
      );
    }

    if (!filters.showInternal) {
      result = result.filter(t => t.isClientVisible);
    }

    return result;
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          const statusOrder = { open: 0, 'in-progress': 1, completed: 2, blocked: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'assignee':
          const userA = users.find(u => u.id === a.assigneeId);
          const userB = users.find(u => u.id === b.assigneeId);
          aValue = userA?.name.toLowerCase() || '';
          bValue = userB?.name.toLowerCase() || '';
          break;
        case 'hours':
          aValue = a.consumedHours;
          bValue = b.consumedHours;
          break;
        case 'estimated':
          aValue = a.estimatedHours || 0;
          bValue = b.estimatedHours || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate?.getTime() || Infinity;
          bValue = b.dueDate?.getTime() || Infinity;
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredTasks, sortField, sortDirection, users]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const isTaskAtRisk = (task: Task) => {
    const today = new Date('2025-10-19');
    const overBudget = task.estimatedHours && (task.consumedHours / task.estimatedHours) >= 0.8;
    const overdue = task.dueDate && new Date(task.dueDate) < today && task.status !== 'completed';
    return overBudget || overdue;
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 hover:bg-transparent p-0"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-gray-50">Todas las Tareas</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {sortedTasks.length} tareas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Tarjetas
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4 mr-2" />
            Tabla
          </Button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map(task => {
            const user = users.find(u => u.id === task.assigneeId);
            const percentConsumed = task.estimatedHours 
              ? (task.consumedHours / task.estimatedHours) * 100 
              : 0;
            const atRisk = isTaskAtRisk(task);

            return (
              <Card
                key={task.id}
                className={cn(
                  'cursor-pointer hover:shadow-md transition-shadow',
                  atRisk && 'border-amber-300 dark:border-amber-700'
                )}
                onClick={() => onTaskClick(task.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 dark:text-gray-50 mb-1 line-clamp-2">
                        {task.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        #{task.id}
                      </p>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(task.status)}
                    {task.isBillable && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        Facturable
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Responsable</span>
                      <span className="text-gray-900 dark:text-gray-50">{user?.name}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Vencimiento</span>
                        <span className={cn(
                          'text-gray-900 dark:text-gray-50',
                          new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed' && 'text-red-600 dark:text-red-500'
                        )}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {task.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {task.estimatedHours && (
                    <div className="space-y-1 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                        <span className={cn(
                          percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                          percentConsumed >= 80 ? 'text-amber-600 dark:text-amber-500' :
                          'text-gray-900 dark:text-gray-50'
                        )}>
                          {formatNumber(percentConsumed, 0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(percentConsumed, 100)} className="h-1.5" />
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{formatNumber(task.consumedHours, 1)}h consumidas</span>
                        <span>{formatNumber(task.estimatedHours, 0)}h estimadas</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">
                      <SortButton field="name">Tarea</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="assignee">Responsable</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="status">Estado</SortButton>
                    </TableHead>
                    <TableHead>Etiquetas</TableHead>
                    <TableHead className="text-right">
                      <SortButton field="estimated">Estimado</SortButton>
                    </TableHead>
                    <TableHead className="text-right">
                      <SortButton field="hours">Consumido</SortButton>
                    </TableHead>
                    <TableHead className="w-[120px]">Progreso</TableHead>
                    <TableHead>
                      <SortButton field="dueDate">Vencimiento</SortButton>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map(task => {
                    const user = users.find(u => u.id === task.assigneeId);
                    const percentConsumed = task.estimatedHours 
                      ? (task.consumedHours / task.estimatedHours) * 100 
                      : 0;
                    const atRisk = isTaskAtRisk(task);

                    return (
                      <TableRow
                        key={task.id}
                        className={cn(
                          'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900',
                          atRisk && 'bg-amber-50/50 dark:bg-amber-950/10'
                        )}
                        onClick={() => onTaskClick(task.id)}
                      >
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {task.id.replace('t', '#')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 dark:text-gray-50">{task.name}</span>
                            {task.isBillable && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                $
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-50">
                          {user?.name}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(task.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {task.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-gray-900 dark:text-gray-50">
                          {task.estimatedHours ? `${formatNumber(task.estimatedHours, 0)}h` : '-'}
                        </TableCell>
                        <TableCell className="text-right text-gray-900 dark:text-gray-50">
                          {formatNumber(task.consumedHours, 1)}h
                        </TableCell>
                        <TableCell>
                          {task.estimatedHours && (
                            <div className="space-y-1">
                              <Progress value={Math.min(percentConsumed, 100)} className="h-1.5" />
                              <span className={cn(
                                'text-xs',
                                percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                                percentConsumed >= 80 ? 'text-amber-600 dark:text-amber-500' :
                                'text-gray-600 dark:text-gray-400'
                              )}>
                                {formatNumber(percentConsumed, 0)}%
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {task.dueDate && (
                            <span className={cn(
                              'text-gray-900 dark:text-gray-50',
                              new Date(task.dueDate) < new Date('2025-10-19') && task.status !== 'completed' && 'text-red-600 dark:text-red-500'
                            )}>
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedTasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron tareas que coincidan con tus filtros
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
