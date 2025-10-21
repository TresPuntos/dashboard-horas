import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockTaskData } from '../lib/taskMockData';
import { 
  Copy, 
  Check, 
  Settings2, 
  Palette, 
  FileText, 
  Users, 
  Plus,
  Trash2,
  Upload,
  Building2,
  Mail,
  Phone,
  Link as LinkIcon,
  Edit,
  Eye,
  EyeOff,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { togglApiService } from '../lib/togglApi';

type ConnectionStatus = 'connected' | 'error' | 'pending' | 'unchecked';

interface TogglApiKey {
  id: string;
  name: string;
  apiKey: string;
  status: ConnectionStatus;
  errorMessage?: string;
  workspaceId?: string;
  workspaceName?: string;
  lastChecked?: Date;
}

interface TogglAccount {
  id: string;
  name: string;
  apiKey: string;
}

interface TogglClient {
  id: string;
  name: string;
  accountId: string;
}

interface TogglProject {
  id: string;
  name: string;
  clientId: string;
  accountId: string;
}

interface ClientConfig {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  togglAccounts: string[]; // IDs de cuentas de Toggl
  selectedClients: string[]; // IDs de clientes de Toggl
  selectedProjects: string[]; // IDs de proyectos (o 'all' para todos)
  dashboardUrl: string;
  accentColor: string;
}

export function SettingsPage() {
  const { client } = mockTaskData;
  const [copied, setCopied] = useState(false);
  
  // Estado para configuración básica
  const [clientName, setClientName] = useState(client.name);
  const [accentColor, setAccentColor] = useState(client.accentColor);
  const [dashboardUrl, setDashboardUrl] = useState('https://dashboard.trespuntos.com/acme-corp');

  // Estado para clientes
  const [clients, setClients] = useState<ClientConfig[]>([
    {
      id: '1',
      name: 'ACME Corp.',
      email: 'contacto@acmecorp.com',
      phone: '+34 600 000 000',
      togglAccounts: ['ta1'],
      selectedClients: ['tc1'],
      selectedProjects: ['all'],
      dashboardUrl: 'https://dashboard.trespuntos.com/acme-corp',
      accentColor: '#5CFFBE',
    }
  ]);

  // Estado para API Keys de Toggl
  const [togglApiKeys, setTogglApiKeys] = useState<TogglApiKey[]>([
    {
      id: '1',
      name: 'Tres Puntos - Cuenta Principal',
      apiKey: 'a1b2c3d4e5f6g7h8i9j0',
      status: 'connected',
      workspaceId: 'ws_12345',
      workspaceName: 'Tres Puntos Comunicación',
      lastChecked: new Date(),
    },
    {
      id: '2',
      name: 'Tres Puntos - Proyectos',
      apiKey: 'k1l2m3n4o5p6q7r8s9t0',
      status: 'unchecked',
    },
  ]);

  // Estado para dialogo de API Key
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<TogglApiKey | null>(null);
  const [newApiKey, setNewApiKey] = useState<Partial<TogglApiKey>>({
    name: '',
    apiKey: '',
    status: 'unchecked',
  });
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Mock data para Toggl (usado en gestión de clientes)
  const [togglAccounts] = useState<TogglAccount[]>([
    { id: 'ta1', name: 'Tres Puntos - Cuenta Principal', apiKey: '••••••••••••' },
    { id: 'ta2', name: 'Tres Puntos - Proyectos', apiKey: '••••••••••••' },
  ]);

  const [togglClients, setTogglClients] = useState<TogglClient[]>([
    { id: 'tc1', name: 'ACME Corp.', accountId: 'ta1' },
    { id: 'tc2', name: 'TechStart Inc.', accountId: 'ta1' },
    { id: 'tc3', name: 'Design Co.', accountId: 'ta2' },
  ]);

  const [togglProjects, setTogglProjects] = useState<TogglProject[]>([
    { id: 'tp1', name: 'Web Redesign', clientId: 'tc1', accountId: 'ta1' },
    { id: 'tp2', name: 'Marketing Campaign', clientId: 'tc1', accountId: 'ta1' },
    { id: 'tp3', name: 'Mobile App', clientId: 'tc2', accountId: 'ta1' },
    { id: 'tp4', name: 'Branding', clientId: 'tc3', accountId: 'ta2' },
  ]);

  // Función para cargar datos reales de Toggl
  const loadTogglData = async (apiKey: string, workspaceId: string) => {
    try {
      const workspaceIdNum = parseInt(workspaceId);
      
      // Cargar clientes y proyectos en paralelo
      const [clients, projects] = await Promise.all([
        togglApiService.getClients(apiKey, workspaceIdNum),
        togglApiService.getProjects(apiKey, workspaceIdNum)
      ]);

      // Actualizar estado con datos reales
      const realClients: TogglClient[] = clients.map(client => ({
        id: `tc_${client.id}`,
        name: client.name,
        accountId: 'real_account'
      }));

      const realProjects: TogglProject[] = projects.map(project => ({
        id: `tp_${project.id}`,
        name: project.name,
        clientId: project.cid ? `tc_${project.cid}` : 'no_client',
        accountId: 'real_account'
      }));

      setTogglClients(prev => [...prev, ...realClients]);
      setTogglProjects(prev => [...prev, ...realProjects]);

      toast.success(`Cargados ${clients.length} clientes y ${projects.length} proyectos de Toggl`);
    } catch (error) {
      console.error('Error cargando datos de Toggl:', error);
      toast.error('Error cargando datos de Toggl');
    }
  };

  // Estado para diálogo de crear/editar cliente
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientConfig | null>(null);
  const [newClient, setNewClient] = useState<Partial<ClientConfig>>({
    name: '',
    email: '',
    phone: '',
    togglAccounts: [],
    selectedClients: [],
    selectedProjects: [],
    dashboardUrl: '',
    accentColor: '#5CFFBE',
  });

  const handleDuplicate = () => {
    toast.success('Configuración duplicada para nuevo cliente');
  };

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  const handleCopyTemplate = () => {
    const template = {
      client: {
        name: clientName,
        accentColor: accentColor,
      },
      filters: {
        defaultView: 'overview',
        showInternalByDefault: false,
      },
      branding: {
        logo: null,
        accentColor: accentColor,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
    setCopied(true);
    toast.success('Configuración copiada al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  // Funciones para API Keys de Toggl
  const verifyTogglConnection = async (apiKey: string): Promise<{ success: boolean; workspaceName?: string; workspaceId?: string; error?: string }> => {
    try {
      const result = await togglApiService.verifyApiKey(apiKey);
      
      if (result.success && result.user && result.workspaces) {
        // Usar el primer workspace disponible
        const primaryWorkspace = result.workspaces[0];
        return {
          success: true,
          workspaceName: primaryWorkspace.name,
          workspaceId: primaryWorkspace.id.toString(),
        };
      } else {
        return {
          success: false,
          error: result.error || 'Error desconocido al verificar API Key',
        };
      }
    } catch (error) {
      console.error('Error verificando conexión Toggl:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión con Toggl',
      };
    }
  };

  const handleVerifyApiKey = async (keyId: string) => {
    const keyToVerify = togglApiKeys.find(k => k.id === keyId);
    if (!keyToVerify) return;

    // Actualizar estado a "pending"
    setTogglApiKeys(keys => keys.map(k => 
      k.id === keyId ? { ...k, status: 'pending' as ConnectionStatus } : k
    ));

    try {
      const result = await verifyTogglConnection(keyToVerify.apiKey);

      if (result.success) {
        setTogglApiKeys(keys => keys.map(k => 
          k.id === keyId ? { 
            ...k, 
            status: 'connected' as ConnectionStatus,
            workspaceId: result.workspaceId,
            workspaceName: result.workspaceName,
            lastChecked: new Date(),
            errorMessage: undefined,
          } : k
        ));
        toast.success(`Conexión exitosa: ${result.workspaceName}`);
        
        // Cargar datos de Toggl automáticamente
        if (result.workspaceId) {
          loadTogglData(keyToVerify.apiKey, result.workspaceId);
        }
      } else {
        setTogglApiKeys(keys => keys.map(k => 
          k.id === keyId ? { 
            ...k, 
            status: 'error' as ConnectionStatus,
            errorMessage: result.error,
            lastChecked: new Date(),
          } : k
        ));
        toast.error(`Error de conexión: ${result.error}`);
      }
    } catch (error) {
      setTogglApiKeys(keys => keys.map(k => 
        k.id === keyId ? { 
          ...k, 
          status: 'error' as ConnectionStatus,
          errorMessage: 'Error inesperado al verificar conexión',
          lastChecked: new Date(),
        } : k
      ));
      toast.error('Error inesperado al verificar conexión');
      console.error('Error verificando API Key:', error);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKey.name || !newApiKey.apiKey) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const apiKey: TogglApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      apiKey: newApiKey.apiKey,
      status: 'pending',
    };

    setTogglApiKeys([...togglApiKeys, apiKey]);
    setIsApiKeyDialogOpen(false);
    setNewApiKey({ name: '', apiKey: '', status: 'unchecked' });

    // Verificar automáticamente la nueva key
    toast.info('Verificando conexión...');
    setTimeout(() => handleVerifyApiKey(apiKey.id), 100);
  };

  const handleUpdateApiKey = async () => {
    if (!editingApiKey) return;

    const wasApiKeyChanged = togglApiKeys.find(k => k.id === editingApiKey.id)?.apiKey !== editingApiKey.apiKey;

    setTogglApiKeys(keys => keys.map(k => 
      k.id === editingApiKey.id 
        ? { ...editingApiKey, status: wasApiKeyChanged ? 'unchecked' as ConnectionStatus : k.status }
        : k
    ));
    
    setIsApiKeyDialogOpen(false);
    setEditingApiKey(null);
    toast.success('API Key actualizada correctamente');

    if (wasApiKeyChanged) {
      toast.info('API Key modificada - verifica la conexión');
    }
  };

  const handleDeleteApiKey = (keyId: string) => {
    setTogglApiKeys(keys => keys.filter(k => k.id !== keyId));
    toast.success('API Key eliminada correctamente');
  };

  const openEditApiKeyDialog = (apiKey: TogglApiKey) => {
    setEditingApiKey({ ...apiKey });
    setIsApiKeyDialogOpen(true);
  };

  const openCreateApiKeyDialog = () => {
    setEditingApiKey(null);
    setNewApiKey({ name: '', apiKey: '', status: 'unchecked' });
    setIsApiKeyDialogOpen(true);
  };

  const toggleShowApiKey = (keyId: string) => {
    setShowApiKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const getStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Conectada
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Verificando...
          </Badge>
        );
      case 'unchecked':
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Sin verificar
          </Badge>
        );
    }
  };

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    const client: ClientConfig = {
      id: Date.now().toString(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || '',
      logo: newClient.logo,
      togglAccounts: newClient.togglAccounts || [],
      selectedClients: newClient.selectedClients || [],
      selectedProjects: newClient.selectedProjects || [],
      dashboardUrl: newClient.dashboardUrl || `https://dashboard.trespuntos.com/${newClient.name?.toLowerCase().replace(/\s+/g, '-')}`,
      accentColor: newClient.accentColor || '#5CFFBE',
    };

    setClients([...clients, client]);
    setIsClientDialogOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      togglAccounts: [],
      selectedClients: [],
      selectedProjects: [],
      dashboardUrl: '',
      accentColor: '#5CFFBE',
    });
    toast.success('Cliente creado correctamente');
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;

    setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
    setIsClientDialogOpen(false);
    setEditingClient(null);
    toast.success('Cliente actualizado correctamente');
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast.success('Cliente eliminado correctamente');
  };

  const openEditDialog = (client: ClientConfig) => {
    setEditingClient({ ...client });
    setIsClientDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingClient(null);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      togglAccounts: [],
      selectedClients: [],
      selectedProjects: [],
      dashboardUrl: '',
      accentColor: '#5CFFBE',
    });
    setIsClientDialogOpen(true);
  };

  const getAvailableClientsForAccount = (accountIds: string[]) => {
    return togglClients.filter(tc => accountIds.includes(tc.accountId));
  };

  const getAvailableProjectsForClients = (clientIds: string[], accountIds: string[]) => {
    return togglProjects.filter(tp => 
      clientIds.includes(tp.clientId) && accountIds.includes(tp.accountId)
    );
  };

  const colorPresets = [
    { name: 'Turquesa', value: '#5CFFBE' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Naranja', value: '#F59E0B' },
    { name: 'Rosa', value: '#EC4899' },
  ];

  const currentClient = editingClient || newClient;
  const setCurrentClient = editingClient ? setEditingClient : (updates: any) => setNewClient({ ...newClient, ...updates });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 dark:text-gray-50">Configuración del Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona clientes, integraciones y personalización
        </p>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="toggl">Toggl API</TabsTrigger>
          <TabsTrigger value="branding">Marca</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="access">Acceso</TabsTrigger>
        </TabsList>

        {/* TAB: Gestión de Clientes */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Gestión de Clientes
                  </CardTitle>
                  <CardDescription>
                    Crea y administra clientes con integración de Toggl
                  </CardDescription>
                </div>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <Card key={client.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                            {client.logo ? (
                              <img src={client.logo} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Building2 className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-gray-900 dark:text-gray-50 mb-1">{client.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span>{client.email}</span>
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" />
                                <span className="text-primary truncate">{client.dashboardUrl}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="secondary" className="text-xs">
                                {client.togglAccounts.length} cuenta(s) Toggl
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {client.selectedClients.length} cliente(s)
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {client.selectedProjects.includes('all') ? 'Todos los proyectos' : `${client.selectedProjects.length} proyecto(s)`}
                              </Badge>
                              <div 
                                className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                                style={{ backgroundColor: client.accentColor }}
                                title={`Color: ${client.accentColor}`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteClient(client.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {clients.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay clientes configurados</p>
                    <p className="text-sm mt-2">Crea tu primer cliente para comenzar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Toggl API Keys */}
        <TabsContent value="toggl" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys de Toggl
                  </CardTitle>
                  <CardDescription>
                    Gestiona las claves de API para conectar con Toggl Track
                  </CardDescription>
                </div>
                <Button onClick={openCreateApiKeyDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {togglApiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-gray-900 dark:text-gray-50">{apiKey.name}</h3>
                              {getStatusBadge(apiKey.status)}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600 dark:text-gray-400">API Key:</Label>
                                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {showApiKeys[apiKey.id] ? apiKey.apiKey : '•'.repeat(20)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleShowApiKey(apiKey.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {showApiKeys[apiKey.id] ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(apiKey.apiKey);
                                    toast.success('API Key copiada al portapapeles');
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>

                              {apiKey.status === 'connected' && apiKey.workspaceName && (
                                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <AlertDescription className="text-green-800 dark:text-green-300">
                                    Conectado a workspace: <strong>{apiKey.workspaceName}</strong>
                                    {apiKey.lastChecked && (
                                      <span className="text-xs ml-2">
                                        (verificado hace {Math.floor((Date.now() - apiKey.lastChecked.getTime()) / 60000)} min)
                                      </span>
                                    )}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {apiKey.status === 'error' && apiKey.errorMessage && (
                                <Alert variant="destructive">
                                  <XCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Error:</strong> {apiKey.errorMessage}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {apiKey.status === 'unchecked' && (
                                <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                  <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                                    Esta API Key no ha sido verificada. Haz clic en "Verificar Conexión" para comprobar su validez.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyApiKey(apiKey.id)}
                              disabled={apiKey.status === 'pending'}
                            >
                              {apiKey.status === 'pending' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                            {apiKey.status === 'connected' && apiKey.workspaceId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => loadTogglData(apiKey.apiKey, apiKey.workspaceId!)}
                                title="Cargar datos de Toggl"
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditApiKeyDialog(apiKey)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {togglApiKeys.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay API Keys configuradas</p>
                    <p className="text-sm mt-2">Añade tu primera API Key de Toggl para comenzar</p>
                  </div>
                )}

                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    <strong>¿Dónde encontrar tu API Key?</strong>
                    <p className="mt-1 text-sm">
                      Ve a tu perfil de Toggl Track → Configuración → API Token. Copia el token y pégalo aquí.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Marca y Apariencia */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Marca y Apariencia
              </CardTitle>
              <CardDescription>
                Configura el logo y colores del cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nombre del Cliente</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: ACME Corp."
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Color de Acento</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.map(preset => (
                    <Button
                      key={preset.value}
                      variant={accentColor === preset.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAccentColor(preset.value)}
                      className="gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.value }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2 items-center mt-4">
                  <Label htmlFor="custom-color">Personalizado:</Label>
                  <input
                    id="custom-color"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-20 h-10 rounded border cursor-pointer"
                  />
                  <span className="text-gray-600 dark:text-gray-400">{accentColor}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="logo">Logo del Cliente</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center text-gray-400">
                      <Settings2 className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-xs">Sin logo</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Logo
                    </Button>
                    <p className="text-gray-600 dark:text-gray-400">
                      Formatos: PNG, SVG. Tamaño recomendado: 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Configuración del Dashboard */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Configuración del Dashboard
              </CardTitle>
              <CardDescription>
                Define qué información se muestra al cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Vista por Defecto</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      Página inicial al cargar el dashboard
                    </p>
                  </div>
                  <Select defaultValue="overview">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Resumen</SelectItem>
                      <SelectItem value="tasks">Tareas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Ocultar Tareas Internas por Defecto</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      Las tareas marcadas como internas estarán ocultas
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Columnas Visibles en Tabla</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      Selecciona qué columnas mostrar en la vista de tabla
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Filtros Predeterminados</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      Filtros aplicados al cargar el dashboard
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Actions */}
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plantilla (Template)
              </CardTitle>
              <CardDescription>
                Duplica esta configuración para crear un dashboard para otro cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4 flex-col items-start"
                  onClick={handleCopyTemplate}
                >
                  <div className="flex items-center gap-2 w-full">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    <span>Copiar Configuración</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-left">
                    Copia la configuración actual como JSON
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 h-auto py-4 flex-col items-start"
                  onClick={handleDuplicate}
                >
                  <div className="flex items-center gap-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>Duplicar para Nuevo Cliente</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-left">
                    Crea un nuevo dashboard con esta configuración
                  </p>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Configuración actual incluye:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Marca y colores</Badge>
                  <Badge variant="secondary">Vista por defecto</Badge>
                  <Badge variant="secondary">Filtros predeterminados</Badge>
                  <Badge variant="secondary">Columnas visibles</Badge>
                  <Badge variant="secondary">Configuración de compartir</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Acceso y Compartir */}
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Acceso y Compartir
              </CardTitle>
              <CardDescription>
                Gestiona quién puede ver este dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-blue-900 dark:text-blue-400 mb-1">
                      Enlace de Solo Lectura
                    </h3>
                    <p className="text-blue-700 dark:text-blue-500 mb-3">
                      Comparte este dashboard con tu cliente usando un enlace seguro
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={dashboardUrl}
                        onChange={(e) => setDashboardUrl(e.target.value)}
                        className="bg-white dark:bg-gray-950"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(dashboardUrl);
                          toast.success('URL copiada al portapapeles');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Protección con Contraseña</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      Requiere contraseña para acceder al dashboard
                    </p>
                  </div>
                  <Checkbox />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Fecha de Expiración</Label>
                    <p className="text-gray-600 dark:text-gray-400">
                      El enlace dejará de funcionar después de esta fecha
                    </p>
                  </div>
                  <Select defaultValue="never">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca</SelectItem>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Crear/Editar API Key */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingApiKey ? 'Editar API Key' : 'Nueva API Key de Toggl'}
            </DialogTitle>
            <DialogDescription>
              Introduce un nombre descriptivo y tu API Key de Toggl Track
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name">Nombre Descriptivo *</Label>
              <Input
                id="api-key-name"
                value={editingApiKey ? editingApiKey.name : newApiKey.name || ''}
                onChange={(e) => {
                  if (editingApiKey) {
                    setEditingApiKey({ ...editingApiKey, name: e.target.value });
                  } else {
                    setNewApiKey({ ...newApiKey, name: e.target.value });
                  }
                }}
                placeholder="Ej: Tres Puntos - Cuenta Principal"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Un nombre que te ayude a identificar esta cuenta
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key-value">API Key *</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key-value"
                  type={editingApiKey && showApiKeys[editingApiKey.id] ? 'text' : 'password'}
                  value={editingApiKey ? editingApiKey.apiKey : newApiKey.apiKey || ''}
                  onChange={(e) => {
                    if (editingApiKey) {
                      setEditingApiKey({ ...editingApiKey, apiKey: e.target.value });
                    } else {
                      setNewApiKey({ ...newApiKey, apiKey: e.target.value });
                    }
                  }}
                  placeholder="Pega aquí tu API Token de Toggl"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editingApiKey) {
                      toggleShowApiKey(editingApiKey.id);
                    }
                  }}
                  disabled={!editingApiKey}
                >
                  {editingApiKey && showApiKeys[editingApiKey.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Formato típico: 32 caracteres alfanuméricos
              </p>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                <strong>¿Cómo obtener tu API Key?</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Accede a <a href="https://track.toggl.com/profile" target="_blank" rel="noopener noreferrer" className="underline">Toggl Track</a></li>
                  <li>Ve a tu perfil (icono de usuario arriba a la derecha)</li>
                  <li>Desplázate hasta "API Token" en la parte inferior</li>
                  <li>Copia el token y pégalo aquí</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={editingApiKey ? handleUpdateApiKey : handleCreateApiKey}>
              {editingApiKey ? 'Actualizar' : 'Crear y Verificar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Crear/Editar Cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
            <DialogDescription>
              Configura la información del cliente y su integración con Toggl
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-gray-50">Información Básica</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Nombre del Cliente *</Label>
                  <Input
                    id="name"
                    value={currentClient.name || ''}
                    onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                    placeholder="Ej: ACME Corp."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentClient.email || ''}
                    onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                    placeholder="contacto@cliente.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={currentClient.phone || ''}
                    onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo del Cliente</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    {currentClient.logo ? (
                      <img src={currentClient.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Logo
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Integración Toggl */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-gray-50">Integración con Toggl</h3>
              
              <div className="space-y-2">
                <Label>Cuentas de Toggl</Label>
                <div className="space-y-2">
                  {togglAccounts.map((account) => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`account-${account.id}`}
                        checked={currentClient.togglAccounts?.includes(account.id)}
                        onCheckedChange={(checked) => {
                          const accounts = checked
                            ? [...(currentClient.togglAccounts || []), account.id]
                            : (currentClient.togglAccounts || []).filter(id => id !== account.id);
                          setCurrentClient({ ...currentClient, togglAccounts: accounts, selectedClients: [], selectedProjects: [] });
                        }}
                      />
                      <label
                        htmlFor={`account-${account.id}`}
                        className="text-sm flex items-center gap-2 flex-1 cursor-pointer"
                      >
                        {account.name}
                        <Badge variant="secondary" className="text-xs">
                          API: {account.apiKey}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {currentClient.togglAccounts && currentClient.togglAccounts.length > 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Clientes de Toggl</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selecciona los clientes de Toggl asociados a este cliente
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {getAvailableClientsForAccount(currentClient.togglAccounts).map((togglClient) => (
                        <div key={togglClient.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`client-${togglClient.id}`}
                            checked={currentClient.selectedClients?.includes(togglClient.id)}
                            onCheckedChange={(checked) => {
                              const clients = checked
                                ? [...(currentClient.selectedClients || []), togglClient.id]
                                : (currentClient.selectedClients || []).filter(id => id !== togglClient.id);
                              setCurrentClient({ ...currentClient, selectedClients: clients, selectedProjects: [] });
                            }}
                          />
                          <label
                            htmlFor={`client-${togglClient.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {togglClient.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentClient.selectedClients && currentClient.selectedClients.length > 0 && (
                    <div className="space-y-2">
                      <Label>Proyectos</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selecciona proyectos específicos o todos
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="all-projects"
                            checked={currentClient.selectedProjects?.includes('all')}
                            onCheckedChange={(checked) => {
                              setCurrentClient({ 
                                ...currentClient, 
                                selectedProjects: checked ? ['all'] : [] 
                              });
                            }}
                          />
                          <label htmlFor="all-projects" className="text-sm cursor-pointer">
                            Todos los proyectos
                          </label>
                        </div>
                        
                        {!currentClient.selectedProjects?.includes('all') && (
                          <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                            {getAvailableProjectsForClients(
                              currentClient.selectedClients,
                              currentClient.togglAccounts
                            ).map((project) => (
                              <div key={project.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`project-${project.id}`}
                                  checked={currentClient.selectedProjects?.includes(project.id)}
                                  onCheckedChange={(checked) => {
                                    const projects = checked
                                      ? [...(currentClient.selectedProjects || []), project.id]
                                      : (currentClient.selectedProjects || []).filter(id => id !== project.id);
                                    setCurrentClient({ ...currentClient, selectedProjects: projects });
                                  }}
                                />
                                <label
                                  htmlFor={`project-${project.id}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {project.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* URL y Color */}
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-gray-50">Personalización</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dashboard-url">URL del Dashboard</Label>
                <Input
                  id="dashboard-url"
                  value={currentClient.dashboardUrl || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, dashboardUrl: e.target.value })}
                  placeholder="https://dashboard.trespuntos.com/cliente"
                />
              </div>

              <div className="space-y-2">
                <Label>Color de Acento</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.map(preset => (
                    <Button
                      key={preset.value}
                      variant={currentClient.accentColor === preset.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentClient({ ...currentClient, accentColor: preset.value })}
                      className="gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.value }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2 items-center mt-2">
                  <Label htmlFor="client-custom-color">Personalizado:</Label>
                  <input
                    id="client-custom-color"
                    type="color"
                    value={currentClient.accentColor || '#5CFFBE'}
                    onChange={(e) => setCurrentClient({ ...currentClient, accentColor: e.target.value })}
                    className="w-20 h-10 rounded border cursor-pointer"
                  />
                  <span className="text-gray-600 dark:text-gray-400">{currentClient.accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={editingClient ? handleUpdateClient : handleCreateClient}>
              {editingClient ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
