import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { TimeEntry, Project, getClientById } from '../lib/mockData';
import { calculateProjectMetrics, formatCurrency, formatNumber, formatDate, cn } from '../lib/utils';
import { FilterState } from '../components/FilterBar';

interface ProjectsPageProps {
  entries: TimeEntry[];
  projects: Project[];
  filters: FilterState;
  onProjectClick?: (projectId: string) => void;
}

type SortField = 'name' | 'consumed' | 'budget' | 'burnRate' | 'status';
type SortDirection = 'asc' | 'desc';

export function ProjectsPage({ entries, projects, filters, onProjectClick }: ProjectsPageProps) {
  const [sortField, setSortField] = useState<SortField>('consumed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const projectsWithMetrics = useMemo(() => {
    return projects.map((project) => {
      const projectEntries = entries.filter(e => e.projectId === project.id);
      const projectMetrics = calculateProjectMetrics(project, projectEntries);
      return {
        ...project,
        ...projectMetrics,
        client: getClientById(project.clientId),
      };
    });
  }, [projects, entries]);

  const sortedProjects = useMemo(() => {
    const sorted = [...projectsWithMetrics].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'consumed':
          comparison = a.percentConsumed - b.percentConsumed;
          break;
        case 'budget':
          comparison = (a.budgetHours || 0) - (b.budgetHours || 0);
          break;
        case 'burnRate':
          comparison = a.burnRate - b.burnRate;
          break;
        case 'status':
          const statusOrder = { healthy: 0, warning: 1, critical: 2, over: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [projectsWithMetrics, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

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

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 gap-1"
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
          <h2 className="text-gray-900 dark:text-gray-50">Todos los Proyectos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {sortedProjects.length} proyectos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Tarjetas
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => onProjectClick?.(project.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 dark:text-gray-50 mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.client?.name}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progreso del Presupuesto</span>
                      <span className={cn(
                        project.percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                        project.percentConsumed >= 90 ? 'text-red-600 dark:text-red-500' :
                        project.percentConsumed >= 70 ? 'text-amber-600 dark:text-amber-500' :
                        'text-green-600 dark:text-green-500'
                      )}>
                        {formatNumber(project.percentConsumed, 'es-ES', 0)}%
                      </span>
                    </div>
                    <Progress value={Math.min(project.percentConsumed, 100)} className="h-2 mb-1" />
                    <div className="text-gray-600 dark:text-gray-400">
                      {formatNumber(project.hoursConsumed, 'es-ES', 0)}h / {formatNumber(project.budgetHours || 0, 'es-ES', 0)}h
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Tasa de Consumo</p>
                      <p className="text-gray-900 dark:text-gray-50">
                        {formatNumber(project.burnRate, 'es-ES', 1)}h/día
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Restante</p>
                      <p className="text-gray-900 dark:text-gray-50">
                        {formatNumber(project.hoursRemaining, 'es-ES', 0)}h
                      </p>
                    </div>
                  </div>

                  {project.lastActivity && (
                    <div className="pt-3 border-t">
                      <p className="text-gray-600 dark:text-gray-400">
                        Última actividad: {formatDate(project.lastActivity)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
                    <TableHead>
                      <SortButton field="name">Proyecto</SortButton>
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>
                      <SortButton field="status">Estado</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="consumed">Progreso</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="budget">Horas</SortButton>
                    </TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>
                      <SortButton field="burnRate">Tasa de Consumo</SortButton>
                    </TableHead>
                    <TableHead>Previsión</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer"
                      onClick={() => onProjectClick?.(project.id)}
                    >
                      <TableCell>
                        <div className="min-w-[150px]">{project.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[120px]">{project.client?.name}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <div className="min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(project.percentConsumed, 100)} className="h-2 flex-1" />
                            <span className={cn(
                              'text-nowrap',
                              project.percentConsumed > 100 ? 'text-red-600 dark:text-red-500' :
                              project.percentConsumed >= 90 ? 'text-red-600 dark:text-red-500' :
                              project.percentConsumed >= 70 ? 'text-amber-600 dark:text-amber-500' :
                              'text-green-600 dark:text-green-500'
                            )}>
                              {formatNumber(project.percentConsumed, 'en-US', 0)}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-nowrap">
                          {formatNumber(project.hoursConsumed, 'en-US', 0)} / {formatNumber(project.budgetHours || 0, 'en-US', 0)}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-nowrap">
                          {formatCurrency(project.budgetConsumed)} / {formatCurrency(project.budgetAmount || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-nowrap">
                          {formatNumber(project.burnRate, 'es-ES', 1)}h/día
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-nowrap">
                          {project.forecastDate ? formatDate(project.forecastDate) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron proyectos que coincidan con tus filtros
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
