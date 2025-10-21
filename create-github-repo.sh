#!/bin/bash

# Script para crear repositorio en GitHub automáticamente
# Requiere token de GitHub con permisos de repositorio

echo "🚀 CREANDO REPOSITORIO EN GITHUB"
echo "================================"
echo ""

# Configuración del repositorio
REPO_NAME="dashboard-cliente"
GITHUB_USER="trespuntoscomunicacion"
DESCRIPTION="Dashboard Cliente - Tres Puntos Comunicación"

echo "📋 Configuración:"
echo "• Nombre: $REPO_NAME"
echo "• Usuario/Org: $GITHUB_USER"
echo "• Descripción: $DESCRIPTION"
echo ""

# Verificar si tenemos token de GitHub
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  No se encontró GITHUB_TOKEN"
    echo ""
    echo "📋 CREAR REPOSITORIO MANUALMENTE:"
    echo "1. Ve a: https://github.com/new"
    echo "2. Nombre: $REPO_NAME"
    echo "3. Descripción: $DESCRIPTION"
    echo "4. Visibilidad: Público"
    echo "5. NO marques 'Add a README file'"
    echo "6. Haz clic en 'Create repository'"
    echo ""
    echo "Después ejecuta: git push -u origin main"
    exit 0
fi

echo "🔑 Token de GitHub encontrado"
echo ""

# Crear repositorio usando GitHub API
echo "📡 Creando repositorio en GitHub..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$DESCRIPTION\",
    \"private\": false,
    \"auto_init\": false
  }")

# Verificar si se creó correctamente
if echo "$RESPONSE" | grep -q '"name": "'$REPO_NAME'"'; then
    echo "✅ Repositorio creado exitosamente"
    echo "🔗 URL: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    
    # Configurar remote y subir código
    echo "📡 Configurando remote origin..."
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    echo "🚀 Subiendo código..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Código subido exitosamente"
        echo ""
        echo "🔐 CONFIGURAR SECRETS PARA DESPLIEGUE:"
        echo "• Ve a: https://github.com/$GITHUB_USER/$REPO_NAME/settings/secrets/actions"
        echo "• Añade estos secrets:"
        echo "  • SERVER_HOST = trespuntoscomunicacion.es"
        echo "  • SERVER_USER = cursor"
        echo "  • SERVER_PASSWORD = 5#!OWwzue465&OO(N5"
        echo "  • SERVER_PORT = 22"
        echo ""
        echo "✅ VERIFICAR DESPLIEGUE:"
        echo "• Actions: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
        echo "• Dashboard: https://trespuntoscomunicacion.es/db-clientes/"
    else
        echo "❌ Error subiendo código"
        exit 1
    fi
else
    echo "❌ Error creando repositorio"
    echo "Respuesta: $RESPONSE"
    echo ""
    echo "📋 CREAR MANUALMENTE:"
    echo "1. Ve a: https://github.com/new"
    echo "2. Nombre: $REPO_NAME"
    echo "3. Descripción: $DESCRIPTION"
    echo "4. Visibilidad: Público"
    echo "5. NO marques 'Add a README file'"
    echo "6. Haz clic en 'Create repository'"
    echo ""
    echo "Después ejecuta: git push -u origin main"
fi
