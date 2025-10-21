// Hour Packages Model - Sistema de paquetes de horas para clientes

export interface HourPackage {
  id: string; // PK01-40, PK02-80
  name: string;
  clientId: string;
  totalHours: number;
  consumedHours: number;
  status: 'active' | 'completed' | 'archived';
  startDate: Date;
  endDate?: Date;
  price?: number;
}

export interface TaskEntry {
  id: string;
  taskName: string; // Nombre de la tarea (se agrupa por este campo)
  description?: string;
  packageId: string; // A qué paquete pertenece
  completedDate: Date;
  hours: number;
  responsable: string;
  tags: string[];
  isBillable: boolean;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  accentColor: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

// Mock data
const client: Client = {
  id: 'c1',
  name: 'ACME Corp.',
  accentColor: '#5CFFBE', // Tres Puntos green
};

const users: User[] = [
  { id: 'u1', name: 'Ana García', role: 'Diseñadora UX/UI' },
  { id: 'u2', name: 'Carlos Martínez', role: 'Desarrollador Frontend' },
  { id: 'u3', name: 'Laura Rodríguez', role: 'Estratega Digital' },
];

// Paquetes de horas
const packages: HourPackage[] = [
  {
    id: 'PK01-40',
    name: 'Paquete 1 - 40 horas',
    clientId: 'c1',
    totalHours: 40,
    consumedHours: 38.5, // Se calculará de las tareas
    status: 'completed',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-09-15'),
    price: 2400,
  },
  {
    id: 'PK02-80',
    name: 'Paquete 2 - 80 horas',
    clientId: 'c1',
    totalHours: 80,
    consumedHours: 52.5, // Se calculará de las tareas
    status: 'active',
    startDate: new Date('2025-09-16'),
    price: 4800,
  },
];

// Tareas completadas (todas finalizadas, agrupables por nombre)
const taskEntries: TaskEntry[] = [
  // Paquete 1 (PK01-40) - COMPLETADO
  {
    id: 'e1',
    taskName: 'Diseño de Landing Page',
    description: 'Primera versión del diseño',
    packageId: 'PK01-40',
    completedDate: new Date('2025-08-05'),
    hours: 6,
    responsable: 'u1',
    tags: ['Diseño', 'UI'],
    isBillable: true,
  },
  {
    id: 'e2',
    taskName: 'Diseño de Landing Page',
    description: 'Revisión y ajustes',
    packageId: 'PK01-40',
    completedDate: new Date('2025-08-12'),
    hours: 3,
    responsable: 'u1',
    tags: ['Diseño', 'UI'],
    isBillable: true,
  },
  {
    id: 'e3',
    taskName: 'Diseño de Landing Page',
    description: 'Versión final',
    packageId: 'PK01-40',
    completedDate: new Date('2025-08-19'),
    hours: 2.5,
    responsable: 'u1',
    tags: ['Diseño', 'UI'],
    isBillable: true,
  },
  {
    id: 'e4',
    taskName: 'Desarrollo Frontend',
    description: 'Maquetación inicial',
    packageId: 'PK01-40',
    completedDate: new Date('2025-08-22'),
    hours: 8,
    responsable: 'u2',
    tags: ['Desarrollo', 'Frontend'],
    isBillable: true,
  },
  {
    id: 'e5',
    taskName: 'Desarrollo Frontend',
    description: 'Integración de componentes',
    packageId: 'PK01-40',
    completedDate: new Date('2025-08-28'),
    hours: 7,
    responsable: 'u2',
    tags: ['Desarrollo', 'Frontend'],
    isBillable: true,
  },
  {
    id: 'e6',
    taskName: 'Estrategia de Contenido',
    packageId: 'PK01-40',
    completedDate: new Date('2025-09-02'),
    hours: 5,
    responsable: 'u3',
    tags: ['Estrategia', 'Contenido'],
    isBillable: true,
  },
  {
    id: 'e7',
    taskName: 'Reuniones con Cliente',
    packageId: 'PK01-40',
    completedDate: new Date('2025-09-10'),
    hours: 4,
    responsable: 'u1',
    tags: ['Reunión', 'Cliente'],
    isBillable: true,
  },
  {
    id: 'e8',
    taskName: 'Testing y QA',
    packageId: 'PK01-40',
    completedDate: new Date('2025-09-15'),
    hours: 3,
    responsable: 'u2',
    tags: ['QA', 'Testing'],
    isBillable: true,
  },

  // Paquete 2 (PK02-80) - ACTIVO
  {
    id: 'e9',
    taskName: 'Rediseño de Marca',
    description: 'Investigación y benchmarking',
    packageId: 'PK02-80',
    completedDate: new Date('2025-09-18'),
    hours: 6,
    responsable: 'u1',
    tags: ['Branding', 'Investigación'],
    isBillable: true,
  },
  {
    id: 'e10',
    taskName: 'Rediseño de Marca',
    description: 'Propuestas de logo',
    packageId: 'PK02-80',
    completedDate: new Date('2025-09-25'),
    hours: 8,
    responsable: 'u1',
    tags: ['Branding', 'Diseño'],
    isBillable: true,
  },
  {
    id: 'e11',
    taskName: 'Rediseño de Marca',
    description: 'Revisión con cliente',
    packageId: 'PK02-80',
    completedDate: new Date('2025-09-30'),
    hours: 2,
    responsable: 'u1',
    tags: ['Branding', 'Reunión'],
    isBillable: true,
  },
  {
    id: 'e12',
    taskName: 'Social Media Content',
    description: 'Calendario editorial mes 1',
    packageId: 'PK02-80',
    completedDate: new Date('2025-09-20'),
    hours: 4.5,
    responsable: 'u3',
    tags: ['Social Media', 'Contenido'],
    isBillable: true,
  },
  {
    id: 'e13',
    taskName: 'Social Media Content',
    description: 'Creación de posts',
    packageId: 'PK02-80',
    completedDate: new Date('2025-09-27'),
    hours: 6,
    responsable: 'u3',
    tags: ['Social Media', 'Diseño'],
    isBillable: true,
  },
  {
    id: 'e14',
    taskName: 'Desarrollo E-commerce',
    description: 'Setup inicial y configuración',
    packageId: 'PK02-80',
    completedDate: new Date('2025-10-01'),
    hours: 10,
    responsable: 'u2',
    tags: ['Desarrollo', 'E-commerce'],
    isBillable: true,
  },
  {
    id: 'e15',
    taskName: 'Desarrollo E-commerce',
    description: 'Integración pasarela de pago',
    packageId: 'PK02-80',
    completedDate: new Date('2025-10-08'),
    hours: 8,
    responsable: 'u2',
    tags: ['Desarrollo', 'Backend'],
    isBillable: true,
  },
  {
    id: 'e16',
    taskName: 'SEO y Optimización',
    packageId: 'PK02-80',
    completedDate: new Date('2025-10-12'),
    hours: 5,
    responsable: 'u3',
    tags: ['SEO', 'Marketing'],
    isBillable: true,
  },
  {
    id: 'e17',
    taskName: 'Reuniones con Cliente',
    packageId: 'PK02-80',
    completedDate: new Date('2025-10-15'),
    hours: 3,
    responsable: 'u1',
    tags: ['Reunión', 'Cliente'],
    isBillable: true,
  },
];

// Recalcular horas consumidas por paquete
packages.forEach(pkg => {
  const pkgEntries = taskEntries.filter(e => e.packageId === pkg.id);
  pkg.consumedHours = pkgEntries.reduce((sum, e) => sum + e.hours, 0);
});

// Helper functions
export const getActivePackage = () => packages.find(p => p.status === 'active');

export const getPackageById = (id: string) => packages.find(p => p.id === id);

export const getTaskEntriesByPackage = (packageId: string) =>
  taskEntries.filter(e => e.packageId === packageId);

export const getGroupedTasksByPackage = (packageId: string) => {
  const entries = getTaskEntriesByPackage(packageId);
  const grouped = new Map<string, TaskEntry[]>();

  entries.forEach(entry => {
    const existing = grouped.get(entry.taskName) || [];
    grouped.set(entry.taskName, [...existing, entry]);
  });

  return Array.from(grouped.entries()).map(([taskName, entries]) => ({
    taskName,
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
    entriesCount: entries.length,
    entries: entries.sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime()),
    tags: Array.from(new Set(entries.flatMap(e => e.tags))),
    lastCompleted: entries[0].completedDate,
  }));
};

export const getUserById = (id: string) => users.find(u => u.id === id);

export const getAllTags = () =>
  Array.from(new Set(taskEntries.flatMap(e => e.tags))).sort();

// Export all data
export const mockPackageData = {
  client,
  packages,
  taskEntries,
  users,
};
