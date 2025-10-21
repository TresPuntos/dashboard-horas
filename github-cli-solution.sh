#!/bin/bash

echo "🔧 SOLUCIÓN CON GITHUB CLI"
echo "=========================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "📋 El problema es que los tokens no tienen los permisos correctos para la organización."
echo "Vamos a usar GitHub CLI como alternativa."
echo ""

# Verificar si GitHub CLI está instalado
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI está instalado"
    echo "🔐 Configurando autenticación..."
    
    # Configurar autenticación
    echo "📝 Ejecuta este comando para autenticarte:"
    echo "gh auth login --with-token"
    echo ""
    echo "🔑 Luego pega tu token cuando te lo pida"
    echo ""
    
    read -p "¿Quieres que configure la autenticación ahora? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔐 Configurando autenticación..."
        echo "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" | gh auth login --with-token
        
        if [ $? -eq 0 ]; then
            echo "✅ Autenticación exitosa"
            echo "📤 Haciendo push..."
            git push origin main
        else
            echo "❌ Error en la autenticación"
        fi
    fi
else
    echo "❌ GitHub CLI no está instalado"
    echo ""
    echo "📦 Instalando GitHub CLI..."
    if command -v brew &> /dev/null; then
        brew install gh
        echo "✅ GitHub CLI instalado"
        echo ""
        echo "🔐 Configurando autenticación..."
        echo "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" | gh auth login --with-token
        
        if [ $? -eq 0 ]; then
            echo "✅ Autenticación exitosa"
            echo "📤 Haciendo push..."
            git push origin main
        else
            echo "❌ Error en la autenticación"
        fi
    else
        echo "❌ Homebrew no está instalado"
        echo ""
        echo "📋 INSTALACIÓN MANUAL:"
        echo "1. Ve a: https://cli.github.com/"
        echo "2. Descarga GitHub CLI para macOS"
        echo "3. Instala el archivo .pkg"
        echo "4. Ejecuta: gh auth login --with-token"
        echo "5. Pega tu token"
        echo "6. Ejecuta: git push origin main"
    fi
fi

echo ""
echo "🎯 ALTERNATIVA: SUBIR ARCHIVOS INDIVIDUALES"
echo "==========================================="
echo ""
echo "Si GitHub CLI no funciona, puedes subir los archivos más importantes:"
echo ""
echo "📄 Archivos críticos para la integración de Toggl:"
echo "• src/lib/togglApi.ts"
echo "• src/pages/SettingsPage.tsx"
echo "• .github/workflows/deploy.yml"
echo "• package.json"
echo ""
echo "📋 Pasos:"
echo "1. Ve a: https://github.com/TresPuntos/dashboard-horas"
echo "2. Haz click en 'Upload files'"
echo "3. Sube estos archivos uno por uno"
echo "4. Haz commit de cada archivo"
echo ""

echo "✅ Script completado"
