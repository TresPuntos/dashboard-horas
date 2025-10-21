# 🚀 Instrucciones Completas para Subir a GitHub

## ✅ **Estado Actual**
- ✅ Repositorio Git configurado localmente
- ✅ 3 commits con todas las correcciones
- ✅ GitHub Actions configurado para despliegue automático
- ✅ Archivos corregidos listos para subir

## 📋 **Pasos para Completar la Configuración**

### **Paso 1: Crear Repositorio en GitHub**

1. **Ve a GitHub**: https://github.com/new
2. **Configuración del repositorio**:
   - **Nombre**: `dashboard-cliente`
   - **Descripción**: `Dashboard Cliente - Tres Puntos Comunicación`
   - **Visibilidad**: Público
   - **⚠️ IMPORTANTE**: NO marques "Add a README file"
3. **Haz clic en**: "Create repository"

### **Paso 2: Subir Código**

Ejecuta este comando en el terminal:
```bash
cd "/Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design"
./push-to-github.sh
```

O manualmente:
```bash
git push -u origin main
```

### **Paso 3: Configurar Secrets para Despliegue Automático**

1. **Ve a**: https://github.com/trespuntoscomunicacion/dashboard-cliente/settings/secrets/actions
2. **Haz clic en**: "New repository secret"
3. **Añade estos secrets**:
   - `SERVER_HOST` = `trespuntoscomunicacion.es`
   - `SERVER_USER` = `cursor`
   - `SERVER_PASSWORD` = `5#!OWwzue465&OO(N5`
   - `SERVER_PORT` = `22`

### **Paso 4: Verificar Despliegue Automático**

1. **Ve a**: https://github.com/trespuntoscomunicacion/dashboard-cliente/actions
2. **Verifica que el workflow se ejecute** automáticamente
3. **Confirma que el despliegue sea exitoso**

### **Paso 5: Probar el Dashboard**

1. **URL**: https://trespuntoscomunicacion.es/db-clientes/
2. **Verifica que carga correctamente**
3. **Prueba la integración con Toggl API**

## 🧪 **Probar Integración Toggl Corregida**

### **Con Consola del Navegador**
1. **Abre**: https://trespuntoscomunicacion.es/db-clientes/
2. **Presiona F12** > Console
3. **Ve a**: Settings > Integración Toggl
4. **Añade tu API Key real** de Toggl
5. **Haz clic en**: "Verificar Conexión"
6. **Observa los logs detallados** en consola:

```
🚀 Iniciando verificación de API Key: 1
🔍 Verificando API Key: Mi API Key
📡 Llamando a verifyTogglConnection...
🔍 Iniciando verificación de conexión Toggl...
📡 Respuesta de Toggl API: 200 OK
✅ Usuario verificado: Tu Nombre
✅ Verificación exitosa, actualizando estado...
```

## 🔧 **Archivos Preparados**

### **Para Despliegue Manual** (si GitHub Actions falla)
- `dashboard-files-fixed.tar.gz` - Archivos corregidos listos para subir

### **Para Debugging**
- `DEBUG_TOGGL.md` - Instrucciones detalladas
- `test-toggl-api.js` - Función de prueba manual

### **Para Automatización**
- `.github/workflows/deploy.yml` - Despliegue automático
- `push-to-github.sh` - Script para subir código
- `setup-github-deploy.sh` - Configuración completa

## 🎯 **Resultado Esperado**

Después de completar todos los pasos:

✅ **Dashboard funcionando** en https://trespuntoscomunicacion.es/db-clientes/
✅ **Integración Toggl corregida** - ya no se queda en "verificando"
✅ **Despliegue automático** - cada push actualiza el servidor
✅ **Logging detallado** - errores específicos en consola
✅ **Manejo robusto de errores** - casos edge manejados

## 🔗 **Enlaces Útiles**

- **Repositorio**: https://github.com/trespuntoscomunicacion/dashboard-cliente
- **Actions**: https://github.com/trespuntoscomunicacion/dashboard-cliente/actions
- **Secrets**: https://github.com/trespuntoscomunicacion/dashboard-cliente/settings/secrets/actions
- **Dashboard**: https://trespuntoscomunicacion.es/db-clientes/

## ⚡ **Comando Rápido**

Si quieres hacerlo todo de una vez:
```bash
cd "/Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design"
./push-to-github.sh
```

---
**Estado**: ✅ Listo para subir a GitHub  
**Fecha**: $(date)  
**Próximo paso**: Crear repositorio en GitHub y ejecutar push-to-github.sh
