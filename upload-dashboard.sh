#!/bin/bash

# Script para subir archivos del dashboard al servidor
# Ejecutar desde: /Users/jordi/Documents/GitHub/Dashboard-v3/Cliente Dashboard Design

echo "🚀 Iniciando subida de archivos del dashboard..."

# Verificar que estamos en el directorio correcto
if [ ! -f "dashboard-files.tar.gz" ]; then
    echo "❌ Error: No se encontró dashboard-files.tar.gz"
    echo "Asegúrate de estar en el directorio correcto"
    exit 1
fi

echo "📦 Archivo encontrado: dashboard-files.tar.gz"

# Método 1: Intentar SCP con diferentes puertos
echo "🔍 Intentando conexión SCP..."

for port in 22 2222 2022 2200; do
    echo "Probando puerto $port..."
    if scp -P $port -o ConnectTimeout=10 dashboard-files.tar.gz cursor@trespuntoscomunicacion.es:/home/tres/db-clientes/ 2>/dev/null; then
        echo "✅ Archivo subido exitosamente por SCP (puerto $port)"
        echo "🔧 Extrayendo archivos en el servidor..."
        ssh -p $port cursor@trespuntoscomunicacion.es "cd /home/tres/db-clientes && tar -xzf dashboard-files.tar.gz && rm dashboard-files.tar.gz"
        echo "✅ Archivos extraídos y dashboard actualizado"
        exit 0
    fi
done

# Método 2: Intentar SFTP
echo "🔍 Intentando conexión SFTP..."
for port in 22 2222 2022 2200; do
    echo "Probando SFTP puerto $port..."
    if sftp -P $port -o ConnectTimeout=10 cursor@trespuntoscomunicacion.es <<< "put dashboard-files.tar.gz /home/tres/db-clientes/" 2>/dev/null; then
        echo "✅ Archivo subido exitosamente por SFTP (puerto $port)"
        echo "🔧 Extrayendo archivos..."
        ssh -p $port cursor@trespuntoscomunicacion.es "cd /home/tres/db-clientes && tar -xzf dashboard-files.tar.gz && rm dashboard-files.tar.gz"
        echo "✅ Dashboard actualizado"
        exit 0
    fi
done

# Método 3: Instrucciones manuales
echo "⚠️  No se pudo conectar automáticamente"
echo ""
echo "📋 INSTRUCCIONES MANUALES:"
echo "1. Accede al panel de control de tu hosting"
echo "2. Ve al administrador de archivos"
echo "3. Navega a la carpeta /home/tres/db-clientes/"
echo "4. Sube el archivo: $(pwd)/dashboard-files.tar.gz"
echo "5. Extrae el contenido del archivo"
echo "6. Elimina el archivo .tar.gz"
echo ""
echo "📁 Archivo a subir: $(pwd)/dashboard-files.tar.gz"
echo "🎯 Destino: /home/tres/db-clientes/"
echo ""
echo "✅ Una vez subido, el dashboard estará actualizado con la integración de Toggl"
