#!/bin/bash

echo "🚀 SCRIPT PARA SUBIR A GITHUB"
echo "=============================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

echo "📋 Pasos para completar la subida:"
echo ""
echo "1. 🔑 Obtén tu Personal Access Token de GitHub:"
echo "   • Ve a: https://github.com/settings/tokens"
echo "   • Click en 'Generate new token (classic)'"
echo "   • Marca 'repo' y 'workflow'"
echo "   • Copia el token generado"
echo ""
echo "2. 🔧 Configura Git con tu token:"
echo "   • Usuario: TresPuntos"
echo "   • Contraseña: [tu_token_de_github]"
echo ""

# Intentar push
echo "3. 📤 Intentando subir archivos..."
echo ""

# Configurar credenciales temporalmente
read -p "¿Quieres configurar las credenciales ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Configurando credenciales..."
    echo "Usuario: TresPuntos"
    read -s -p "Token de GitHub: " GITHUB_TOKEN
    echo
    
    # Crear archivo de credenciales temporal
    echo "https://TresPuntos:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
    
    echo "✅ Credenciales configuradas"
    echo "📤 Subiendo archivos..."
    
    if git push origin main; then
        echo ""
        echo "🎉 ¡ÉXITO! Archivos subidos a GitHub"
        echo "🚀 GitHub Actions debería ejecutarse automáticamente"
        echo "🌐 Dashboard se desplegará en: https://trespuntoscomunicacion.es/db-clientes/"
        echo ""
        echo "📋 Para verificar el deployment:"
        echo "• Ve a: https://github.com/TresPuntos/dashboard-horas/actions"
        echo "• Verifica que el workflow se ejecute correctamente"
        echo "• Si hay errores, revisa los logs del workflow"
    else
        echo "❌ Error al subir archivos"
        echo "🔧 Verifica tu token de GitHub y permisos"
    fi
    
    # Limpiar credenciales
    rm ~/.git-credentials
    echo "🧹 Credenciales limpiadas"
else
    echo "📋 INSTRUCCIONES MANUALES:"
    echo ""
    echo "1. Ejecuta: git config --global credential.helper store"
    echo "2. Ejecuta: git push origin main"
    echo "3. Cuando te pida credenciales:"
    echo "   • Usuario: TresPuntos"
    echo "   • Contraseña: [tu_personal_access_token]"
    echo ""
    echo "4. Ve a GitHub Actions para verificar el deployment:"
    echo "   https://github.com/TresPuntos/dashboard-horas/actions"
fi

echo ""
echo "✅ Script completado"
