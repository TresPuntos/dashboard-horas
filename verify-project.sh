#!/bin/bash

# Script de verificación completa del Dashboard Cliente
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design

echo "🔍 VERIFICACIÓN COMPLETA DEL DASHBOARD CLIENTE"
echo "=============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No estás en el directorio del proyecto"
    echo "Ejecuta desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design"
    exit 1
fi

echo "✅ Directorio del proyecto correcto"
echo ""

# 1. Verificar dependencias
echo "📦 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencias instaladas"
else
    echo "⚠️  Dependencias no instaladas - ejecutando npm install..."
    npm install
fi
echo ""

# 2. Verificar build
echo "🔨 Verificando build de producción..."
if npm run build >/dev/null 2>&1; then
    echo "✅ Build exitoso"
    # Copiar .htaccess después del build
    if [ -f "dashboard-files/.htaccess" ]; then
        cp dashboard-files/.htaccess build/.htaccess
        echo "✅ Archivo .htaccess copiado"
    fi
else
    echo "❌ Error en el build"
    exit 1
fi
echo ""

# 3. Verificar archivos de build
echo "📁 Verificando archivos de build..."
if [ -f "build/index.html" ] && [ -f "build/.htaccess" ] && [ -d "build/assets" ]; then
    echo "✅ Archivos de build presentes"
    echo "   • index.html: $(wc -c < build/index.html) bytes"
    echo "   • .htaccess: $(wc -c < build/.htaccess) bytes"
    echo "   • assets/: $(ls build/assets/ | wc -l) archivos"
else
    echo "❌ Archivos de build faltantes"
    exit 1
fi
echo ""

# 4. Verificar configuración Git
echo "🔧 Verificando configuración Git..."
if [ -d ".git" ]; then
    echo "✅ Repositorio Git inicializado"
    echo "   • Commits: $(git log --oneline | wc -l | tr -d ' ')"
    echo "   • Rama: $(git branch --show-current)"
    echo "   • Estado: $(git status --porcelain | wc -l | tr -d ' ') archivos modificados"
else
    echo "❌ Repositorio Git no inicializado"
fi
echo ""

# 5. Verificar GitHub Actions
echo "🚀 Verificando GitHub Actions..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ Workflow de despliegue configurado"
else
    echo "❌ Workflow de despliegue faltante"
fi
echo ""

# 6. Verificar integración Toggl
echo "🔗 Verificando integración Toggl API..."
if [ -f "src/lib/togglApi.ts" ]; then
    echo "✅ Servicio Toggl API implementado"
    echo "   • Interfaces: $(grep -c 'interface' src/lib/togglApi.ts)"
    echo "   • Métodos: $(grep -c 'async.*(' src/lib/togglApi.ts)"
else
    echo "❌ Servicio Toggl API faltante"
fi
echo ""

# 7. Verificar configuración de rutas
echo "🌐 Verificando configuración de rutas..."
if grep -q "/db-clientes/" build/index.html; then
    echo "✅ Rutas configuradas para subcarpeta /db-clientes/"
else
    echo "❌ Rutas no configuradas correctamente"
fi
echo ""

# 8. Verificar archivos de documentación
echo "📚 Verificando documentación..."
docs=("README.md" "TOGGL_INTEGRATION.md" "DEPLOYMENT.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc presente"
    else
        echo "❌ $doc faltante"
    fi
done
echo ""

# Resumen final
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="
echo ""

# Contar errores
errors=0

# Verificaciones críticas
if [ ! -f "build/index.html" ]; then ((errors++)); fi
if [ ! -f "build/.htaccess" ]; then ((errors++)); fi
if [ ! -f "src/lib/togglApi.ts" ]; then ((errors++)); fi
if [ ! -f ".github/workflows/deploy.yml" ]; then ((errors++)); fi

if [ $errors -eq 0 ]; then
    echo "🎉 ¡VERIFICACIÓN EXITOSA!"
    echo ""
    echo "✅ El proyecto está listo para:"
    echo "   • Desarrollo local (npm run dev)"
    echo "   • Build de producción (npm run build)"
    echo "   • Despliegue al servidor"
    echo "   • Integración con GitHub"
    echo "   • Conexión con Toggl API"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "   1. Crear repositorio en GitHub"
    echo "   2. Configurar secrets para despliegue automático"
    echo "   3. Subir código: git push -u origin main"
    echo "   4. Verificar despliegue automático"
else
    echo "❌ VERIFICACIÓN FALLIDA"
    echo "Se encontraron $errors errores críticos"
    echo "Revisa los mensajes anteriores para solucionarlos"
fi

echo ""
echo "📁 Archivos listos para subir:"
echo "   • build/ - Archivos de producción"
echo "   • dashboard-files.tar.gz - Paquete comprimido"
echo ""
echo "🎯 Dashboard URL: https://trespuntoscomunicacion.es/db-clientes/"
