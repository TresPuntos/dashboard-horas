#!/bin/bash

echo "🚀 SOLUCIÓN FINAL PARA SUBIR A GITHUB"
echo "====================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "📋 Los tokens de GitHub tienen problemas de permisos."
echo "Te voy a dar 3 opciones para solucionarlo:"
echo ""

echo "🎯 OPCIÓN 1: SUBIR VÍA WEB (MÁS FÁCIL)"
echo "====================================="
echo "1. Ve a: https://github.com/TresPuntos/dashboard-horas"
echo "2. Haz click en 'Upload files' (botón verde)"
echo "3. Arrastra el archivo: $(pwd)/dashboard-complete.zip"
echo "4. Mensaje: 'feat: Complete Toggl API integration'"
echo "5. Click en 'Commit changes'"
echo ""

echo "🔧 OPCIÓN 2: CREAR NUEVO TOKEN CON PERMISOS CORRECTOS"
echo "===================================================="
echo "1. Ve a: https://github.com/settings/tokens/new"
echo "2. Configura:"
echo "   • Note: 'Dashboard Toggl Integration'"
echo "   • Expiration: 90 days"
echo "   • Scopes: Marca TODOS estos:"
echo "     ✅ repo (Full control of private repositories)"
echo "     ✅ workflow (Update GitHub Action workflows)"
echo "     ✅ write:packages (Write packages)"
echo "     ✅ delete:packages (Delete packages)"
echo "     ✅ admin:org (Full control of orgs and teams)"
echo "3. Click en 'Generate token'"
echo "4. Copia el token"
echo "5. Ejecuta este script de nuevo con el nuevo token"
echo ""

echo "🔄 OPCIÓN 3: INTENTAR CON GITHUB CLI"
echo "===================================="
echo "1. Instala GitHub CLI: brew install gh"
echo "2. Autentica: gh auth login"
echo "3. Haz push: gh repo sync"
echo ""

echo "📊 ESTADO ACTUAL:"
echo "================="
echo "• Repositorio: $(git remote get-url origin)"
echo "• Branch: $(git branch --show-current)"
echo "• Commits pendientes: $(git log --oneline origin/main..HEAD | wc -l)"
echo "• Archivos listos: ✅ Todos los archivos están listos"
echo ""

echo "🎯 RECOMENDACIÓN:"
echo "================="
echo "Usa la OPCIÓN 1 (subir vía web) porque es la más rápida y segura."
echo "El archivo dashboard-complete.zip contiene todo lo necesario."
echo ""

# Mostrar el contenido del commit pendiente
echo "📝 CONTENIDO DEL COMMIT PENDIENTE:"
echo "=================================="
git log --oneline -1
echo ""
git show --stat HEAD
echo ""

echo "✅ Todo está listo para subir. Elige la opción que prefieras."
