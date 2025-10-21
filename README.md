
# Dashboard Cliente - Tres Puntos Comunicación

Dashboard de gestión de horas y proyectos para clientes, con integración completa con Toggl API.

## 🚀 Características

- ✅ **Dashboard completo** con visualización de paquetes de horas
- ✅ **Integración real con Toggl API** para sincronización de datos
- ✅ **Gestión de clientes y proyectos** con datos en tiempo real
- ✅ **Reportes y visualizaciones** con gráficos interactivos
- ✅ **Tema claro/oscuro** con diseño responsive
- ✅ **Sistema de autenticación** y gestión de API Keys

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **UI**: Radix UI + Tailwind CSS
- **Gráficos**: Recharts
- **API**: Toggl API v9
- **Estado**: React Hooks + Context

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env.local`:
```env
VITE_TOGGL_API_URL=https://api.track.toggl.com/api/v9
VITE_APP_NAME=Dashboard Cliente
```

### Integración con Toggl
1. Obtén tu API Token en https://track.toggl.com/profile
2. Ve a Settings > Integración Toggl
3. Añade tu API Key
4. Verifica la conexión

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
# Abre http://localhost:3000
```

### Producción
```bash
npm run build
# Los archivos se generan en la carpeta build/
```

### Despliegue Automático
El proyecto está configurado con GitHub Actions para despliegue automático al servidor.

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Radix UI)
│   └── ...             # Componentes específicos
├── pages/              # Páginas principales
├── lib/                # Utilidades y servicios
│   ├── togglApi.ts     # Servicio de integración Toggl
│   ├── mockData.ts     # Datos de prueba
│   └── utils.ts        # Utilidades generales
└── styles/             # Estilos globales
```

## 🔗 Integración Toggl

### Funcionalidades
- ✅ Verificación de API Keys
- ✅ Obtención de workspaces
- ✅ Sincronización de clientes y proyectos
- ✅ Importación de time entries
- ✅ Manejo de errores específicos

### API Endpoints Utilizados
- `GET /me` - Información del usuario
- `GET /workspaces` - Lista de workspaces
- `GET /workspaces/{id}/clients` - Clientes del workspace
- `GET /workspaces/{id}/projects` - Proyectos del workspace
- `GET /time_entries` - Entradas de tiempo

## 🎯 Roadmap

- [ ] **Autenticación de usuarios** con sistema de login
- [ ] **CRUD completo** de paquetes y tareas
- [ ] **Reportes avanzados** con exportación PDF/Excel
- [ ] **Notificaciones en tiempo real** con WebSockets
- [ ] **Dashboard móvil** con PWA
- [ ] **Integración con más APIs** (Slack, Google Calendar)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Tres Puntos Comunicación.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: contacto@trespuntoscomunicacion.es
- **Web**: https://trespuntoscomunicacion.es

---
**Versión**: 2.0.0  
**Última actualización**: $(date)  
**Estado**: ✅ En producción
  