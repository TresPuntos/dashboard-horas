// Toggl API Integration
// Documentación: https://github.com/toggl/toggl_api_docs

export interface TogglWorkspace {
  id: number;
  name: string;
  premium: boolean;
  admin: boolean;
  default_hourly_rate?: number;
  default_currency: string;
  at: string;
}

export interface TogglUser {
  id: number;
  api_token: string;
  default_workspace_id: number;
  email: string;
  fullname: string;
  timezone: string;
  beginning_of_week: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  openid_email?: string;
  openid_enabled: boolean;
  country_id?: number;
  has_password: boolean;
  at: string;
}

export interface TogglClient {
  id: number;
  wid: number;
  name: string;
  at: string;
}

export interface TogglProject {
  id: number;
  wid: number;
  cid?: number;
  name: string;
  billable: boolean;
  is_private: boolean;
  active: boolean;
  template?: boolean;
  at: string;
  created_at: string;
  color: string;
  auto_estimates?: boolean;
  estimated_hours?: number;
  rate?: number;
  rate_last_updated?: string;
  currency?: string;
}

export interface TogglTimeEntry {
  id: number;
  wid: number;
  pid?: number;
  tid?: number;
  billable: boolean;
  start: string;
  stop?: string;
  duration: number;
  description: string;
  tags: string[];
  at: string;
  uid: number;
}

class TogglApiService {
  private baseUrl = 'https://api.track.toggl.com/api/v9';
  
  async verifyApiKey(apiKey: string): Promise<{
    success: boolean;
    user?: TogglUser;
    workspaces?: TogglWorkspace[];
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'API Key inválida o credenciales incorrectas' };
        } else if (response.status === 403) {
          return { success: false, error: 'Acceso denegado - verifica permisos' };
        } else if (response.status >= 500) {
          return { success: false, error: 'Error del servidor de Toggl - intenta más tarde' };
        } else {
          return { success: false, error: `Error HTTP ${response.status}: ${response.statusText}` };
        }
      }

      const user: TogglUser = await response.json();
      
      // Obtener workspaces del usuario
      const workspacesResponse = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      let workspaces: TogglWorkspace[] = [];
      if (workspacesResponse.ok) {
        workspaces = await workspacesResponse.json();
      }

      return {
        success: true,
        user,
        workspaces,
      };
    } catch (error) {
      console.error('Error verificando API Key de Toggl:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión con Toggl API',
      };
    }
  }

  async getWorkspaces(apiKey: string): Promise<TogglWorkspace[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo workspaces:', error);
      throw error;
    }
  }

  async getClients(apiKey: string, workspaceId: number): Promise<TogglClient[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/clients`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  }

  async getProjects(apiKey: string, workspaceId: number): Promise<TogglProject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/projects`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  }

  async getTimeEntries(apiKey: string, startDate: string, endDate: string, workspaceId?: number): Promise<TogglTimeEntry[]> {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      if (workspaceId) {
        params.append('workspace_id', workspaceId.toString());
      }

      const response = await fetch(`${this.baseUrl}/time_entries?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo time entries:', error);
      throw error;
    }
  }
}

export const togglApiService = new TogglApiService();
