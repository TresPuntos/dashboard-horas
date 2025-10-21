#!/bin/bash

# Script para configurar y subir el proyecto a GitHub
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design

echo "🚀 CONFIGURANDO REPOSITORIO GITHUB"
echo "=================================="
echo ""

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

# Verificar que hay commits
if ! git log --oneline -1 >/dev/null 2>&1; then
    echo "❌ Error: No hay commits en el repositorio"
    exit 1
fi

echo "✅ Repositorio Git configurado correctamente"
echo ""

# Configurar información del repositorio
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

echo "✅ Remote origin configurado: $REPO_URL"
echo ""

# Verificar estado actual
echo "📊 ESTADO ACTUAL:"
echo "• Commits: $(git log --oneline | wc -l | tr -d ' ') commits"
echo "• Rama: $(git branch --show-current)"
echo "• Archivos modificados: $(git status --porcelain | wc -l | tr -d ' ')"
echo ""

# Mostrar instrucciones para crear el repositorio
echo "📋 INSTRUCCIONES PARA COMPLETAR LA CONFIGURACIÓN:"
echo ""
echo "1. 🆕 CREAR REPOSITORIO EN GITHUB:"
echo "   • Ve a: https://github.com/new"
echo "   • Nombre: $REPO_NAME"
echo "   • Descripción: Dashboard Cliente - Tres Puntos Comunicación"
echo "   • Visibilidad: Público"
echo "   • NO marques 'Add a README file'"
echo "   • Haz clic en 'Create repository'"
echo ""
echo "2. 🔐 CONFIGURAR SECRETS PARA DESPLIEGUE AUTOMÁTICO:"
echo "   • Ve a: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/secrets/actions"
echo "   • Haz clic en 'New repository secret'"
echo "   • Añade estos secrets:"
echo "     • SERVER_HOST = trespuntoscomunicacion.es"
echo "     • SERVER_USER = cursor"
echo "     • SERVER_PASSWORD = 5#!OWwzue465&OO(N5"
echo "     • SERVER_PORT = 22"
echo ""
echo "3. 🚀 SUBIR CÓDIGO:"
echo "   git push -u origin main"
echo ""
echo "4. ✅ VERIFICAR DESPLIEGUE AUTOMÁTICO:"
echo "   • Ve a: https://github.com/${GITHUB_USER}/${REPO_NAME}/actions"
echo "   • El workflow se ejecutará automáticamente"
echo "   • Verifica que el despliegue sea exitoso"
echo ""
echo "5. 🎯 VERIFICAR DASHBOARD:"
echo "   • URL: https://trespuntoscomunicacion.es/db-clientes/"
echo "   • Prueba la integración con Toggl API"
echo ""

echo "🎉 ¡CONFIGURACIÓN LISTA!"
echo ""
echo "📁 Archivos preparados:"
echo "• dashboard-files-fixed.tar.gz - Archivos corregidos"
echo "• DEBUG_TOGGL.md - Instrucciones de debugging"
echo "• .github/workflows/deploy.yml - Despliegue automático"
echo ""

echo "⏳ Esperando a que crees el repositorio en GitHub..."
echo "Una vez creado, ejecuta: git push -u origin main"
