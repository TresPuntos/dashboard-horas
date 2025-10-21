#!/bin/bash

echo "🌐 MÉTODO ALTERNATIVO: SUBIR VÍA WEB"
echo "===================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "📋 El token de GitHub tiene problemas de permisos."
echo "Te voy a mostrar cómo subir los archivos usando GitHub Web:"
echo ""

# Crear un archivo ZIP con todos los archivos
echo "📦 Creando archivo ZIP con todos los archivos..."
zip -r dashboard-complete.zip . -x "*.git*" "node_modules/*" "*.tar.gz" "*.DS_Store"
echo "✅ Archivo ZIP creado: dashboard-complete.zip"
echo ""

echo "🌐 PASOS PARA SUBIR VÍA WEB:"
echo ""
echo "1. 📁 Ve a tu repositorio en GitHub:"
echo "   https://github.com/TresPuntos/dashboard-horas"
echo ""
echo "2. 📤 Haz click en 'Upload files' (botón verde)"
echo ""
echo "3. 📎 Arrastra y suelta el archivo:"
echo "   $(pwd)/dashboard-complete.zip"
echo ""
echo "4. ✏️ Escribe un mensaje de commit:"
echo "   'feat: Complete Toggl API integration - Upload via web'"
echo ""
echo "5. ✅ Haz click en 'Commit changes'"
echo ""

echo "🎯 ALTERNATIVA: SUBIR ARCHIVOS INDIVIDUALES"
echo ""
echo "Si prefieres subir archivos individuales, estos son los más importantes:"
echo ""
echo "📄 Archivos principales a subir:"
echo "• src/lib/togglApi.ts (Integración de Toggl API)"
echo "• src/pages/SettingsPage.tsx (Configuración de Toggl)"
echo "• .github/workflows/deploy.yml (Deployment automático)"
echo "• package.json (Dependencias)"
echo "• build/ (Archivos compilados)"
echo ""

echo "🔧 PARA ARREGLAR EL TOKEN:"
echo ""
echo "1. Ve a: https://github.com/settings/tokens"
echo "2. Busca tu token actual"
echo "3. Haz click en 'Edit'"
echo "4. Asegúrate de que tenga estos permisos marcados:"
echo "   ✅ repo (Full control of private repositories)"
echo "   ✅ workflow (Update GitHub Action workflows)"
echo "   ✅ write:packages (Write packages)"
echo "5. Guarda los cambios"
echo ""

echo "📋 DESPUÉS DE SUBIR:"
echo ""
echo "1. Ve a: https://github.com/TresPuntos/dashboard-horas/actions"
echo "2. Verifica que el workflow se ejecute"
echo "3. Ve a: https://trespuntoscomunicacion.es/db-clientes/"
echo "4. Verifica que el dashboard funcione"
echo ""

echo "✅ Script completado"
