#!/bin/bash

echo "🔍 VERIFICACIÓN DE DEPLOYMENT A GITHUB"
echo "======================================"
echo ""

# Verificar estado del repositorio
echo "📋 Estado del repositorio:"
git status
echo ""

# Verificar remoto
echo "🌐 Configuración del remoto:"
git remote -v
echo ""

# Verificar última confirmación
echo "📝 Última confirmación:"
git log --oneline -1
echo ""

# Verificar archivos de deployment
echo "📦 Archivos de deployment disponibles:"
ls -la *.tar.gz 2>/dev/null || echo "No hay archivos .tar.gz"
echo ""

# Verificar GitHub Actions
echo "⚙️  Configuración de GitHub Actions:"
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ Workflow de deployment encontrado"
    echo "📄 Contenido del workflow:"
    head -20 .github/workflows/deploy.yml
else
    echo "❌ No se encontró workflow de deployment"
fi
echo ""

# Verificar secrets necesarios
echo "🔐 Secrets necesarios para GitHub Actions:"
echo "• SERVER_HOST=trespuntoscomunicacion.es"
echo "• SERVER_USER=cursor"
echo "• SERVER_PASSWORD=5#!OWwzue465&OO(N5"
echo "• SERVER_PORT=22"
echo ""
echo "📋 Para configurar los secrets:"
echo "1. Ve a: https://github.com/TresPuntos/dashboard-horas/settings/secrets/actions"
echo "2. Click en 'New repository secret'"
echo "3. Añade cada variable con su valor correspondiente"
echo ""

# Verificar integración de Toggl
echo "🔌 Integración de Toggl:"
if [ -f "src/lib/togglApi.ts" ]; then
    echo "✅ Servicio de Toggl API encontrado"
    echo "📄 Funciones disponibles:"
    grep -n "async.*(" src/lib/togglApi.ts | head -5
else
    echo "❌ No se encontró servicio de Toggl API"
fi
echo ""

# Verificar build
echo "🏗️  Estado del build:"
if [ -d "build" ]; then
    echo "✅ Directorio build encontrado"
    echo "📁 Archivos en build:"
    ls -la build/
else
    echo "❌ Directorio build no encontrado"
    echo "🔧 Ejecuta: npm run build"
fi
echo ""

echo "🎯 PRÓXIMOS PASOS:"
echo "1. Ejecuta: ./push-to-github-manual.sh"
echo "2. Configura tu Personal Access Token de GitHub"
echo "3. Haz push de los archivos"
echo "4. Ve a GitHub Actions para verificar el deployment"
echo "5. Verifica el dashboard en: https://trespuntoscomunicacion.es/db-clientes/"
echo ""
echo "✅ Verificación completada"
