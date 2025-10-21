#!/bin/bash

# Script para conectar el proyecto con GitHub
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design

echo "🚀 Configurando conexión con GitHub..."

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    echo "Ejecuta 'git init' primero"
    exit 1
fi

# Verificar que hay commits
if ! git log --oneline -1 >/dev/null 2>&1; then
    echo "❌ Error: No hay commits en el repositorio"
    echo "Ejecuta 'git add .' y 'git commit -m \"Initial commit\"' primero"
    exit 1
fi

echo "✅ Repositorio Git configurado correctamente"

# Solicitar información del repositorio GitHub
echo ""
echo "📋 Información del repositorio GitHub:"
echo ""

read -p "Nombre del repositorio (ej: dashboard-cliente): " REPO_NAME
read -p "Usuario/organización de GitHub (ej: trespuntoscomunicacion): " GITHUB_USER
read -p "¿Es un repositorio privado? (y/n): " IS_PRIVATE

# Construir URL del repositorio
if [ "$IS_PRIVATE" = "y" ] || [ "$IS_PRIVATE" = "Y" ]; then
    REPO_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
    echo "🔒 Repositorio privado configurado"
else
    REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    echo "🌐 Repositorio público configurado"
fi

echo ""
echo "🔗 URL del repositorio: $REPO_URL"
echo ""

# Añadir remote origin
echo "📡 Configurando remote origin..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Verificar conexión
echo "🔍 Verificando conexión..."
if git ls-remote origin >/dev/null 2>&1; then
    echo "✅ Conexión exitosa con GitHub"
else
    echo "⚠️  No se pudo verificar la conexión"
    echo "Esto puede ser normal si el repositorio no existe aún"
fi

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 🆕 Crea el repositorio en GitHub:"
echo "   - Ve a https://github.com/new"
echo "   - Nombre: $REPO_NAME"
echo "   - Descripción: Dashboard Cliente - Tres Puntos Comunicación"
echo "   - Visibilidad: $([ "$IS_PRIVATE" = "y" ] && echo "Privado" || echo "Público")"
echo "   - NO inicialices con README (ya tenemos uno)"
echo ""
echo "2. 🔐 Configura los secrets para despliegue automático:"
echo "   - Ve a Settings > Secrets and variables > Actions"
echo "   - Añade estos secrets:"
echo "     • SERVER_HOST = trespuntoscomunicacion.es"
echo "     • SERVER_USER = cursor"
echo "     • SERVER_PASSWORD = 5#!OWwzue465&OO(N5"
echo "     • SERVER_PORT = 22"
echo ""
echo "3. 🚀 Sube el código:"
echo "   git push -u origin main"
echo ""
echo "4. ✅ Verifica el despliegue automático en:"
echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}/actions"
echo ""

# Mostrar estado actual
echo "📊 ESTADO ACTUAL:"
echo "• Repositorio local: ✅ Configurado"
echo "• Remote origin: ✅ $REPO_URL"
echo "• Commits: $(git log --oneline | wc -l | tr -d ' ') commits"
echo "• Rama actual: $(git branch --show-current)"
echo ""

echo "🎯 ¡Listo para conectar con GitHub!"
