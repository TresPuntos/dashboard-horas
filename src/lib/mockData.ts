// Mock data generator for the dashboard

export interface TimeEntry {
  id: string;
  date: Date;
  userId: string;
  userName: string;
  projectId: string;
  taskId: string;
  taskName: string;
  tags: string[];
  hours: number;
  billable: boolean;
  rate?: number;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  budgetHours?: number;
  budgetAmount?: number;
  averageRate: number;
  status: 'active' | 'paused' | 'closed';
  startDate: Date;
  endDate?: Date;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

const clients: Client[] = [
  { id: 'c1', name: 'TechCorp Solutions', color: '#3B82F6' },
  { id: 'c2', name: 'DesignHub Agencia', color: '#8B5CF6' },
  { id: 'c3', name: 'GreenEnergy Inc', color: '#10B981' },
];

const projects: Project[] = [
  {
    id: 'p1',
    name: 'Rediseño de Sitio Web',
    clientId: 'c1',
    budgetHours: 320,
    budgetAmount: 32000,
    averageRate: 100,
    status: 'active',
    startDate: new Date('2025-07-01'),
    color: '#3B82F6',
  },
  {
    id: 'p2',
    name: 'Desarrollo de App Móvil',
    clientId: 'c1',
    budgetHours: 480,
    budgetAmount: 52800,
    averageRate: 110,
    status: 'active',
    startDate: new Date('2025-08-15'),
    color: '#06B6D4',
  },
  {
    id: 'p3',
    name: 'Identidad de Marca',
    clientId: 'c2',
    budgetHours: 160,
    budgetAmount: 14400,
    averageRate: 90,
    status: 'active',
    startDate: new Date('2025-09-01'),
    color: '#8B5CF6',
  },
  {
    id: 'p4',
    name: 'Campaña de Marketing',
    clientId: 'c2',
    budgetHours: 240,
    budgetAmount: 21600,
    averageRate: 90,
    status: 'active',
    startDate: new Date('2025-08-01'),
    color: '#A855F7',
  },
  {
    id: 'p5',
    name: 'Plataforma de Sostenibilidad',
    clientId: 'c3',
    budgetHours: 400,
    budgetAmount: 42000,
    averageRate: 105,
    status: 'active',
    startDate: new Date('2025-07-15'),
    color: '#10B981',
  },
  {
    id: 'p6',
    name: 'Dashboard de Analítica',
    clientId: 'c3',
    budgetAmount: 28000,
    averageRate: 100,
    status: 'active',
    startDate: new Date('2025-09-15'),
    color: '#14B8A6',
  },
  {
    id: 'p7',
    name: 'Migración de Sistema Legacy',
    clientId: 'c1',
    budgetHours: 200,
    budgetAmount: 22000,
    averageRate: 110,
    status: 'paused',
    startDate: new Date('2025-06-01'),
    color: '#64748B',
  },
  {
    id: 'p8',
    name: 'Optimización SEO',
    clientId: 'c2',
    budgetHours: 80,
    budgetAmount: 6400,
    averageRate: 80,
    status: 'closed',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-09-30'),
    color: '#6B7280',
  },
];

const users: User[] = [
  { id: 'u1', name: 'Sarah Johnson', role: 'Desarrolladora Senior' },
  { id: 'u2', name: 'Michael Chen', role: 'Diseñador' },
  { id: 'u3', name: 'Emma Rodríguez', role: 'Jefa de Proyecto' },
  { id: 'u4', name: 'David Kim', role: 'Desarrollador' },
  { id: 'u5', name: 'Lisa Anderson', role: 'Investigadora UX' },
  { id: 'u6', name: 'James Wilson', role: 'Especialista Marketing' },
  { id: 'u7', name: 'María García', role: 'Diseñadora' },
  { id: 'u8', name: 'Robert Taylor', role: 'Desarrollador' },
  { id: 'u9', name: 'Jennifer Lee', role: 'Ingeniera QA' },
  { id: 'u10', name: 'Christopher Brown', role: 'Redactor de Contenido' },
  { id: 'u11', name: 'Amanda Martínez', role: 'Analista de Datos' },
  { id: 'u12', name: 'Daniel White', role: 'Ingeniero DevOps' },
];

const tasks = [
  'Desarrollo',
  'Diseño',
  'Investigación',
  'Planificación',
  'Reunión',
  'Pruebas',
  'Documentación',
  'Revisión',
  'Corrección de Bugs',
  'Despliegue',
  'Comunicación con Cliente',
  'Capacitación',
];

const tags = [
  'Frontend',
  'Backend',
  'UI/UX',
  'API',
  'Base de Datos',
  'Testing',
  'Documentación',
  'Reunión',
  'Investigación',
  'Planificación',
  'Bug',
  'Feature',
];

function generateTimeEntries(): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const today = new Date('2025-10-19');
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);

  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'paused');

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    // Generate 8-20 entries per day
    const entriesPerDay = Math.floor(Math.random() * 13) + 8;

    for (let i = 0; i < entriesPerDay; i++) {
      const project = activeProjects[Math.floor(Math.random() * activeProjects.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      const hours = Math.random() < 0.7 
        ? Math.floor(Math.random() * 4 + 1) 
        : Math.floor(Math.random() * 2 + 0.5);
      const billable = Math.random() > 0.15; // 85% billable
      const numTags = Math.floor(Math.random() * 3);
      const entryTags = Array.from(
        { length: numTags },
        () => tags[Math.floor(Math.random() * tags.length)]
      );

      entries.push({
        id: `e${entries.length + 1}`,
        date: new Date(d),
        userId: user.id,
        userName: user.name,
        projectId: project.id,
        taskId: `t${i}`,
        taskName: task,
        tags: [...new Set(entryTags)],
        hours,
        billable,
        rate: billable ? project.averageRate : undefined,
      });
    }
  }

  // Project p6 - no budget in hours, only amount
  // Project p7 - paused, low activity in last 14 days
  const p7StartIndex = entries.findIndex(e => e.projectId === 'p7');
  if (p7StartIndex >= 0) {
    const recentDate = new Date(today);
    recentDate.setDate(recentDate.getDate() - 14);
    entries.forEach((entry, idx) => {
      if (entry.projectId === 'p7' && entry.date > recentDate && Math.random() > 0.3) {
        entries.splice(idx, 1);
      }
    });
  }

  // Project p1 - at 95% budget
  const p1Entries = entries.filter(e => e.projectId === 'p1');
  const p1Target = 320 * 0.95; // 304 hours
  const p1Current = p1Entries.reduce((sum, e) => sum + e.hours, 0);
  if (p1Current < p1Target) {
    const diff = p1Target - p1Current;
    for (let i = 0; i < Math.ceil(diff / 4); i++) {
      const randomDate = new Date(startDate);
      randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 90));
      if (randomDate.getDay() !== 0 && randomDate.getDay() !== 6) {
        entries.push({
          id: `e${entries.length + 1}`,
          date: randomDate,
          userId: users[0].id,
          userName: users[0].name,
          projectId: 'p1',
          taskId: 't1',
          taskName: 'Development',
          tags: ['Frontend'],
          hours: 4,
          billable: true,
          rate: 100,
        });
      }
    }
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const mockClients = clients;
export const mockProjects = projects;
export const mockUsers = users;
export const mockTimeEntries = generateTimeEntries();

export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getProjectsByClient(clientId: string): Project[] {
  return projects.filter(p => p.clientId === clientId);
}

export function getEntriesByProject(projectId: string): TimeEntry[] {
  return mockTimeEntries.filter(e => e.projectId === projectId);
}

export function getEntriesInDateRange(startDate: Date, endDate: Date): TimeEntry[] {
  return mockTimeEntries.filter(e => e.date >= startDate && e.date <= endDate);
}
