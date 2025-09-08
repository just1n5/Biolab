// src/config/api.js - Configuración de API para el frontend
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Configuración de la API
export const API_CONFIG = {
  // URL base del backend
  // Use relative base by default so Vite proxy (`/api`) works in dev
  BASE_URL: import.meta.env.VITE_API_URL || '',
  
  // Activar/desactivar modo demo (sin backend)
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' || false,
  
  // Tiempo de espera para las peticiones
  TIMEOUT: 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    PATIENT_LOGIN: '/api/patient/login',
  },
  
  // Pacientes
  PATIENTS: {
    REGISTER: '/api/patients/register',
    SEARCH: '/api/patients/search',
  },
  
  // Visitas
  VISITS: {
    DETAILS: (visitId) => `/api/visits/${visitId}`,
    UPLOAD: (visitId) => `/api/visits/${visitId}/upload`,
    DELETE_RESULT: (visitId, resultId) => `/api/visits/${visitId}/results/${resultId}`,
  },
  
  // Resultados
  RESULTS: {
    GET: (visitId) => `/api/results/${visitId}`,
  }
};

// Función helper para construir URLs completas
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para manejar peticiones
export const apiRequest = async (url, options = {}) => {
  // Si estamos en modo demo, simular respuestas
  if (API_CONFIG.DEMO_MODE) {
    return simulateDemoResponse(url, options);
  }
  
  // Configuración por defecto
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
  };
  
  // Agregar token si existe
  const token = localStorage.getItem('employeeToken') || localStorage.getItem('patientToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(buildUrl(url), config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }
    
    // Si la respuesta es un blob (PDF), devolverlo directamente
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return await response.blob();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en API request:', error);
    throw error;
  }
};

// Simulador de respuestas para modo demo
const simulateDemoResponse = async (url, options) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Simular respuestas según el endpoint
  if (url.includes('/auth/login')) {
    return {
      success: true,
      token: 'demo-token-' + Date.now(),
      user: {
        id: 'demo-user-1',
        username: options.body ? JSON.parse(options.body).username : 'demo',
        fullName: 'Usuario Demo',
        role: 'Auxiliar',
        email: 'demo@biolabsas.com'
      }
    };
  }
  
  if (url.includes('/patient/login')) {
    return {
      success: true,
      token: 'demo-patient-token-' + Date.now(),
      visit: {
        id: 'demo-visit-1',
        examTypes: ['Hemograma', 'Glicemia'],
        status: 'Completado',
        hasResults: true
      }
    };
  }
  
  if (url.includes('/patients/register')) {
    return {
      success: true,
      message: 'Paciente registrado (modo demo)',
      patient: {
        id: 'demo-patient-' + Date.now(),
        fullName: 'Paciente Demo',
        document: '1234567890'
      },
      visit: {
        id: 'demo-visit-' + Date.now(),
        attentionCode: 'DEMO' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    };
  }
  
  if (url.includes('/patients/search')) {
    return {
      success: true,
      results: [
        {
          visitId: 'demo-visit-1',
          patient: {
            id: 'demo-patient-1',
            fullName: 'Juan Pérez',
            document: '1234567890',
            phone: '3001234567',
            email: 'juan@email.com'
          },
          examTypes: ['Hemograma', 'Glicemia'],
          status: 'Pendiente',
          hasResults: false,
          resultsCount: 0,
          registeredBy: 'Ana Rodríguez',
          createdAt: new Date()
        }
      ]
    };
  }
  
  // Respuesta por defecto
  return {
    success: true,
    message: 'Operación exitosa (modo demo)',
    data: {}
  };
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  buildUrl,
  apiRequest
};
