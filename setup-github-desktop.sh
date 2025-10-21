#!/bin/bash

# Script para configurar el repositorio con GitHub Desktop
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design

echo "🚀 CONFIGURACIÓN PARA GITHUB DESKTOP"
echo "===================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estás en el directorio del proyecto"
    exit 1
fi

echo "✅ Directorio del proyecto correcto"
echo ""

# Verificar estado de Git
echo "📊 ESTADO ACTUAL DEL REPOSITORIO:"
echo "• Commits: $(git log --oneline | wc -l | tr -d ' ') commits"
echo "• Rama: $(git branch --show-current)"
echo "• Archivos modificados: $(git status --porcelain | wc -l | tr -d ' ')"
echo "• Remote origin: $(git remote get-url origin 2>/dev/null || echo 'No configurado')"
echo ""

# Verificar que tenemos commits
if ! git log --oneline -1 >/dev/null 2>&1; then
    echo "❌ Error: No hay commits en el repositorio"
    echo "Ejecuta: git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Repositorio Git configurado correctamente"
echo ""

# Crear archivo de instrucciones para GitHub Desktop
cat > GITHUB_DESKTOP_INSTRUCTIONS.md << 'EOF'
# 📱 Instrucciones para GitHub Desktop

## ✅ **Estado Actual**
- ✅ Repositorio Git configurado localmente
- ✅ 4 commits con todas las correcciones
- ✅ GitHub Actions configurado para despliegue automático
- ✅ Archivos corregidos listos para subir

## 🚀 **Pasos para Subir con GitHub Desktop**

### **Paso 1: Crear Repositorio en GitHub**

1. **Abre GitHub Desktop**
2. **Haz clic en**: "Publish repository" (botón azul)
3. **Configuración**:
   - **Name**: `dashboard-cliente`
   - **Description**: `Dashboard Cliente - Tres Puntos Comunicación`
   - **Visibility**: Public
   - **⚠️ IMPORTANTE**: NO marques "Keep this code private"
4. **Haz clic en**: "Publish repository"

### **Paso 2: Verificar que se Subió Correctamente**

1. **Ve a**: https://github.com/tu-usuario/dashboard-cliente
2. **Verifica que aparecen los 4 commits**:
   - Initial commit: Dashboard Cliente con integración Toggl API
   - Add GitHub integration and deployment automation
   - Fix Toggl API verification issues
   - Add GitHub deployment automation and setup scripts

### **Paso 3: Configurar Secrets para Despliegue Automático**

1. **Ve a**: https://github.com/tu-usuario/dashboard-cliente/settings/secrets/actions
2. **Haz clic en**: "New repository secret"
3. **Añade estos secrets**:
   - `SERVER_HOST` = `trespuntoscomunicacion.es`
   - `SERVER_USER` = `cursor`
   - `SERVER_PASSWORD` = `5#!OWwzue465&OO(N5`
   - `SERVER_PORT` = `22`

### **Paso 4: Verificar Despliegue Automático**

1. **Ve a**: https://github.com/tu-usuario/dashboard-cliente/actions
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
6. **Observa los logs detallados** en consola

## 🔧 **Archivos Incluidos**

- ✅ **Código fuente completo** con correcciones de Toggl API
- ✅ **GitHub Actions** para despliegue automático
- ✅ **Documentación** completa de debugging
- ✅ **Scripts de automatización**
- ✅ **Build files** listos para producción

## 🎯 **Resultado Esperado**

Después de completar todos los pasos:

✅ **Dashboard funcionando** en https://trespuntoscomunicacion.es/db-clientes/
✅ **Integración Toggl corregida** - ya no se queda en "verificando"
✅ **Despliegue automático** - cada push actualiza el servidor
✅ **Logging detallado** - errores específicos en consola

## 🔗 **Enlaces Útiles**

- **Repositorio**: https://github.com/tu-usuario/dashboard-cliente
- **Actions**: https://github.com/tu-usuario/dashboard-cliente/actions
- **Secrets**: https://github.com/tu-usuario/dashboard-cliente/settings/secrets/actions
- **Dashboard**: https://trespuntoscomunicacion.es/db-clientes/

---
**Estado**: ✅ Listo para publicar con GitHub Desktop  
**Fecha**: $(date)
EOF

echo "📋 INSTRUCCIONES CREADAS"
echo "========================"
echo ""
echo "✅ Archivo creado: GITHUB_DESKTOP_INSTRUCTIONS.md"
echo ""
echo "📱 PRÓXIMOS PASOS CON GITHUB DESKTOP:"
echo ""
echo "1. 🚀 PUBLICAR REPOSITORIO:"
echo "   • Abre GitHub Desktop"
echo "   • Haz clic en 'Publish repository' (botón azul)"
echo "   • Nombre: dashboard-cliente"
echo "   • Descripción: Dashboard Cliente - Tres Puntos Comunicación"
echo "   • Visibilidad: Public"
echo "   • Haz clic en 'Publish repository'"
echo ""
echo "2. 🔐 CONFIGURAR SECRETS:"
echo "   • Ve a: https://github.com/tu-usuario/dashboard-cliente/settings/secrets/actions"
echo "   • Añade los secrets del servidor"
echo ""
echo "3. ✅ VERIFICAR DESPLIEGUE:"
echo "   • Ve a: https://github.com/tu-usuario/dashboard-cliente/actions"
echo "   • El workflow se ejecutará automáticamente"
echo ""
echo "4. 🎯 PROBAR DASHBOARD:"
echo "   • URL: https://trespuntoscomunicacion.es/db-clientes/"
echo "   • Prueba la integración con Toggl API"
echo ""

echo "📁 ARCHIVOS LISTOS PARA SUBIR:"
echo "• Código fuente completo con correcciones"
echo "• GitHub Actions para despliegue automático"
echo "• Documentación de debugging"
echo "• Build files de producción"
echo ""

echo "🎉 ¡LISTO PARA PUBLICAR CON GITHUB DESKTOP!"
echo ""
echo "📖 Lee el archivo GITHUB_DESKTOP_INSTRUCTIONS.md para más detalles"
