import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, Search, X, Download, Share2, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockTaskData, getAllTags } from '../lib/taskMockData';

interface TaskFilters {
  search?: string;
  dateRange?: { from: Date; to: Date };
  status?: string;
  assignee?: string;
  tags?: string[];
  billable?: string;
  showInternal: boolean;
  priority?: string;
}

interface TaskFilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function TaskFilterBar({ filters, onFiltersChange, onExport, onShare }: TaskFilterBarProps) {
  const { users } = mockTaskData;
  const allTags = getAllTags();
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetChange = (preset: string) => {
    const today = new Date('2025-10-19');
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case 'last30':
        from = new Date(today);
        from.setDate(today.getDate() - 30);
        break;
      case 'last90':
        from = new Date(today);
        from.setDate(today.getDate() - 90);
        break;
      case 'thisMonth':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3);
        from = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'thisYear':
        from = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        from = today;
    }

    onFiltersChange({ ...filters, dateRange: { from, to } });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleReset = () => {
    onFiltersChange({
      search: '',
      showInternal: false,
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.dateRange,
    filters.status && filters.status !== 'all',
    filters.assignee,
    filters.tags && filters.tags.length > 0,
    filters.billable,
    filters.priority && filters.priority !== 'all',
  ].filter(Boolean).length;

  const formatDateRange = (range?: { from: Date; to: Date }) => {
    if (!range) return 'Seleccionar fechas';
    
    const from = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(range.from);
    const to = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(range.to);
    
    return `${from} - ${to}`;
  };

  return (
    <div className="bg-white dark:bg-gray-950 border-b sticky top-[73px] z-40">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar tareas..."
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

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {formatDateRange(filters.dateRange)}
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
              </div>
              {filters.dateRange && (
                <div className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, dateRange: undefined })}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar fechas
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <div className="flex-1 flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="open">Abiertas</SelectItem>
                <SelectItem value="in-progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="blocked">Bloqueadas</SelectItem>
              </SelectContent>
            </Select>

            {/* Assignee Filter */}
            {users.length > 0 && (
              <Select
                value={filters.assignee || 'all'}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, assignee: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Responsable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Priority Filter */}
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, priority: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            {/* Billable Filter */}
            <Select
              value={filters.billable || 'all'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, billable: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Facturación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="billable">Facturables</SelectItem>
                <SelectItem value="non-billable">No facturables</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Avanzado
              {(filters.tags && filters.tags.length > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </div>

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

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t space-y-4">
            {/* Tags */}
            <div>
              <Label className="mb-2 block">Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      !filters.tags?.includes(tag) && 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Show Internal Tasks */}
            <div className="flex items-center space-x-2">
              <Switch
                id="show-internal"
                checked={filters.showInternal}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, showInternal: checked })
                }
              />
              <Label htmlFor="show-internal" className="cursor-pointer">
                Mostrar tareas internas (no visibles para cliente)
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
