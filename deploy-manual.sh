#!/bin/bash

# Script para subir manualmente el dashboard al servidor
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/dashboard-cliente

echo "🚀 DESPLIEGUE MANUAL DEL DASHBOARD"
echo "=================================="
echo ""

# Configuración del servidor
SERVER_HOST="trespuntoscomunicacion.es"
SERVER_USER="cursor"
SERVER_PASSWORD="5#!OWwzue465&OO(N5"
SERVER_PORT="22"
REMOTE_PATH="/home/tres/db-clientes/"

echo "📋 Configuración del servidor:"
echo "• Host: $SERVER_HOST"
echo "• Usuario: $SERVER_USER"
echo "• Puerto: $SERVER_PORT"
echo "• Directorio: $REMOTE_PATH"
echo ""

# Verificar que el archivo existe
if [ ! -f "dashboard-manual-deploy.tar.gz" ]; then
    echo "❌ Error: No se encontró dashboard-manual-deploy.tar.gz"
    echo "Ejecuta primero: npm run build && tar -czf dashboard-manual-deploy.tar.gz -C build ."
    exit 1
fi

echo "✅ Archivo de despliegue encontrado: $(ls -lh dashboard-manual-deploy.tar.gz | awk '{print $5}')"
echo ""

# Intentar conexión con diferentes métodos
echo "🔍 Probando conexión al servidor..."

# Método 1: SCP directo
echo "📡 Intentando SCP directo..."
if scp -P $SERVER_PORT dashboard-manual-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/home/tres/ 2>/dev/null; then
    echo "✅ Archivo subido exitosamente"
    
    # Conectar y extraer
    echo "📦 Extrayendo archivos..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        cd /home/tres/
        if [ -d 'db-clientes-backup' ]; then
            rm -rf db-clientes-backup
        fi
        if [ -d 'db-clientes' ]; then
            mv db-clientes db-clientes-backup
        fi
        mkdir -p db-clientes
        cd db-clientes
        tar -xzf ../dashboard-manual-deploy.tar.gz
        chmod -R 755 .
        chmod 644 .htaccess
        rm ../dashboard-manual-deploy.tar.gz
        echo '✅ Dashboard desplegado exitosamente'
        ls -la
    "
    
    echo ""
    echo "🎉 ¡DESPLIEGUE COMPLETADO!"
    echo "🌐 Dashboard disponible en: https://trespuntoscomunicacion.es/db-clientes/"
    exit 0
fi

# Método 2: Usar rsync
echo "📡 Intentando rsync..."
if rsync -avz -e "ssh -p $SERVER_PORT" dashboard-manual-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/home/tres/ 2>/dev/null; then
    echo "✅ Archivo subido con rsync"
    # Continuar con extracción...
else
    echo "❌ Error: No se pudo conectar al servidor"
    echo ""
    echo "📋 INSTRUCCIONES MANUALES:"
    echo "1. Sube manualmente el archivo dashboard-manual-deploy.tar.gz al servidor"
    echo "2. Conecta por SSH al servidor"
    echo "3. Ejecuta estos comandos:"
    echo ""
    echo "   cd /home/tres/"
    echo "   if [ -d 'db-clientes-backup' ]; then rm -rf db-clientes-backup; fi"
    echo "   if [ -d 'db-clientes' ]; then mv db-clientes db-clientes-backup; fi"
    echo "   mkdir -p db-clientes"
    echo "   cd db-clientes"
    echo "   tar -xzf ../dashboard-manual-deploy.tar.gz"
    echo "   chmod -R 755 ."
    echo "   chmod 644 .htaccess"
    echo "   rm ../dashboard-manual-deploy.tar.gz"
    echo ""
    echo "4. Verifica en: https://trespuntoscomunicacion.es/db-clientes/"
fi
