// Función de prueba para verificar Toggl API
// Ejecutar en la consola del navegador para probar

async function testTogglAPI(apiKey) {
  console.log('🧪 Probando Toggl API con key:', apiKey.substring(0, 10) + '...');
  
  try {
    const response = await fetch('https://api.track.toggl.com/api/v9/me', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':api_token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Respuesta HTTP:', response.status, response.statusText);
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Usuario verificado:', user.fullname, user.email);
      return { success: true, user };
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.log('💥 Error de conexión:', error);
    return { success: false, error: error.message };
  }
}

// Uso: testTogglAPI('tu_api_key_aqui')
console.log('🔧 Función de prueba cargada. Usa: testTogglAPI("tu_api_key")');
