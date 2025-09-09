// Script de prueba para verificar el login
// Ejecutar con: node test-login.js

const axios = require('axios');

const testLogin = async () => {
  console.log('🧪 Probando el sistema de login...\n');
  
  const credentials = [
    {
      email: 'maria.rodriguez@constructoraabc.com',
      password: 'BiolabAdmin2025!',
      description: 'Usuario Empresa (RRHH)'
    },
    {
      email: 'admin@biolabsas.com',
      password: 'BiolabAdmin2025!',
      description: 'Usuario Administrador'
    },
    {
      email: 'medico.general@biolabsas.com',
      password: 'BiolabAdmin2025!',
      description: 'Usuario Médico'
    }
  ];
  
  for (const cred of credentials) {
    console.log(`\n📝 Probando: ${cred.description}`);
    console.log(`   Email: ${cred.email}`);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: cred.email,
        password: cred.password
      });
      
      if (response.data.success) {
        console.log(`   ✅ Login exitoso!`);
        console.log(`   Usuario: ${response.data.data.user.fullName}`);
        console.log(`   Rol: ${response.data.data.user.role}`);
        console.log(`   Token: ${response.data.data.accessToken.substring(0, 20)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.data?.message || error.message}`);
    }
  }
  
  console.log('\n\n📊 Prueba completada');
};

// Verificar que el servidor esté corriendo
axios.get('http://localhost:5000/health')
  .then(() => {
    console.log('✅ Servidor backend detectado en puerto 5000\n');
    testLogin();
  })
  .catch(() => {
    console.error('❌ Error: El servidor backend no está corriendo en el puerto 5000');
    console.error('   Por favor ejecuta: cd backend && npm run dev');
  });