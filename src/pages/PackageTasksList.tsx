import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  mockPackageData,
  getGroupedTasksByPackage,
  getUserById,
  HourPackage,
} from '../lib/packageMockData';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronRight, Calendar, User, Tag } from 'lucide-react';

interface PackageTasksListProps {
  selectedPackageId?: string;
}

export function PackageTasksList({ selectedPackageId }: PackageTasksListProps) {
  const { packages, users } = mockPackageData;
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Use selected package or default to active
  const activePackage = selectedPackageId 
    ? packages.find(p => p.id === selectedPackageId)
    : packages.find(p => p.status === 'active');

  if (!activePackage) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No hay paquete seleccionado
        </p>
      </div>
    );
  }

  const groupedTasks = useMemo(() => {
    return getGroupedTasksByPackage(activePackage.id);
  }, [activePackage.id]);

  const toggleTask = (taskName: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskName)) {
      newExpanded.delete(taskName);
    } else {
      newExpanded.add(taskName);
    }
    setExpandedTasks(newExpanded);
  };

  const expandAll = () => {
    setExpandedTasks(new Set(groupedTasks.map(t => t.taskName)));
  };

  const collapseAll = () => {
    setExpandedTasks(new Set());
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

  const totalHours = groupedTasks.reduce((sum, t) => sum + t.totalHours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 dark:text-gray-50 mb-1">
            Tareas del {activePackage.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {groupedTasks.length} tareas únicas • {formatNumber(totalHours, 1)} horas totales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expandir Todo
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Colapsar Todo
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Paquete</p>
              <p className="text-gray-900 dark:text-gray-50">
                {activePackage.id}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Horas Consumidas</p>
              <p className="text-gray-900 dark:text-gray-50">
                {formatNumber(activePackage.consumedHours, 1)}h / {formatNumber(activePackage.totalHours, 0)}h
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">% Consumido</p>
              <p className={cn(
                "font-semibold",
                (activePackage.consumedHours / activePackage.totalHours) >= 0.9 ? 'text-red-600 dark:text-red-500' :
                (activePackage.consumedHours / activePackage.totalHours) >= 0.7 ? 'text-amber-600 dark:text-amber-500' :
                'text-green-600 dark:text-green-500'
              )}>
                {formatNumber((activePackage.consumedHours / activePackage.totalHours) * 100, 1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Estado</p>
              <Badge 
                variant={activePackage.status === 'active' ? 'default' : 'secondary'}
                className={activePackage.status === 'active' ? 'bg-primary text-primary-foreground' : ''}
              >
                {activePackage.status === 'active' ? 'Activo' : 'Completado'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas Agrupadas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {groupedTasks.map((task, index) => {
              const isExpanded = expandedTasks.has(task.taskName);
              
              return (
                <Collapsible
                  key={task.taskName}
                  open={isExpanded}
                  onOpenChange={() => toggleTask(task.taskName)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CollapsibleTrigger className="w-full hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex items-center gap-4 p-4 cursor-pointer">
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="text-gray-900 dark:text-gray-50 mb-1">
                            {task.taskName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {task.entriesCount} {task.entriesCount === 1 ? 'entrada' : 'entradas'}
                            </Badge>
                            {task.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          <p className="text-xl text-primary">
                            {formatNumber(task.totalHours, 1)}h
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber((task.totalHours / totalHours) * 100, 0)}% del total
                          </p>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 dark:bg-[#0d0d0d] px-4 pb-4"
                          >
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Responsable</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Etiquetas</TableHead>
                                    <TableHead className="text-right">Horas</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {task.entries.map((entry) => {
                                    const user = getUserById(entry.responsable);
                                    
                                    return (
                                      <TableRow key={entry.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-900 dark:text-gray-50">
                                              {formatDate(entry.completedDate)}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-900 dark:text-gray-50">
                                              {user?.name}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <span className="text-gray-600 dark:text-gray-400">
                                            {entry.description || '-'}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-1 flex-wrap">
                                            {entry.tags.map(tag => (
                                              <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <span className="text-gray-900 dark:text-gray-50">
                                            {formatNumber(entry.hours, 2)}h
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                  <TableRow className="bg-gray-100 dark:bg-[#2a2a2a]">
                                    <TableCell colSpan={4} className="text-right">
                                      <strong>Subtotal {task.taskName}</strong>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <strong className="text-primary">
                                        {formatNumber(task.totalHours, 2)}h
                                      </strong>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CollapsibleContent>
                  </motion.div>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-white to-teal-50/20 dark:from-[#111111] dark:to-teal-950/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-gray-50 mb-1">
                Total del Paquete {activePackage.id}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {groupedTasks.length} tareas únicas completadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl text-primary">
                {formatNumber(totalHours, 1)}h
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                de {formatNumber(activePackage.totalHours, 0)}h contratadas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
