#!/bin/bash

# Script para configurar el repositorio con tu usuario personal de GitHub
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/dashboard-cliente

echo "🔧 CONFIGURANDO REPOSITORIO CON TU USUARIO PERSONAL"
echo "=================================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estás en el directorio correcto"
    echo "Ejecuta desde: /Users/jordi/Documents/GitHub/Dashboard-v3/dashboard-cliente"
    exit 1
fi

echo "✅ Directorio correcto: dashboard-cliente"
echo ""

# Solicitar el nombre de usuario de GitHub
echo "📋 CONFIGURACIÓN DEL REPOSITORIO:"
echo ""
read -p "¿Cuál es tu nombre de usuario de GitHub? " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: Debes proporcionar tu nombre de usuario de GitHub"
    exit 1
fi

# Configurar el nuevo remote
REPO_NAME="dashboard-cliente"
NEW_REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📡 Configurando nuevo remote..."
echo "• Usuario: $GITHUB_USERNAME"
echo "• Repositorio: $REPO_NAME"
echo "• URL: $NEW_REPO_URL"
echo ""

# Remover el remote actual y configurar el nuevo
git remote remove origin 2>/dev/null || true
git remote add origin "$NEW_REPO_URL"

echo "✅ Remote configurado: $NEW_REPO_URL"
echo ""

# Verificar estado actual
echo "📊 ESTADO ACTUAL:"
echo "• Commits: $(git log --oneline | wc -l | tr -d ' ') commits"
echo "• Rama: $(git branch --show-current)"
echo "• Archivos modificados: $(git status --porcelain | wc -l | tr -d ' ')"
echo ""

echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 🆕 CREAR REPOSITORIO EN GITHUB:"
echo "   • Ve a: https://github.com/new"
echo "   • Nombre: $REPO_NAME"
echo "   • Descripción: Dashboard Cliente - Tres Puntos Comunicación"
echo "   • Visibilidad: Public"
echo "   • NO marques 'Add a README file'"
echo "   • Haz clic en 'Create repository'"
echo ""
echo "2. 🚀 SUBIR CÓDIGO:"
echo "   • Ejecuta: git push -u origin main"
echo "   • O usa GitHub Desktop para publicar"
echo ""
echo "3. 🔐 CONFIGURAR SECRETS PARA DESPLIEGUE:"
echo "   • Ve a: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
echo "   • Añade estos secrets:"
echo "     • SERVER_HOST = trespuntoscomunicacion.es"
echo "     • SERVER_USER = cursor"
echo "     • SERVER_PASSWORD = 5#!OWwzue465&OO(N5"
echo "     • SERVER_PORT = 22"
echo ""
echo "4. ✅ VERIFICAR DESPLIEGUE AUTOMÁTICO:"
echo "   • Ve a: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo "   • El workflow se ejecutará automáticamente"
echo ""
echo "5. 🎯 PROBAR DASHBOARD:"
echo "   • URL: https://trespuntoscomunicacion.es/db-clientes/"
echo "   • Prueba la integración con Toggl API"
echo ""

echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo ""
echo "📁 Archivos listos para subir:"
echo "• ✅ Código fuente completo con correcciones de Toggl API"
echo "• ✅ GitHub Actions para despliegue automático"
echo "• ✅ Documentación completa"
echo "• ✅ Build files de producción"
echo ""

echo "🔗 Enlaces útiles:"
echo "• Crear repositorio: https://github.com/new"
echo "• Tu repositorio: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "• Secrets: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
echo "• Actions: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo "• Dashboard: https://trespuntoscomunicacion.es/db-clientes/"
