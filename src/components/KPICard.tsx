import React from 'react';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LucideIcon, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'healthy' | 'warning' | 'critical' | 'over' | 'neutral';
  tooltip?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  status = 'neutral',
  tooltip,
  className,
}: KPICardProps) {
  const statusColors = {
    healthy: 'text-green-600 dark:text-green-500',
    warning: 'text-amber-600 dark:text-amber-500',
    critical: 'text-red-600 dark:text-red-500',
    over: 'text-red-700 dark:text-red-600',
    neutral: 'text-blue-600 dark:text-blue-500',
  };

  const statusBg = {
    healthy: 'bg-green-50 dark:bg-green-950/20',
    warning: 'bg-amber-50 dark:bg-amber-950/20',
    critical: 'bg-red-50 dark:bg-red-950/20',
    over: 'bg-red-100 dark:bg-red-950/30',
    neutral: 'bg-blue-50 dark:bg-blue-950/20',
  };

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600 dark:text-gray-400">{title}</span>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className={cn('mb-1', statusColors[status])}>
              {value}
            </div>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
            {trendValue && (
              <div className="mt-2">
                <span className={cn(
                  'text-gray-600 dark:text-gray-400',
                  trend === 'up' && 'text-green-600 dark:text-green-500',
                  trend === 'down' && 'text-red-600 dark:text-red-500'
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('p-3 rounded-2xl', statusBg[status])}>
              <Icon className={cn('h-6 w-6', statusColors[status])} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
