#!/bin/bash

# Script para subir código después de crear el repositorio en GitHub
# Ejecutar después de crear el repositorio manualmente

echo "🚀 SUBIENDO CÓDIGO A GITHUB"
echo "============================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estás en el directorio del proyecto"
    exit 1
fi

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "✅ Directorio del proyecto correcto"
echo ""

# Configuración del repositorio
REPO_NAME="dashboard-cliente"
GITHUB_USER="trespuntoscomunicacion"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "📋 Configuración del repositorio:"
echo "• Nombre: $REPO_NAME"
echo "• Usuario/Org: $GITHUB_USER"
echo "• URL: $REPO_URL"
echo ""

# Configurar remote origin
echo "📡 Configurando remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "✅ Remote origin configurado"
echo ""

# Verificar estado actual
echo "📊 ESTADO ACTUAL:"
echo "• Commits: $(git log --oneline | wc -l | tr -d ' ') commits"
echo "• Rama: $(git branch --show-current)"
echo "• Archivos modificados: $(git status --porcelain | wc -l | tr -d ' ')"
echo ""

# Verificar conexión con GitHub
echo "🔍 Verificando conexión con GitHub..."
if git ls-remote origin >/dev/null 2>&1; then
    echo "✅ Conexión exitosa con GitHub"
else
    echo "❌ No se puede conectar con GitHub"
    echo ""
    echo "📋 VERIFICAR QUE EL REPOSITORIO EXISTE:"
    echo "1. Ve a: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "2. Asegúrate de que el repositorio existe"
    echo "3. Si no existe, créalo en: https://github.com/new"
    echo ""
    echo "📋 CONFIGURACIÓN DEL REPOSITORIO:"
    echo "• Nombre: $REPO_NAME"
    echo "• Descripción: Dashboard Cliente - Tres Puntos Comunicación"
    echo "• Visibilidad: Público"
    echo "• NO marques 'Add a README file'"
    exit 1
fi

# Subir código
echo "🚀 Subiendo código a GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Código subido exitosamente"
    echo ""
    echo "🎉 ¡REPOSITORIO CONFIGURADO!"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo ""
    echo "1. 🔐 CONFIGURAR SECRETS PARA DESPLIEGUE AUTOMÁTICO:"
    echo "   • Ve a: https://github.com/$GITHUB_USER/$REPO_NAME/settings/secrets/actions"
    echo "   • Haz clic en 'New repository secret'"
    echo "   • Añade estos secrets:"
    echo "     • SERVER_HOST = trespuntoscomunicacion.es"
    echo "     • SERVER_USER = cursor"
    echo "     • SERVER_PASSWORD = 5#!OWwzue465&OO(N5"
    echo "     • SERVER_PORT = 22"
    echo ""
    echo "2. ✅ VERIFICAR DESPLIEGUE AUTOMÁTICO:"
    echo "   • Ve a: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
    echo "   • El workflow se ejecutará automáticamente"
    echo "   • Verifica que el despliegue sea exitoso"
    echo ""
    echo "3. 🎯 VERIFICAR DASHBOARD:"
    echo "   • URL: https://trespuntoscomunicacion.es/db-clientes/"
    echo "   • Prueba la integración con Toggl API"
    echo ""
    echo "4. 🧪 PROBAR INTEGRACIÓN TOGGL:"
    echo "   • Abre la consola del navegador (F12)"
    echo "   • Ve a Settings > Integración Toggl"
    echo "   • Añade tu API Key real de Toggl"
    echo "   • Observa los logs detallados en consola"
    echo ""
    echo "🔗 ENLACES ÚTILES:"
    echo "• Repositorio: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "• Actions: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
    echo "• Dashboard: https://trespuntoscomunicacion.es/db-clientes/"
    echo "• Secrets: https://github.com/$GITHUB_USER/$REPO_NAME/settings/secrets/actions"
else
    echo "❌ Error subiendo código"
    echo ""
    echo "📋 SOLUCIONES POSIBLES:"
    echo "1. Verificar que el repositorio existe en GitHub"
    echo "2. Verificar permisos de acceso"
    echo "3. Intentar con SSH en lugar de HTTPS"
    echo ""
    echo "🔧 COMANDO ALTERNATIVO:"
    echo "git push -u origin main --force"
fi
