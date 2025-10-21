// Task-focused mock data structure
export type TaskStatus = 'open' | 'in-progress' | 'completed' | 'blocked';

export interface Client {
  id: string;
  name: string;
  logo?: string;
  accentColor: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  assigneeId: string;
  status: TaskStatus;
  tags: string[];
  estimatedHours?: number;
  consumedHours: number;
  isBillable: boolean;
  isClientVisible: boolean;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: Date;
  hours: number;
  description?: string;
  isBillable: boolean;
}

// Mock data
const client: Client = {
  id: 'c1',
  name: 'ACME Corp.',
  accentColor: '#5CFFBE', // Tres Puntos turquesa
};

const project: Project = {
  id: 'p1',
  name: 'Rediseño Web',
  clientId: 'c1',
  description: 'Rediseño completo del sitio web corporativo',
};

const users: User[] = [
  { id: 'u1', name: 'Ana García', role: 'Diseñadora UX/UI' },
  { id: 'u2', name: 'Carlos Martínez', role: 'Desarrollador Frontend' },
  { id: 'u3', name: 'Laura Rodríguez', role: 'Investigadora UX' },
];

const tasks: Task[] = [
  // Tareas completadas
  {
    id: 't1',
    name: 'Investigación de usuarios inicial',
    description: 'Entrevistas y encuestas a usuarios actuales',
    projectId: 'p1',
    assigneeId: 'u3',
    status: 'completed',
    tags: ['Research', 'UX'],
    estimatedHours: 20,
    consumedHours: 18,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-08'),
    dueDate: new Date('2025-09-15'),
    completedDate: new Date('2025-09-14'),
    priority: 'high',
  },
  {
    id: 't2',
    name: 'Análisis de competencia',
    description: 'Benchmarking de sitios web similares',
    projectId: 'p1',
    assigneeId: 'u3',
    status: 'completed',
    tags: ['Research'],
    estimatedHours: 12,
    consumedHours: 10,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-10'),
    dueDate: new Date('2025-09-17'),
    completedDate: new Date('2025-09-16'),
    priority: 'medium',
  },
  {
    id: 't3',
    name: 'Arquitectura de información',
    description: 'Definir estructura y organización del contenido',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['UX', 'UI'],
    estimatedHours: 16,
    consumedHours: 20,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-16'),
    dueDate: new Date('2025-09-23'),
    completedDate: new Date('2025-09-24'),
    priority: 'high',
  },
  {
    id: 't4',
    name: 'Wireframes de baja fidelidad',
    description: 'Bocetos iniciales de las páginas principales',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['UX'],
    estimatedHours: 24,
    consumedHours: 22,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-20'),
    dueDate: new Date('2025-09-30'),
    completedDate: new Date('2025-09-29'),
    priority: 'high',
  },
  {
    id: 't5',
    name: 'Sistema de diseño',
    description: 'Crear biblioteca de componentes y guía de estilo',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['UI', 'Design System'],
    estimatedHours: 32,
    consumedHours: 35,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-25'),
    dueDate: new Date('2025-10-10'),
    completedDate: new Date('2025-10-11'),
    priority: 'high',
  },
  {
    id: 't6',
    name: 'Mockups de alta fidelidad - Home',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['UI'],
    estimatedHours: 20,
    consumedHours: 18,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-05'),
    dueDate: new Date('2025-10-12'),
    completedDate: new Date('2025-10-12'),
    priority: 'high',
  },
  {
    id: 't7',
    name: 'Mockups de alta fidelidad - Productos',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['UI'],
    estimatedHours: 16,
    consumedHours: 15,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-10'),
    dueDate: new Date('2025-10-16'),
    completedDate: new Date('2025-10-15'),
    priority: 'medium',
  },
  
  // Tareas en progreso
  {
    id: 't8',
    name: 'Mockups de alta fidelidad - Contacto',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'in-progress',
    tags: ['UI'],
    estimatedHours: 12,
    consumedHours: 8,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-14'),
    dueDate: new Date('2025-10-20'),
    priority: 'medium',
  },
  {
    id: 't9',
    name: 'Desarrollo del componente Header',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'in-progress',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 8,
    consumedHours: 6,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-12'),
    dueDate: new Date('2025-10-18'),
    priority: 'high',
  },
  {
    id: 't10',
    name: 'Desarrollo del componente Footer',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'in-progress',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 6,
    consumedHours: 4,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-15'),
    dueDate: new Date('2025-10-19'),
    priority: 'medium',
  },
  {
    id: 't11',
    name: 'Testing de usabilidad',
    description: 'Pruebas con usuarios reales de los diseños',
    projectId: 'p1',
    assigneeId: 'u3',
    status: 'in-progress',
    tags: ['Research', 'UX'],
    estimatedHours: 16,
    consumedHours: 14,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-13'),
    dueDate: new Date('2025-10-21'),
    priority: 'high',
  },
  {
    id: 't12',
    name: 'Implementación página Home',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'in-progress',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 24,
    consumedHours: 18,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-14'),
    dueDate: new Date('2025-10-25'),
    priority: 'high',
  },
  
  // Tareas abiertas
  {
    id: 't13',
    name: 'Implementación página Productos',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 28,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-20'),
    dueDate: new Date('2025-11-02'),
    priority: 'high',
  },
  {
    id: 't14',
    name: 'Implementación página Contacto',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 16,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-25'),
    dueDate: new Date('2025-11-05'),
    priority: 'medium',
  },
  {
    id: 't15',
    name: 'Optimización de rendimiento',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'Performance'],
    estimatedHours: 12,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-10'),
    priority: 'medium',
  },
  {
    id: 't16',
    name: 'Testing de accesibilidad',
    projectId: 'p1',
    assigneeId: 'u3',
    status: 'open',
    tags: ['UX', 'Accessibility'],
    estimatedHours: 10,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-08'),
    priority: 'high',
  },
  {
    id: 't17',
    name: 'Documentación técnica',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Documentation', 'Dev'],
    estimatedHours: 8,
    consumedHours: 0,
    isBillable: false,
    isClientVisible: false,
    dueDate: new Date('2025-11-12'),
    priority: 'low',
  },
  
  // Tareas en riesgo (consumo excedido)
  {
    id: 't18',
    name: 'Integración con API de pagos',
    description: 'Conectar sistema de pagos externo',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'in-progress',
    tags: ['Dev', 'Backend', 'API'],
    estimatedHours: 20,
    consumedHours: 24,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-10-08'),
    dueDate: new Date('2025-10-18'),
    priority: 'high',
  },
  {
    id: 't19',
    name: 'Revisiones de diseño con cliente',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'in-progress',
    tags: ['Meeting', 'UI'],
    estimatedHours: 8,
    consumedHours: 12,
    isBillable: true,
    isClientVisible: true,
    startDate: new Date('2025-09-30'),
    dueDate: new Date('2025-10-17'),
    priority: 'medium',
  },
  {
    id: 't20',
    name: 'Configuración de entorno de desarrollo',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'completed',
    tags: ['Dev', 'DevOps'],
    estimatedHours: 4,
    consumedHours: 8,
    isBillable: false,
    isClientVisible: false,
    startDate: new Date('2025-09-08'),
    dueDate: new Date('2025-09-12'),
    completedDate: new Date('2025-09-13'),
    priority: 'high',
  },
  
  // Más tareas abiertas
  {
    id: 't21',
    name: 'SEO y metadatos',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'SEO'],
    estimatedHours: 10,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-15'),
    priority: 'medium',
  },
  {
    id: 't22',
    name: 'Formulario de contacto avanzado',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'Frontend'],
    estimatedHours: 14,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-07'),
    priority: 'medium',
  },
  {
    id: 't23',
    name: 'Animaciones y transiciones',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'open',
    tags: ['UI', 'Animation'],
    estimatedHours: 18,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-10'),
    priority: 'low',
  },
  {
    id: 't24',
    name: 'Reunión de kick-off',
    projectId: 'p1',
    assigneeId: 'u1',
    status: 'completed',
    tags: ['Meeting'],
    estimatedHours: 2,
    consumedHours: 2,
    isBillable: false,
    isClientVisible: false,
    startDate: new Date('2025-09-08'),
    completedDate: new Date('2025-09-08'),
    priority: 'high',
  },
  {
    id: 't25',
    name: 'Deploy a producción',
    projectId: 'p1',
    assigneeId: 'u2',
    status: 'open',
    tags: ['Dev', 'DevOps'],
    estimatedHours: 6,
    consumedHours: 0,
    isBillable: true,
    isClientVisible: true,
    dueDate: new Date('2025-11-20'),
    priority: 'high',
  },
];

// Generate time entries for the last 6 weeks
const generateTimeEntries = (): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const today = new Date('2025-10-19'); // Fixed date for consistency
  const sixWeeksAgo = new Date(today);
  sixWeeksAgo.setDate(today.getDate() - 42);
  
  let entryId = 1;
  
  tasks.forEach(task => {
    if (task.consumedHours === 0) return;
    
    const taskStartDate = task.startDate || sixWeeksAgo;
    const taskEndDate = task.completedDate || today;
    
    // Distribute hours across working days
    let remainingHours = task.consumedHours;
    const workDays: Date[] = [];
    
    const currentDate = new Date(taskStartDate);
    while (currentDate <= taskEndDate && remainingHours > 0) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        workDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Distribute hours randomly but realistically
    workDays.forEach((date, index) => {
      if (remainingHours <= 0) return;
      
      const isLastDay = index === workDays.length - 1;
      const hours = isLastDay 
        ? remainingHours 
        : Math.min(
            Math.random() * 6 + 2, // 2-8 hours per day
            remainingHours
          );
      
      if (hours > 0) {
        entries.push({
          id: `e${entryId++}`,
          taskId: task.id,
          userId: task.assigneeId,
          date: new Date(date),
          hours: parseFloat(hours.toFixed(2)),
          isBillable: task.isBillable,
        });
        
        remainingHours -= hours;
      }
    });
  });
  
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const timeEntries = generateTimeEntries();

// Export all data
export const mockTaskData = {
  client,
  project,
  users,
  tasks,
  timeEntries,
};

// Helper functions
export const getTaskById = (id: string) => tasks.find(t => t.id === id);
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getTaskEntries = (taskId: string) => timeEntries.filter(e => e.taskId === taskId);
export const getAllTags = () => Array.from(new Set(tasks.flatMap(t => t.tags))).sort();
