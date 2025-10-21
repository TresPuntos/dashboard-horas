import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TimeEntry, Project } from "./mockData"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ProjectMetrics {
  hoursConsumed: number;
  budgetConsumed: number;
  percentConsumed: number;
  hoursRemaining: number;
  budgetRemaining: number;
  burnRate: number;
  forecastDays: number;
  forecastDate: Date | null;
  billableHours: number;
  nonBillableHours: number;
  percentBillable: number;
  lastActivity: Date | null;
  status: 'healthy' | 'warning' | 'critical' | 'over';
}

export function calculateProjectMetrics(
  project: Project,
  entries: TimeEntry[],
  dateRange?: { start: Date; end: Date }
): ProjectMetrics {
  let filteredEntries = entries;
  
  if (dateRange) {
    filteredEntries = entries.filter(
      e => e.date >= dateRange.start && e.date <= dateRange.end
    );
  }

  const hoursConsumed = filteredEntries.reduce((sum, e) => sum + e.hours, 0);
  const billableHours = filteredEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0);
  const nonBillableHours = hoursConsumed - billableHours;
  const percentBillable = hoursConsumed > 0 ? (billableHours / hoursConsumed) * 100 : 0;

  const budgetConsumed = filteredEntries
    .filter(e => e.billable && e.rate)
    .reduce((sum, e) => sum + e.hours * (e.rate || 0), 0);

  const budgetHours = project.budgetHours || (project.budgetAmount ? project.budgetAmount / project.averageRate : 0);
  const budgetAmount = project.budgetAmount || (project.budgetHours ? project.budgetHours * project.averageRate : 0);

  const percentConsumed = budgetHours > 0 ? (hoursConsumed / budgetHours) * 100 : 0;
  const hoursRemaining = Math.max(0, budgetHours - hoursConsumed);
  const budgetRemaining = Math.max(0, budgetAmount - budgetConsumed);

  // Calculate burn rate (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const recentEntries = entries.filter(e => e.date >= fourteenDaysAgo);
  const recentHours = recentEntries.reduce((sum, e) => sum + e.hours, 0);
  const businessDays = 10; // Approximate 14 calendar days
  const burnRate = recentHours / businessDays;

  // Forecast
  const forecastDays = burnRate > 0 ? hoursRemaining / burnRate : 0;
  const forecastDate = forecastDays > 0 && isFinite(forecastDays) ? new Date(Date.now() + forecastDays * 24 * 60 * 60 * 1000) : null;

  const lastActivity = filteredEntries.length > 0 
    ? new Date(Math.max(...filteredEntries.map(e => e.date.getTime()))) 
    : null;

  let status: 'healthy' | 'warning' | 'critical' | 'over' = 'healthy';
  if (percentConsumed > 100) status = 'over';
  else if (percentConsumed >= 90) status = 'critical';
  else if (percentConsumed >= 70) status = 'warning';

  return {
    hoursConsumed,
    budgetConsumed,
    percentConsumed,
    hoursRemaining,
    budgetRemaining,
    burnRate,
    forecastDays,
    forecastDate,
    billableHours,
    nonBillableHours,
    percentBillable,
    lastActivity,
    status,
  };
}

export function formatCurrency(amount: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, locale: string = 'en-US', decimals: number = 1): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getDateRangePreset(preset: string): { start: Date; end: Date } {
  const today = new Date('2025-10-19'); // Current date for demo
  const start = new Date(today);
  const end = new Date(today);

  switch (preset) {
    case 'thisMonth':
      start.setDate(1);
      break;
    case 'lastMonth':
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end.setDate(0);
      break;
    case 'last30':
      start.setDate(start.getDate() - 30);
      break;
    case 'last90':
      start.setDate(start.getDate() - 90);
      break;
    case 'thisQuarter':
      const quarter = Math.floor(today.getMonth() / 3);
      start.setMonth(quarter * 3);
      start.setDate(1);
      break;
    case 'thisYear':
      start.setMonth(0);
      start.setDate(1);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }

  return { start, end };
}

export function groupEntriesByWeek(entries: TimeEntry[]): Map<string, TimeEntry[]> {
  const grouped = new Map<string, TimeEntry[]>();
  
  entries.forEach(entry => {
    const weekStart = new Date(entry.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(entry);
  });
  
  return grouped;
}

export function groupEntriesByMonth(entries: TimeEntry[]): Map<string, TimeEntry[]> {
  const grouped = new Map<string, TimeEntry[]>();
  
  entries.forEach(entry => {
    const key = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(entry);
  });
  
  return grouped;
}
