#!/bin/bash

echo "🚀 SCRIPT AUTOMÁTICO PARA PUSH CON TOKEN"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "📋 Este script te ayudará a hacer push con tu token de GitHub"
echo ""

# Pedir el token
read -s -p "🔑 Introduce tu nuevo token de GitHub: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: No se introdujo ningún token"
    exit 1
fi

echo "✅ Token recibido"
echo ""

# Configurar Git
echo "🔧 Configurando Git..."
git config --global credential.helper store

# Crear archivo de credenciales
echo "🔐 Configurando credenciales..."
echo "https://TresPuntos:${GITHUB_TOKEN}@github.com" > ~/.git-credentials

# Verificar estado
echo "📊 Estado actual:"
git status
echo ""

# Hacer push
echo "📤 Subiendo archivos a GitHub..."
if git push origin main; then
    echo ""
    echo "🎉 ¡ÉXITO! Archivos subidos a GitHub"
    echo "🚀 GitHub Actions debería ejecutarse automáticamente"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Ve a: https://github.com/TresPuntos/dashboard-horas/actions"
    echo "2. Verifica que el workflow se ejecute correctamente"
    echo "3. Ve a: https://trespuntoscomunicacion.es/db-clientes/"
    echo "4. Verifica que el dashboard funcione con la integración de Toggl"
    echo ""
    echo "✅ Deployment completado"
else
    echo ""
    echo "❌ Error al subir archivos"
    echo "🔧 Posibles causas:"
    echo "• Token sin permisos suficientes"
    echo "• Problema de conectividad"
    echo "• Repositorio no accesible"
    echo ""
    echo "📋 Verifica que tu token tenga estos permisos:"
    echo "• repo (Full control of private repositories)"
    echo "• workflow (Update GitHub Action workflows)"
    echo "• write:packages (Write packages)"
fi

# Limpiar credenciales
echo ""
echo "🧹 Limpiando credenciales temporales..."
rm ~/.git-credentials
echo "✅ Credenciales limpiadas"
