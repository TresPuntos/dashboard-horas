import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Calendar as CalendarIcon, Search, X, Download, Share2, Filter } from 'lucide-react';
import { formatDate, getDateRangePreset } from '../lib/utils';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { DateRange } from 'react-day-picker';

export interface FilterState {
  search: string;
  dateRange: { start: Date; end: Date };
  client?: string;
  project?: string;
  status?: string;
  billable?: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onExport?: () => void;
  onShare?: () => void;
  clients?: { id: string; name: string }[];
  projects?: { id: string; name: string }[];
  showAdvanced?: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  onExport,
  onShare,
  clients = [],
  projects = [],
  showAdvanced = true,
}: FilterBarProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: filters.dateRange.start,
    to: filters.dateRange.end,
  });

  const handlePresetChange = (preset: string) => {
    const range = getDateRangePreset(preset);
    setDateRange({ from: range.start, to: range.end });
    onFiltersChange({ ...filters, dateRange: range });
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      onFiltersChange({
        ...filters,
        dateRange: { start: range.from, end: range.to },
      });
    }
  };

  const handleReset = () => {
    const defaultRange = getDateRangePreset('last30');
    setDateRange({ from: defaultRange.start, to: defaultRange.end });
    onFiltersChange({
      search: '',
      dateRange: defaultRange,
      client: undefined,
      project: undefined,
      status: undefined,
      billable: undefined,
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.client,
    filters.project,
    filters.status,
    filters.billable,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos, tareas..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => onFiltersChange({ ...filters, search: '' })}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start gap-2 min-w-[240px]">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formatDate(filters.dateRange.start)} - {formatDate(filters.dateRange.end)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('last30')}
                className="w-full justify-start"
              >
                Últimos 30 días
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('last90')}
                className="w-full justify-start"
              >
                Últimos 90 días
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('thisMonth')}
                className="w-full justify-start"
              >
                Este mes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('lastMonth')}
                className="w-full justify-start"
              >
                Mes pasado
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('thisQuarter')}
                className="w-full justify-start"
              >
                Este trimestre
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePresetChange('thisYear')}
                className="w-full justify-start"
              >
                Este año
              </Button>
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
              className="p-3"
            />
          </PopoverContent>
        </Popover>

        {showAdvanced && (
          <>
            {/* Client Filter */}
            {clients.length > 0 && (
              <Select
                value={filters.client}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, client: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Project Filter */}
            {projects.length > 0 && (
              <Select
                value={filters.project}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, project: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos los proyectos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proyectos</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>

            {/* Billable Filter */}
            <Select
              value={filters.billable}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, billable: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las entradas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las entradas</SelectItem>
                <SelectItem value="billable">Solo facturables</SelectItem>
                <SelectItem value="non-billable">No facturables</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <div className="flex gap-2 ml-auto">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <X className="h-4 w-4" />
              Reiniciar
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
